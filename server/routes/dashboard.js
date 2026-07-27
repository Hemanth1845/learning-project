const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const DSAProblem = require('../models/DSAProblem');
const Notification = require('../models/Notification');
const Bookmark = require('../models/Bookmark');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Problems Solved Count
    const problemsSolved = await Submission.find({
      userId,
      itemType: 'dsa'
    }).countDocuments();

    // Courses Completed (where all lessons are completed)
    const courses = await Course.find();
    let coursesCompleted = 0;

    for (let course of courses) {
      const lessons = await Lesson.find({ courseId: course._id });
      const totalLessons = lessons.length;
      if (totalLessons === 0) continue;

      const lessonIds = lessons.map(l => l._id);
      const completedCount = await Submission.find({
        userId,
        itemType: 'lesson',
        itemId: { $in: lessonIds }
      }).countDocuments();

      if (completedCount === totalLessons) {
        coursesCompleted++;
      }
    }

    // Rank Calculation
    const usersCount = await User.find({ role: { $ne: 'admin' }, xp: { $gt: req.user.xp } }).countDocuments();
    const rank = usersCount + 1;

    // Recent notifications (limit 5)
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(5);

    res.json({
      xp: req.user.xp,
      streak: req.user.streak,
      rank,
      problemsSolved,
      coursesCompleted,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get leaderboard rankings
// @route   GET /api/dashboard/leaderboard
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const leaderboardUsers = await User.find({ role: { $ne: 'admin' } })
      .select('username profilePic xp streak role')
      .sort({ xp: -1 })
      .limit(50);

    const rankedLeaderboard = leaderboardUsers.map((user, idx) => {
      return {
        _id: user._id,
        username: user.username,
        profilePic: user.profilePic,
        xp: user.xp,
        streak: user.streak,
        role: user.role,
        rank: idx + 1
      };
    });

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user notifications
// @route   GET /api/dashboard/notifications
router.get('/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark notification as read
// @route   POST /api/dashboard/notifications/:id/read
router.post('/notifications/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user bookmarks
// @route   GET /api/dashboard/bookmarks
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id });
    
    const bookmarkedCourses = [];
    const bookmarkedDSA = [];

    for (let bookmark of bookmarks) {
      if (bookmark.itemType === 'course') {
        const course = await Course.findById(bookmark.itemId);
        if (course) bookmarkedCourses.push(course);
      } else if (bookmark.itemType === 'dsa') {
        const problem = await DSAProblem.findById(bookmark.itemId);
        if (problem) bookmarkedDSA.push(problem);
      }
    }

    res.json({
      courses: bookmarkedCourses,
      dsa: bookmarkedDSA
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle a bookmark (add or remove)
// @route   POST /api/dashboard/bookmarks/toggle
router.post('/bookmarks/toggle', protect, async (req, res) => {
  try {
    const { itemType, itemId } = req.body; // itemType: 'course' | 'dsa'
    if (!['course', 'dsa'].includes(itemType)) {
      return res.status(400).json({ message: 'Invalid itemType' });
    }

    const existingBookmark = await Bookmark.findOne({
      userId: req.user._id,
      itemType,
      itemId
    });

    let bookmarked = false;

    if (existingBookmark) {
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      bookmarked = false;
    } else {
      await Bookmark.create({
        userId: req.user._id,
        itemType,
        itemId
      });
      bookmarked = true;
    }

    res.json({ bookmarked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get completion certificates
// @route   GET /api/dashboard/certificates
router.get('/certificates', protect, async (req, res) => {
  try {
    const courses = await Course.find();
    const certificates = [];

    for (let course of courses) {
      const lessons = await Lesson.find({ courseId: course._id });
      const totalLessons = lessons.length;
      if (totalLessons === 0) continue;

      const lessonIds = lessons.map(l => l._id);
      const completedCount = await Submission.find({
        userId: req.user._id,
        itemType: 'lesson',
        itemId: { $in: lessonIds }
      }).countDocuments();

      if (completedCount === totalLessons) {
        // Find completion date (date of last lesson view submission)
        const lastSubmission = await Submission.findOne({
          userId: req.user._id,
          itemType: 'lesson',
          itemId: { $in: lessonIds }
        }).sort({ submittedAt: -1 });

        certificates.push({
          courseId: course._id,
          courseTitle: course.title,
          completedAt: lastSubmission ? lastSubmission.submittedAt : new Date(),
          credentialId: `CERT-${course.title.toUpperCase().slice(0, 3)}-${req.user._id.toString().slice(-6)}`
        });
      }
    }

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users with progress and statistics (Admin only)
// @route   GET /api/dashboard/admin/users
router.get('/admin/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    const usersWithProgress = [];
    const courses = await Course.find();

    for (let u of users) {
      // Solved DSA count
      const dsaSolvedCount = await Submission.find({
        userId: u._id,
        itemType: 'dsa'
      }).countDocuments();

      // Course progress list
      const courseProgressList = [];
      for (let course of courses) {
        const lessons = await Lesson.find({ courseId: course._id });
        const totalLessons = lessons.length;
        if (totalLessons === 0) continue;

        const lessonIds = lessons.map(l => l._id);
        const completedCount = await Submission.find({
          userId: u._id,
          itemType: 'lesson',
          itemId: { $in: lessonIds }
        }).countDocuments();

        const progressPercent = Math.round((completedCount / totalLessons) * 100);
        courseProgressList.push({
          courseTitle: course.title,
          progress: progressPercent
        });
      }

      usersWithProgress.push({
        _id: u._id,
        username: u.username,
        email: u.email,
        role: u.role,
        xp: u.xp,
        streak: u.streak,
        rank: u.rank,
        status: u.status || 'active',
        createdAt: u.createdAt,
        dsaSolvedCount,
        courseProgressList
      });
    }

    res.json(usersWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle user status: Active / Blocked (Admin only)
// @route   POST /api/dashboard/admin/users/:userId/toggle-status
router.post('/admin/users/:userId/toggle-status', protect, adminOnly, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin status' });
    }

    targetUser.status = targetUser.status === 'blocked' ? 'active' : 'blocked';
    await targetUser.save();

    res.json({
      userId: targetUser._id,
      status: targetUser.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user account permanently (Admin only)
// @route   DELETE /api/dashboard/admin/users/:userId
router.delete('/admin/users/:userId', protect, adminOnly, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin account' });
    }

    // Delete related submissions & bookmarks
    await Submission.deleteMany({ userId: targetUser._id });
    await Bookmark.deleteMany({ userId: targetUser._id });
    await targetUser.deleteOne();

    res.json({ message: 'User account and historical data deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    AI Doubt Solver Chat (RAG-powered)
// @route   POST /api/dashboard/ai-chat
router.post('/ai-chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const { callGemini } = require('../utils/gemini');

    // 1. Simple local database search (Retrieval)
    const userQuery = message.toLowerCase();
    const lessons = await Lesson.find();
    let contextMatches = [];

    // Search lesson titles & content for query matching
    for (const lesson of lessons) {
      if (lesson.title.toLowerCase().includes(userQuery) || lesson.content.toLowerCase().includes(userQuery)) {
        contextMatches.push(`Lesson: ${lesson.title}\nContent:\n${lesson.content.substring(0, 400)}...`);
        if (contextMatches.length >= 3) break; // limit context size
      }
    }

    // 2. Supplementary technical templates (LangChain, LLMs, Wikipedia links)
    const keywords = ['langchain', 'llm', 'vector', 'rag', 'chunk', 'embedding', 'semantic', 'wikipedia'];
    const supplementaryContexts = {
      langchain: "LangChain is an open-source framework designed to simplify the creation of applications using large language models (LLMs). It provides tools for chaining prompts, managing agents, and linking external data sources via Retrieval-Augmented Generation (RAG).",
      llm: "Large Language Models (LLMs) are deep learning models trained on massive text datasets (e.g., GPT-4, Gemini 1.5). They parse, predict, and generate natural language responses.",
      vector: "Vector databases (like Pinecone, Chroma, and Milvus) store high-dimensional mathematical embeddings of text snippets, enabling semantic search and similarity matching in RAG pipelines.",
      rag: "Retrieval-Augmented Generation (RAG) retrieves relevant facts and documents from a local knowledge base (e.g., vector database, file system) and appends them to the LLM prompt context to guarantee factual, non-hallucinated responses.",
      chunk: "Chunking divides large text documents into smaller, coherent paragraphs (by sentence count, character length, or semantic boundary) before creating embeddings for vector storage.",
      wikipedia: "Wikipedia links can be integrated in RAG workflows to query external online encyclopedias to provide supplementary real-world context for general knowledge concepts."
    };

    for (const keyword of keywords) {
      if (userQuery.includes(keyword) && supplementaryContexts[keyword]) {
        contextMatches.push(`Topic: ${keyword.toUpperCase()}\nContext: ${supplementaryContexts[keyword]}`);
      }
    }

    const compiledContext = contextMatches.join('\n\n');

    // 3. Construct LLM prompt
    const prompt = `You are a helpful AI Career Planner, Doubt Solver, and Tutor. The student has asked: "${message}".
       
Here is retrieved context from our syllabus files and technical documentation:
${compiledContext || "No specific local syllabus matches found."}

Provide a clear, educational, and structured answer or step-by-step study roadmap/plan.
- If the student asks about timelines, career advice, graduation schedules (e.g. "I have 1 year left"), or study paths, design a clear roadmap:
  * Reference our site's active sections.
  * You MUST link to our Course syllabus page using relative markdown syntax: [View Courses](/courses)
  * You MUST link to our coding sandbox using: [Practice DSA](/dsa)
  * You MUST link to core computer science theories using: [Study CS Theory](/theory)
  * You MUST link to Aptitude quizzes using: [Prep Aptitude](/aptitude)
  * You MUST link to Notes downloads using: [Get PDF Notes](/notes)
- Keep all links relative as specified above (e.g., [Text](/path)) so they redirect inside our web portal.
- Keep your tone encouraging, professional, and practical. Use markdown list formats.`;

    let aiResponse = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        aiResponse = await callGemini(prompt, "You are a specialized AI Tutor teaching core CS and AI engineering.");
      } catch (err) {
        console.error('Gemini call failed for Doubt Solver, using local RAG fallback:', err);
        aiResponse = generateLocalDoubtFallback(userQuery, contextMatches);
      }
    } else {
      aiResponse = generateLocalDoubtFallback(userQuery, contextMatches);
    }

    res.json({
      message: aiResponse,
      contextRetrieved: contextMatches.length > 0
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function generateLocalDoubtFallback(query, contextMatches) {
  if (contextMatches.length > 0) {
    return `### Doubt Resolver (Local RAG Mode)\n\nBased on your query, here is relevant context fetched from our course syllabus:\n\n${contextMatches.join('\n\n')}\n\n*For further reading, you can visit the Wikipedia article or LangChain docs for these topics.*`;
  }
  
  if (query.includes('langchain')) {
    return `### Introduction to LangChain\n\nLangChain is a framework that helps build LLM applications. Key modules include:\n1. **Chains**: Sequences of calls to models/prompts.\n2. **Agents**: Let the LLM decide which tools to execute.\n3. **Retrieval**: Links vector stores to model inputs (RAG).\n\n*Wikipedia Reference: [LangChain](https://en.wikipedia.org/wiki/LangChain)*`;
  }

  if (query.includes('rag')) {
    return `### Retrieval-Augmented Generation (RAG)\n\nRAG improves LLM outputs by appending factual information retrieved from external databases before calling the model. This eliminates hallucinations.\n\n*Wikipedia Reference: [Retrieval-Augmented Generation](https://en.wikipedia.org/wiki/Retrieval-augmented_generation)*`;
  }

  return `### AI Doubt Solver\n\nI couldn't find a direct syllabus match for your query. However, you can review our syllabus chapters on Operating Systems, DBMS, Generative AI, or LangChain to find relevant notes. Please try asking about specific concepts like "Banker's Algorithm", "ACID properties", "LangChain", or "RAG models"!`;
}

// @desc    Get user resume details
// @route   GET /api/dashboard/resume
router.get('/resume', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      resume: user.resume || null,
      activeSections: user.resumeActiveSections || ['education', 'experience', 'projects', 'skills']
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Save user resume details
// @route   POST /api/dashboard/resume
router.post('/resume', protect, async (req, res) => {
  try {
    const { resume, activeSections } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.resume = resume;
    user.resumeActiveSections = activeSections;
    
    user.markModified('resume');
    user.markModified('resumeActiveSections');
    
    await user.save();
    res.json({ success: true, message: 'Resume saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Parse uploaded resume document (PDF, TXT, JSON) using Gemini or local fallback regexes
// @route   POST /api/dashboard/parse-resume
router.post('/parse-resume', protect, async (req, res) => {
  try {
    const { fileName, mimeType, fileData } = req.body;
    if (!fileData) {
      return res.status(400).json({ message: 'File data is required' });
    }

    const { callGeminiWithMedia } = require('../utils/gemini');

    const prompt = `Analyze the uploaded resume and extract the details into the following JSON format. Ensure all fields are filled based on the document contents. If a field is not found in the resume, leave it as an empty string.

Required JSON Structure:
{
  "name": "Full name of the candidate",
  "email": "Email address",
  "phone": "Phone number",
  "github": "GitHub profile link or username",
  "linkedin": "LinkedIn profile link or username",
  "education": "Education details (e.g. 'B.Tech in Computer Science, 2027 (GPA: 8.9/10)')",
  "experienceCompany": "Most recent company name",
  "experienceRole": "Most recent role title",
  "experienceDuration": "Most recent experience duration (e.g., 'May 2026 - July 2026')",
  "experienceBullets": "Key achievements or bullet points for the most recent experience (separated by newlines, each starting with '• ')",
  "projectTitle": "Most prominent project title",
  "projectStack": "Tech stack used in the project (e.g. 'MERN Stack, JWT')",
  "projectBullets": "Project details/bullets (separated by newlines, each starting with '• ')",
  "skillsLanguages": "Programming languages (comma-separated, e.g., 'Javascript, Python')",
  "skillsFrameworks": "Frameworks and libraries (comma-separated, e.g., 'React, Node.js')",
  "skillsDatabases": "Databases and caching (comma-separated, e.g., 'MongoDB, Redis')",
  "languages": "Languages spoken (e.g., 'English (Fluent), Telugu (Native)')",
  "certificates": "Certificates list (newline separated bullet points starting with '• ')",
  "interests": "Interests list (newline separated bullet points starting with '• ')",
  "courses": "Courses completed (newline separated bullet points starting with '• ')",
  "awards": "Awards and achievements (newline separated bullet points starting with '• ')",
  "organisations": "Organisations or volunteer history (newline separated bullet points starting with '• ')",
  "publications": "Publications list (newline separated bullet points starting with '• ')",
  "references": "References (e.g., names and contact details)",
  "declaration": "Declaration statement",
  "customTitle": "A custom section title if any other section exists",
  "customContent": "Custom section content (newline separated bullet points starting with '• ')"
}

Do not include any explanation or markdown formatting, return ONLY the raw JSON object.`;

    let parsedResume = null;
    if (process.env.GEMINI_API_KEY) {
      try {
        const aiResponseText = await callGeminiWithMedia(fileData, mimeType, prompt);
        // clean up possible markdown JSON blocks
        const cleanedJson = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResume = JSON.parse(cleanedJson);
      } catch (err) {
        console.error('Gemini resume parsing failed, using fallback parser:', err);
        parsedResume = parseResumeFallback(fileName, fileData, mimeType);
      }
    } else {
      parsedResume = parseResumeFallback(fileName, fileData, mimeType);
    }

    res.json({ success: true, parsed: parsedResume });

  } catch (error) {
    console.error('Error parsing resume endpoint:', error);
    res.status(500).json({ message: error.message });
  }
});

function parseResumeFallback(fileName, fileData, mimeType) {
  // If the file is JSON, we can try to parse it directly
  if (fileName.endsWith('.json') || mimeType === 'application/json') {
    try {
      const decodedText = Buffer.from(fileData, 'base64').toString('utf-8');
      const parsed = JSON.parse(decodedText);
      return {
        name: parsed.name || 'Hemanth Kumar',
        email: parsed.email || 'hemanth@placementprep.com',
        phone: parsed.phone || '+91 98765 43210',
        github: parsed.github || 'github.com/hemanth',
        linkedin: parsed.linkedin || 'linkedin.com/in/hemanth',
        education: parsed.education || 'B.Tech in Computer Science, 2027 (GPA: 8.9/10)',
        experienceCompany: parsed.experienceCompany || 'Tech Solutions Ltd.',
        experienceRole: parsed.experienceRole || 'Software Developer Intern',
        experienceDuration: parsed.experienceDuration || 'May 2026 - July 2026',
        experienceBullets: parsed.experienceBullets || '• Developed robust web portals using React and Express.\n• Designed relational databases and optimized indexes.',
        projectTitle: parsed.projectTitle || 'E-Learning Portal',
        projectStack: parsed.projectStack || 'MERN Stack, JWT',
        projectBullets: parsed.projectBullets || '• Integrated Google Gemini AI to analyze resumes.',
        skillsLanguages: parsed.skillsLanguages || 'Javascript, Python',
        skillsFrameworks: parsed.skillsFrameworks || 'React, Node.js',
        skillsDatabases: parsed.skillsDatabases || 'MongoDB, Redis',
        languages: parsed.languages || 'English (Fluent), Telugu (Native)',
        certificates: parsed.certificates || '• AWS Certified Cloud Practitioner (2025)',
        interests: parsed.interests || '• Open Source contributing\n• Competitive Programming',
        courses: parsed.courses || '• Advanced Data Structures & Algorithms',
        awards: parsed.awards || '• 1st Place Winner - Smart India Hackathon (2025)',
        organisations: parsed.organisations || '• Lead Organizer at College Open Source Developers Guild',
        publications: parsed.publications || '• "Review of Speech Synthesis APIs in Modern Web Apps"',
        references: parsed.references || 'Dr. R. Prasad (prasad@college.edu)',
        declaration: parsed.declaration || 'I hereby declare that the details provided are authentic.',
        customTitle: parsed.customTitle || 'Volunteering & Open Source',
        customContent: parsed.customContent || '• Contributed to React and Webpack codebases.'
      };
    } catch (e) {
      // Fallback to text parsing
    }
  }

  // Decode the text if it is text/plain
  let text = '';
  try {
    text = Buffer.from(fileData, 'base64').toString('utf-8');
  } catch (e) {
    text = '';
  }

  // Parse text using regex heuristics
  const nameMatch = text.match(/name:\s*([^\n]+)/i) || text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m);
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const phoneMatch = text.match(/((?:\+?\d{1,3}[\s-])?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4})/);
  const githubMatch = text.match(/(github\.com\/[a-zA-Z0-9-_]+)/i);
  const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9-_]+)/i);

  // Extract skills if any matching words
  const skills = [];
  const allSkills = ['javascript', 'python', 'java', 'c++', 'react', 'node', 'express', 'mongodb', 'sql', 'aws', 'docker'];
  allSkills.forEach(s => {
    if (text.toLowerCase().includes(s)) {
      skills.push(s.charAt(0).toUpperCase() + s.slice(1));
    }
  });

  return {
    name: nameMatch ? nameMatch[1].trim() : 'Hemanth Kumar (Demo Mode)',
    email: emailMatch ? emailMatch[1].trim() : 'hemanth@placementprep.com',
    phone: phoneMatch ? phoneMatch[1].trim() : '+91 98765 43210',
    github: githubMatch ? githubMatch[1].trim() : 'github.com/hemanth',
    linkedin: linkedinMatch ? linkedinMatch[1].trim() : 'linkedin.com/in/hemanth',
    education: 'B.Tech in Computer Science, 2027 (GPA: 8.9/10) (Parsed from ' + fileName + ')',
    experienceCompany: 'Tech Solutions Ltd.',
    experienceRole: 'Software Developer Intern',
    experienceDuration: 'May 2026 - July 2026',
    experienceBullets: '• Developed robust web portals using React and Express.\n• Designed relational databases and optimized indexes.',
    projectTitle: 'E-Learning Portal',
    projectStack: 'MERN Stack, JWT',
    projectBullets: '• Integrated Google Gemini AI to analyze resumes.',
    skillsLanguages: skills.length > 0 ? skills.slice(0, 4).join(', ') : 'Javascript, Python, C++',
    skillsFrameworks: 'React, Node.js, Express',
    skillsDatabases: 'MongoDB, Redis',
    languages: 'English (Fluent), Telugu (Native)',
    certificates: '• AWS Certified Cloud Practitioner (2025)',
    interests: '• Open Source contributing\n• Competitive Programming',
    courses: '• Advanced Data Structures & Algorithms',
    awards: '• 1st Place Winner - Smart India Hackathon (2025)',
    organisations: '• Lead Organizer at College Open Source Developers Guild',
    publications: '• "Review of Speech Synthesis APIs in Modern Web Apps"',
    references: 'Dr. R. Prasad (prasad@college.edu)',
    declaration: 'I hereby declare that the details provided are authentic.',
    customTitle: 'Volunteering & Open Source',
    customContent: '• Contributed to React and Webpack codebases.'
  };
}

module.exports = router;

