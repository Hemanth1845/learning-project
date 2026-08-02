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
    const bookmarkedTheory = [];
    const bookmarkedAptitude = [];

    for (let bookmark of bookmarks) {
      if (bookmark.itemType === 'course') {
        const course = await Course.findById(bookmark.itemId);
        if (course) bookmarkedCourses.push(course);
      } else if (bookmark.itemType === 'dsa') {
        const problem = await DSAProblem.findById(bookmark.itemId);
        if (problem) bookmarkedDSA.push(problem);
      } else if (bookmark.itemType === 'theory') {
        const TheoryChapter = require('../models/TheoryChapter');
        const chapter = await TheoryChapter.findById(bookmark.itemId);
        if (chapter) bookmarkedTheory.push(chapter);
      } else if (bookmark.itemType === 'aptitude') {
        const AptitudeTopic = require('../models/AptitudeTopic');
        const topic = await AptitudeTopic.findById(bookmark.itemId);
        if (topic) bookmarkedAptitude.push(topic);
      }
    }

    res.json({
      courses: bookmarkedCourses,
      dsa: bookmarkedDSA,
      theory: bookmarkedTheory,
      aptitude: bookmarkedAptitude
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
        profilePic: u.profilePic || '',
        status: u.status || 'active',
        createdAt: u.createdAt,
        phoneNumber: u.phoneNumber || '',
        selectedCourse: u.selectedCourse || '',
        yearOfStudy: u.yearOfStudy || '3rd Year',
        branch: u.branch || 'Computer Science & Engineering',
        dsaSolvedCount,
        courseProgressList
      });
    }

    res.json(usersWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Export users list to CSV format (Excel compatible)
// @route   GET /api/dashboard/admin/users/export
router.get('/admin/users/export', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    
    let csv = 'ID,Username,Email,Phone Number,Year of Study,Branch,Selected Course,Plan,XP,Streak,Joined Date\n';
    
    for (let u of users) {
      const row = [
        u._id.toString(),
        `"${u.username.replace(/"/g, '""')}"`,
        `"${u.email.replace(/"/g, '""')}"`,
        `"${(u.phoneNumber || '').replace(/"/g, '""')}"`,
        `"${(u.yearOfStudy || '').replace(/"/g, '""')}"`,
        `"${(u.branch || '').replace(/"/g, '""')}"`,
        `"${(u.selectedCourse || '').replace(/"/g, '""')}"`,
        `"${(u.plan || '').replace(/"/g, '""')}"`,
        u.xp,
        u.streak,
        u.createdAt ? u.createdAt.toISOString() : ''
      ];
      csv += row.join(',') + '\n';
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users_list.csv');
    res.send(csv);
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

    const VectorDocument = require('../models/VectorDocument');
    const Course = require('../models/Course');
    const AptitudeTopic = require('../models/AptitudeTopic');
    const { getEmbedding, callGemini } = require('../utils/gemini');

    // 1. Compile the active Database Context dynamically
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

    // 2. Get vector embedding of query & perform similarity search
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

    // Take top 5 scoring documents
    scoredDocs.sort((a, b) => b.score - a.score);
    const topMatches = scoredDocs.slice(0, 5).map(item => item.doc);

    // 3. Setup prompt instructions
    const systemInstruction = `ACADEMIC & CAREER RAG ASSISTANT

You are the official AI Academic & Placement Advisor for "PrepPortal".
Your core task is to guide students (e.g., 1st to 4th-year engineering students) on career preparation, placement roadmaps, skill development, and jobs.

==================================================
CRITICAL RAG CONSTRAINTS (STRICTLY ENFORCED)
==================================================
1. EXCLUSIVE CATALOG RULE:
   - You MUST ONLY recommend courses, modules, tasks, and practice sets that exist within the provided [DATABASE_CONTEXT] below.
   - NEVER suggest or refer to external platforms (such as Coursera, Udemy, LeetCode, W3Schools, or IndiaBIX directly) unless explicitly present in [DATABASE_CONTEXT].
   - If a requested topic is missing from [DATABASE_CONTEXT], state:
     "We currently do not offer a course on [Topic] on our platform, but here are related modules you can take:" followed by closest match in context.

2. DETAILED ROADMAP GENERATION (MANDATORY FOR CAREER/ROADMAP QUERIES):
   If the student asks for a study plan, career plan, job roadmap (e.g., getting a high packages like ₹20 LPA, cracking TCS/Google, or learning roadmaps for 1st/2nd/3rd/4th years):
   You MUST generate a massive, highly detailed response containing the following sections:
   - **Student Profile Analysis**: Summary of student's current year and goal.
   - **Target Goal**: (e.g. ₹20 LPA Placement Strategy / TCS Assessment).
   - **Required Skills & Technologies**: Detailed tech stacks from our catalog.
   - **Skill Gap Analysis**: What they need to learn based on what they already know.
   - **12-Month/Multi-Phase Roadmap**: Detailed monthly breakdown (Phase 1, Phase 2, Phase 3, Phase 4, Phase 5, Phase 6).
   - **Weekly Study Plan**: Day-by-day structured routine (Monday to Sunday).
   - **Daily Goal Schedule**: Example of a high-efficiency student daily agenda.
   - **Estimated Placement Readiness Score**: A percentage (e.g., 85%).
   - **Direct Platform Links**: Add direct Markdown links to internal routes for immediate action:
     - To practice coding: \`[Practice DSA Now](/dsa)\`
     - To take mock call: \`[Start Mock Interview](/mock-interview)\`
     - To rebuild resume: \`[ATS Resume Builder](/resume-ats)\`
     - To study CS topics: \`[Theory Hub](/theory)\`
     - To read PDF files: \`[Notes & Syllabus](/notes)\`
     - To open courses: \`[Courses Library](/courses)\`

3. RESPONSE FORMATTING:
   - Output beautiful, extensive structured Markdown with bold titles, headers, clear bullet points, and code snippets or tables where helpful.
   - Maintain a supportive, expert mentor voice.

==================================================
STUDENT INFO (FOR CUSTOM ROADMAPS)
==================================================
Current Academic Year: ${req.user.yearOfStudy || '3rd Year'}
Current Branch: ${req.user.branch || 'Computer Science & Engineering'}
Current XP: ${req.user.xp || 0} XP
Login Streak: ${req.user.streak || 0} Days
`;

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

==================================================
GUIDANCE INSTRUCTIONS
==================================================
Please formulate a structured response. Ground your answers strictly on the catalog, syllabus, and career notes above.`;

    let aiResponse = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        aiResponse = await callGemini(prompt, systemInstruction);
      } catch (err) {
        console.error('Gemini call failed for Doubt Solver, using local RAG fallback:', err);
        aiResponse = generateLocalDoubtFallback(message.toLowerCase(), topMatches, req.user);
      }
    } else {
      aiResponse = generateLocalDoubtFallback(message.toLowerCase(), topMatches, req.user);
    }

    res.json({
      message: aiResponse,
      contextRetrieved: topMatches.length > 0
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function generateLocalDoubtFallback(query, contextMatches, user) {
  const userYear = user ? user.yearOfStudy : '3rd Year';

  if (query.includes('first year') || query.includes('1st year') || query.includes('html') || query.includes('20 lpa') || query.includes('roadmap')) {
    return `### ⚡ ₹20 LPA Placement Roadmap & Study Plan

#### 1. Student Profile Analysis
*   **Current Level**: 1st Year Engineering Student
*   **Current Skills**: HTML, CSS
*   **Target Goal**: ₹20 LPA Software Engineering Placement

#### 2. Skill Gap Analysis
*   **Strengths**: Solid start on basic HTML & CSS web structures.
*   **Gap Areas**: Lacks algorithmic problem solving (DSA), object-oriented programming (OOP), server-side backend logic, and database management query systems.

---

#### 3. 12-Month Multi-Phase Action Plan

*   **Phase 1 (Months 1-2): Master Programming Foundations**
    *   Learn Python or Java syntax: complete **[Courses Library](/courses)**.
    *   Study Git version control and Linux fundamentals.
*   **Phase 2 (Months 3-5): Data Structures & Algorithms (DSA)**
    *   Study arrays, recursion, linked lists, and sorting in **[Practice DSA Now](/dsa)**.
    *   Aim to solve at least 2 coding questions daily.
*   **Phase 3 (Months 6-8): Advanced Web Dev (Full-Stack)**
    *   Build modern UIs using React and connect it to a Node/Express backend.
    *   Complete **[Database Masterclass](/courses)** to study SQL normalizations and indexing.
*   **Phase 4 (Months 9-10): Technical Theory Hub**
    *   Prepare core computer science fundamentals (OS, Networks) at **[Theory Hub](/theory)**.
*   **Phase 5 (Months 11-12): Resume & Placement Preparation**
    *   Build an ATS-proof resume on **[ATS Resume Builder](/resume-ats)**.
    *   Take mock interviews at **[Start Mock Interview](/mock-interview)**.

---

#### 4. Weekly Day-by-Day Study Plan
*   **Monday - Wednesday**: Focus on Algorithmic Practice at **[Practice DSA Now](/dsa)**.
*   **Thursday - Friday**: Full-Stack project coding & lessons at **[Courses Library](/courses)**.
*   **Saturday**: Revision notes, quizzes, and CS papers at **[Theory Hub](/theory)**.
*   **Sunday**: Weekly challenge & daily login streaks check.

---

#### 5. Estimated Placement Readiness
*   **Score**: **82%** (Placement Ready upon Phase completion)
*   **Timeline**: 12 Months

---

### Action Center:
*   👉 **[Courses Library](/courses)**
*   👉 **[Practice DSA Now](/dsa)**
*   👉 **[Start Mock Interview](/mock-interview)**
*   👉 **[ATS Resume Builder](/resume-ats)**`;
  }

  if (query.includes('second year') || query.includes('2nd year')) {
    return `### ⚡ 2nd-Year Study Plan (RAG Offline Mode)

*   **Phase 1: Core Tech Skills**: Learn OOP and Java in **[Courses Library](/courses)** and study database structure queries.
*   **Phase 2: Aptitude Prep**: Solve verbal and logical questions in **[Prep Aptitude](/aptitude)**.
*   **Phase 3: Placement Action Plan**: Start practicing medium problem sets on **[Practice DSA Now](/dsa)**.

👉 **[Courses Library](/courses)** | **[Practice DSA Now](/dsa)**`;
  }
  
  if (query.includes('third year') || query.includes('3rd year') || (query.includes('learn') && userYear === '3rd Year')) {
    return `### ⚡ 3rd-Year Placement Prep Plan (RAG Offline Mode)

*   **Phase 1: Core Tech Skills**: master DSA with Java and SQL normalizations in **[Courses Library](/courses)**.
*   **Phase 2: Aptitude Prep**: Solve quantitative math modules in **[Prep Aptitude](/aptitude)** (e.g. Time & Work).
*   **Phase 3: Placement Action Plan**: Complete mock call evaluations at **[Start Mock Interview](/mock-interview)** and scan resume in **[ATS Resume Builder](/resume-ats)**.

👉 **[Start Mock Interview](/mock-interview)** | **[ATS Resume Builder](/resume-ats)**`;
  }

  if (query.includes('fourth year') || query.includes('4th year')) {
    return `### ⚡ 4th-Year Placement Prep Plan (RAG Offline Mode)

*   **Phase 1: Core Tech Skills**: Complete Core CS Fundamentals (OS, Networks, System Design) in **[Courses Library](/courses)**.
*   **Phase 2: Aptitude Prep**: Solve mock placement tests in **[Prep Aptitude](/aptitude)**.
*   **Phase 3: Placement Action Plan**: Take mock calls at **[Start Mock Interview](/mock-interview)**.

👉 **[Start Mock Interview](/mock-interview)**`;
  }

  if (query.includes('ai engineer') || query.includes('artificial intelligence')) {
    return `### ⚡ AI Engineer Study Path (RAG Offline Mode)

*   **Phase 1: Core Coding**: Master Python coding syntax in **[Courses Library](/courses)**.
*   **Phase 2: AI & LLMs**: Complete Generative AI course modules covering vector databases, prompt techniques, and LangChain.
*   **Phase 3: Projects**: Build RAG-enabled chatbots and analyze them in **[ATS Resume Builder](/resume-ats)**.

👉 **[Courses Library](/courses)**`;
  }

  if (query.includes('tcs') || query.includes('crack tcs')) {
    return `### ⚡ TCS Placement Preparation Guide (RAG Offline Mode)

*   **Phase 1: Cognitive Aptitude**: Practice quantitative modules in **[Prep Aptitude](/aptitude)**.
*   **Phase 2: Coding Assessment**: Solve array and string algorithms in **[Practice DSA Now](/dsa)**.
*   **Phase 3: Technical Interviews**: Review OS scheduling and normalizations in **[Theory Hub](/theory)**.

👉 **[Prep Aptitude](/aptitude)** | **[Practice DSA Now](/dsa)**`;
  }
  
  if (contextMatches.length > 0) {
    return `### Academic Doubt Solver (Local RAG Offline Mode)

Based on your query, here is relevant context fetched from our course syllabus:

${contextMatches.map(m => `**${m.title}** (${m.type}): ${m.content}`).join('\n\n')}

*Navigate to these modules: [Courses](/courses), [Theory Hub](/theory), [Prep Aptitude](/aptitude).*`;
  }

  return `### AI Doubt Solver

I couldn't find a direct syllabus match for your query. 

*   To learn programming, visit **[Courses Library](/courses)**.
*   To practice problem-solving, visit **[Practice DSA Now](/dsa)**.
*   To study core computer science, visit **[Theory Hub](/theory)**.
*   To practice aptitude, visit **[Prep Aptitude](/aptitude)**.`;
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

    const { callGemini } = require('../utils/gemini');

    // 1. Extract text from base64 PDF or Text content
    let text = '';
    if (fileName.toLowerCase().endsWith('.pdf') || mimeType === 'application/pdf') {
      try {
        const pdf = require('pdf-parse');
        const buffer = Buffer.from(fileData, 'base64');
        const pdfData = await pdf(buffer);
        text = pdfData.text;
      } catch (err) {
        console.error('PDF parsing error, falling back to string conversion:', err);
      }
    }

    if (!text) {
      try {
        text = Buffer.from(fileData, 'base64').toString('utf-8');
      } catch (e) {
        text = '';
      }
    }

    let parsedResume = null;
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Analyze this resume and extract the details into the following JSON format. Ensure all fields are filled based on the document contents. If a field is not found in the resume, leave it as an empty string.

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
  "experienceDuration": "Most recent experience duration",
  "experienceBullets": "Key achievements or bullet points for the experience (separated by newlines, each starting with '• ')",
  "projectTitle": "Most prominent project title",
  "projectStack": "Tech stack used in the project",
  "projectBullets": "Project details/bullets (separated by newlines, each starting with '• ')",
  "skillsLanguages": "Programming languages (comma-separated)",
  "skillsFrameworks": "Frameworks and libraries (comma-separated)",
  "skillsDatabases": "Databases and caching (comma-separated)",
  "languages": "Languages spoken",
  "certificates": "Certificates list (newline separated bullet points starting with '• ')",
  "interests": "Interests list (newline separated bullet points starting with '• ')",
  "courses": "Courses completed (newline separated bullet points starting with '• ')",
  "awards": "Awards and achievements (newline separated bullet points starting with '• ')",
  "organisations": "Organisations or volunteer history (newline separated bullet points starting with '• ')",
  "publications": "Publications list (newline separated bullet points starting with '• ')",
  "references": "References",
  "declaration": "Declaration statement",
  "customTitle": "Custom section title",
  "customContent": "Custom section content"
}

Resume Content:
"${text.substring(0, 10000)}"

Return ONLY the raw JSON object. Do not include markdown formatting or backticks.`;

        const responseText = await callGemini(prompt);
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResume = JSON.parse(cleanedJson);
      } catch (err) {
        console.error('Gemini resume parsing failed, using fallback parser:', err);
        parsedResume = parseResumeFallbackText(text, fileName, req.user);
      }
    } else {
      parsedResume = parseResumeFallbackText(text, fileName, req.user);
    }

    res.json({ success: true, parsed: parsedResume });

  } catch (error) {
    console.error('Error parsing resume endpoint:', error);
    res.status(500).json({ message: error.message });
  }
});

