const express = require('express');
const router = express.Router();
const ChatSession = require('../models/ChatSession');
const VectorDocument = require('../models/VectorDocument');
const Course = require('../models/Course');
const AptitudeTopic = require('../models/AptitudeTopic');
const { protect } = require('../middleware/auth');
const { getEmbedding, callGemini } = require('../utils/gemini');

// @desc    Get all chat sessions for the current user
// @route   GET /api/aichat/sessions
router.get('/sessions', protect, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user._id, isArchived: false }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new chat session
// @route   POST /api/aichat/sessions
router.post('/sessions', protect, async (req, res) => {
  try {
    const session = await ChatSession.create({
      userId: req.user._id,
      title: req.body.title || 'New Conversation',
      messages: [{
        sender: 'ai',
        message: "Hello! I am your AI Doubt Solver Tutor. Ask me any questions about Operating Systems (OS), Database Management (DBMS), Generative AI, LangChain agents, or RAG models, and I will retrieve accurate answers for you!"
      }]
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single chat session details
// @route   GET /api/aichat/sessions/:id
router.get('/sessions/:id', protect, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Send message in a session and get AI response (RAG-powered)
// @route   POST /api/aichat/sessions/:id/message
router.post('/sessions/:id/message', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // 1. Add User Message
    session.messages.push({ sender: 'user', message });

    // 2. Fetch context (RAG)
    const courses = await Course.find();
    const aptTopics = await AptitudeTopic.find();

    const dbContext = {
      courses: courses.map(c => ({
        id: c._id.toString(),
        title: c.title,
        slug: c.slug || c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        level: c.difficulty,
        recommended_years: c.year_level || [],
        description: c.description
      })),
      tasks_and_practice: [
        ...aptTopics.map(t => ({
          id: t._id.toString(),
          title: t.title,
          category: t.category === 'quant' ? 'Quantitative Aptitude' : t.category === 'logical' ? 'Logical Reasoning' : 'Verbal Ability',
          slug: t.slug || t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          topics: [t.title],
          description: t.desc
        })),
        {
          id: "t_daily_coding",
          title: "Daily Coding Challenges",
          category: "Practice",
          slug: "daily-coding-challenges",
          description: "Hands-on problem solving in our interactive code sandbox."
        }
      ]
    };

    let topMatches = [];
    try {
      const queryEmbedding = await getEmbedding(message);
      const vectorDocs = await VectorDocument.find({});
      const scoredDocs = vectorDocs.map(doc => {
        let score = 0;
        if (doc.embedding && doc.embedding.length > 0) {
          let dotProduct = 0;
          let normA = 0;
          let normB = 0;
          for (let i = 0; i < doc.embedding.length; i++) {
            dotProduct += doc.embedding[i] * queryEmbedding[i];
            normA += doc.embedding[i] * doc.embedding[i];
            normB += queryEmbedding[i] * queryEmbedding[i];
          }
          if (normA > 0 && normB > 0) {
            score = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
          }
        }
        return { doc, score };
      });
      scoredDocs.sort((a, b) => b.score - a.score);
      topMatches = scoredDocs.slice(0, 5).map(item => item.doc);
    } catch (embErr) {
      console.warn('Embedding retrieval failed during persistent chat, using simple prompt fallback:', embErr);
    }

    const systemInstruction = `ACADEMIC & CAREER RAG ASSISTANT

You are the official AI Academic & Placement Advisor for "PrepPortal".
Your core task is to guide students (e.g., 1st to 4th-year engineering students) on career preparation, placement roadmaps, skill development, and jobs.

==================================================
CRITICAL RAG CONSTRAINTS (STRICTLY ENFORCED)
==================================================
1. EXCLUSIVE CATALOG RULE:
   - You MUST ONLY recommend courses, modules, tasks, and practice sets that exist within the provided [DATABASE_CONTEXT] below.
   - NEVER suggest or refer to external platforms directly unless explicitly present in [DATABASE_CONTEXT].

2. DETAILED ROADMAP GENERATION (MANDATORY FOR CAREER/ROADMAP QUERIES):
   If the student asks for a study plan, career plan, job roadmap:
   You MUST generate a massive, highly detailed response containing: Student Profile, Target Goal, Required Skills, Skill Gap Analysis, 12-Month Multi-Phase Roadmap (monthly breakdown), Weekly Study Plan (Monday to Sunday), Daily Goal Schedule, and Estimated Readiness score.
   Also include internal Route links:
   - \`[Practice DSA Now](/dsa)\`
   - \`[Start Mock Interview](/mock-interview)\`
   - \`[ATS Resume Builder](/resume-ats)\`
   - \`[Theory Hub](/theory)\`
   - \`[Notes & Syllabus](/notes)\`
   - \`[Courses Library](/courses)\`

3. RESPONSE FORMATTING:
   - Output beautiful, extensive structured Markdown with bold titles, headers, clear bullet points, code snippets, tables, or mermaid diagrams if requested.`;

    const prompt = `The student has queried: "${message}".

==================================================
RETRIEVED DATABASE CONTEXT (CATALOG AVAILABLE)
==================================================
[DATABASE_CONTEXT]
${JSON.stringify(dbContext, null, 2)}

==================================================
RELEVANT SYLLABUS & ROADMAP NOTES (VECTOR RETRIEVAL)
==================================================
${topMatches.map(m => `- [${m.type.toUpperCase()}] ${m.title}: ${m.content}`).join('\n')}

Please formulate a structured response.`;

    let aiResponse = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        aiResponse = await callGemini(prompt, systemInstruction);
      } catch (err) {
        console.warn('Gemini chat failed, using local offline fallback:', err);
      }
    }

    if (!aiResponse) {
      aiResponse = `I received your doubt about "${message}". As an AI Placement Advisor, I recommend that you check our standard courses or solve DSA problems to strengthen your preparation. For immediate practice, you can visit the [Practice DSA Now](/dsa) page.`;
    }

    // 3. Add AI Response
    session.messages.push({ sender: 'ai', message: aiResponse });

    // 4. Auto rename session title if it's the first message from user
    const userMsgsCount = session.messages.filter(m => m.sender === 'user').length;
    if (userMsgsCount === 1) {
      session.title = message.length > 30 ? message.substring(0, 30) + '...' : message;
    }

    session.updatedAt = new Date();
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update session fields (title, isPinned, isArchived)
// @route   PUT /api/aichat/sessions/:id
router.put('/sessions/:id', protect, async (req, res) => {
  try {
    const { title, isPinned, isArchived } = req.body;
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (title !== undefined) session.title = title;
    if (isPinned !== undefined) session.isPinned = isPinned;
    if (isArchived !== undefined) session.isArchived = isArchived;

    session.updatedAt = new Date();
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a session
// @route   DELETE /api/aichat/sessions/:id
router.delete('/sessions/:id', protect, async (req, res) => {
  try {
    const result = await ChatSession.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Session not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