function parseResumeFallbackText(text, fileName, user) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const defaultName = user ? (user.username.charAt(0).toUpperCase() + user.username.slice(1)) : 'Placement Candidate';
  
  // Heuristic search for Candidate Name on the first 5 lines
  let candidateName = '';
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (line.length > 3 && !line.includes('@') && !line.includes('http') && !line.includes(':') && !/\d{5,}/.test(line)) {
      if (/^[A-Za-z\s.]+$/.test(line)) {
        candidateName = line.trim();
        break;
      }
    }
  }

  if (!candidateName && fileName) {
    const cleanFileName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]resume/i, "").trim();
    if (cleanFileName && cleanFileName.length > 2 && !/resume/i.test(cleanFileName)) {
      candidateName = cleanFileName.charAt(0).toUpperCase() + cleanFileName.slice(1);
    }
  }
  if (!candidateName) {
    candidateName = defaultName;
  }

  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const phoneMatch = text.match(/((?:\+?\d{1,3}[\s-])?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}|\+?\d{10,12})/);
  const githubMatch = text.match(/(github\.com\/[a-zA-Z0-9-_/]+)/i);
  const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9-_/]+)/i);

  // Extract skills dynamically
  const skillsList = ['javascript', 'react', 'node', 'python', 'java', 'c++', 'sql', 'mongodb', 'express', 'html', 'css', 'docker', 'aws', 'spring boot', 'mysql', 'postgresql', 'redis', 'firebase', 'git', 'github'];
  const matchedSkills = [];
  skillsList.forEach(s => {
    const reg = new RegExp('\\b' + s.replace('.', '\\.').replace('+', '\\+') + '\\b', 'i');
    if (reg.test(text)) {
      matchedSkills.push(s.charAt(0).toUpperCase() + s.slice(1));
    }
  });

  // Extract education details
  const collegeMatch = text.match(/([A-Za-z0-9.\s,]+(?:University|Institute|College|Foundation|Academy|School|K\.L\.\s*University))/i);
  const degreeMatch = text.match(/(B\.Tech|M\.Tech|B\.E|B\.Sc|M\.Sc|MCA|BCA|MBA|Bachelor|Master)\s*(?:in|of)?\s*([A-Za-z\s&]+)/i);
  const cgpaMatch = text.match(/(?:CGPA|GPA|Grade|Pointer):\s*([0-9./]+)/i) || text.match(/\b([0-9]\.[0-9]{1,2})\b/);

  let educationStr = '';
  if (collegeMatch) {
    educationStr = `${degreeMatch ? degreeMatch[0].trim() : 'B.Tech'} at ${collegeMatch[0].trim()} ${cgpaMatch ? `(CGPA: ${cgpaMatch[1]})` : ''}`;
  }

  // Extract projects list
  let projectTitle = '';
  let projectStack = '';
  let projectBullets = '';
  const projectIdx = text.toLowerCase().indexOf('projects');
  if (projectIdx !== -1) {
    const projectSectionText = text.substring(projectIdx + 8, projectIdx + 800);
    const pLines = projectSectionText.split('\n').map(l => l.trim()).filter(Boolean);
    if (pLines.length > 0) {
      projectTitle = pLines[0].replace(/[^a-zA-Z0-9\s-]/g, '').trim();
      const bulletLines = pLines.filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'));
      if (bulletLines.length > 0) {
        projectBullets = bulletLines.slice(0, 3).join('\n');
      }
    }
  }

  return {
    name: candidateName,
    email: emailMatch ? emailMatch[1].trim() : (user ? user.email : ''),
    phone: phoneMatch ? phoneMatch[1].trim() : '',
    github: githubMatch ? githubMatch[1].trim() : '',
    linkedin: linkedinMatch ? linkedinMatch[1].trim() : '',
    education: educationStr,
    experienceCompany: '',
    experienceRole: '',
    experienceDuration: '',
    experienceBullets: '',
    projectTitle: projectTitle,
    projectStack: projectStack,
    projectBullets: projectBullets,
    skillsLanguages: matchedSkills.filter(s => ['Java', 'Python', 'C++', 'Javascript'].includes(s)).join(', '),
    skillsFrameworks: matchedSkills.filter(s => ['React', 'Node', 'Express', 'Spring boot'].includes(s)).join(', '),
    skillsDatabases: matchedSkills.filter(s => ['MySQL', 'Postgresql', 'Mongodb', 'Redis', 'Firebase'].includes(s)).join(', '),
    languages: 'English',
    certificates: '',
    interests: '',
    courses: '',
    awards: '',
    organisations: '',
    publications: '',
    references: '',
    declaration: '',
    customTitle: '',
    customContent: ''
  };
}

const Note = require('../models/Note');
const AptitudeTopic = require('../models/AptitudeTopic');

// @desc    Global keyword search across Courses, Lessons, DSA problems, Aptitude topics, and Notes
// @route   GET /api/dashboard/search
router.get('/search', protect, async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const regex = new RegExp(query, 'i');
    const results = [];

    // 1. Search Notes
    const notes = await Note.find({
      $or: [{ title: regex }, { description: regex }]
    }).limit(5);
    notes.forEach(n => {
      results.push({
        id: n._id,
        title: n.title,
        type: 'Note',
        desc: n.description,
        subject: n.subject,
        targetUrl: `/notes?openNoteId=${n._id}`
      });
    });

    // 2. Search Lessons
    const lessons = await Lesson.find({
      $or: [{ title: regex }, { content: regex }]
    }).limit(5);
    for (let l of lessons) {
      const course = await Course.findById(l.courseId);
      results.push({
        id: l._id,
        title: l.title,
        type: 'Lesson',
        desc: `Lesson in Course: ${course ? course.title : 'Theory'}`,
        targetUrl: `/courses?select=${course ? course.slug : ''}`
      });
    }

    // 3. Search DSA Problems
    const dsa = await DSAProblem.find({
      $or: [{ title: regex }, { topic: regex }]
    }).limit(5);
    dsa.forEach(d => {
      results.push({
        id: d._id,
        title: d.title,
        type: 'DSA Problem',
        desc: `Topic: ${d.topic} (${d.difficulty})`,
        targetUrl: `/dsa`
      });
    });

    // 4. Search Aptitude Topics
    const aptitude = await AptitudeTopic.find({
      $or: [{ title: regex }, { desc: regex }]
    }).limit(5);
    aptitude.forEach(a => {
      results.push({
        id: a._id,
        title: a.title,
        type: 'Aptitude Topic',
        desc: `Category: ${a.category}`,
        targetUrl: `/aptitude`
      });
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user profile details
// @route   PUT /api/dashboard/profile/update
router.put('/profile/update', protect, async (req, res) => {
  try {
    const { username, email, password, phoneNumber, selectedCourse, yearOfStudy, branch, profilePic } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Validate unique username/email
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) return res.status(400).json({ message: 'Username is already taken.' });
      user.username = username;
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ message: 'Email is already in use.' });
      user.email = email;
    }

    if (password) {
      const bcrypt = require('bcryptjs');
      user.password = await bcrypt.hash(password, 10);
    }

    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (selectedCourse !== undefined) user.selectedCourse = selectedCourse;
    if (yearOfStudy !== undefined) user.yearOfStudy = yearOfStudy;
    if (branch !== undefined) user.branch = branch;
    if (profilePic !== undefined) user.profilePic = profilePic;

    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user's subscription plan
// @route   PUT /api/dashboard/plan/update
router.put('/plan/update', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['Free', 'Pro', 'Lifetime'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.plan = plan;
    await user.save();

    // Log activity
    const Activity = require('../models/Activity');
    await Activity.create({
      userId: user._id,
      username: user.username,
      action: 'Upgraded Membership',
      details: `Upgraded account to "${plan}" membership plan.`
    });

    res.json({ success: true, plan: user.plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

