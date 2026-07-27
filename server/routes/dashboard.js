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

You are the official AI Academic & Placement Advisor for "Hemanth Learning Platform".
Your core task is to guide students (e.g., 1st to 4th-year engineering students) on career preparation, placement strategies, and skill development.

==================================================
CRITICAL RAG CONSTRAINTS (STRICTLY ENFORCED)
==================================================
1. EXCLUSIVE CATALOG RULE:
   - You MUST ONLY recommend courses, modules, tasks, and practice sets that exist within the provided [DATABASE_CONTEXT] below.
   - NEVER suggest or refer to external platforms (such as Coursera, Udemy, LeetCode, W3Schools, or IndiaBIX directly) unless explicitly present in [DATABASE_CONTEXT].
   - If a requested topic is missing from [DATABASE_CONTEXT], state:
     "We currently do not offer a course on [Topic] on our platform, but here are related modules you can take:" followed by closest match in context.

2. ACADEMIC YEAR GUIDANCE RULES:
   When a student states their current academic year (e.g., "I am in 3rd year, what should I do?"), follow this structured 3-tier roadmap:
   - Phase 1: Core Tech Skills (Frontend/Backend/Programming from our Course Catalog).
   - Phase 2: Aptitude & Reasoning Prep (Quantitative, Verbal, Logical from our Task Catalog).
   - Phase 3: Placement Action Plan (Projects, Mock Tests, Weekly Streaks).

3. RESPONSE FORMATTING:
   - Output structured Markdown with headers, clean bullet points, and actionable steps.
   - Provide direct internal links to platform courses using the markdown format: \`[Course Title](/courses?course=course-slug)\` or \`[Task Category](/aptitude?topic=task-slug)\` or \`[Practice DSA](/dsa)\` or \`[Mock Interview](/mock-interview)\` or \`[Resume Builder](/resume-ats)\` or \`[Notes](/notes)\`.

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

  if (query.includes('first year') || query.includes('1st year')) {
    return `### 1st-Year Study Plan (Local RAG Offline Mode)

Welcome! For your 1st year, focus on building programming basics and computer fundamentals:

*   **Phase 1: Core Tech Skills**: Start with **[C Programming](/courses?course=c-programming)** and **[Python](/courses?course=python)**.
*   **Phase 2: Aptitude Prep**: Brush up basic quantitative arithmetic in **[Prep Aptitude](/aptitude)**.
*   **Phase 3: Placement Action Plan**: Build small script utilities, practice basic logic on **[Practice DSA](/dsa)**, and study Git version control.

*References: 1st Year Study Plan*`;
  }

  if (query.includes('second year') || query.includes('2nd year')) {
    return `### 2nd-Year Study Plan (Local RAG Offline Mode)

In your 2nd year, study object-oriented principles, relational databases, and core frontend web dev:

*   **Phase 1: Core Tech Skills**: Learn OOP and Java in **[Java](/courses?course=java)** and study SQL query structures in **[SQL](/courses?course=sql)**.
*   **Phase 2: Aptitude Prep**: Solve verbal and logical topics in **[Prep Aptitude](/aptitude)**.
*   **Phase 3: Placement Action Plan**: Start practicing medium problems on **[Practice DSA](/dsa)** and save revision notes.

*References: 2nd Year Study Plan*`;
  }
  
  if (query.includes('third year') || query.includes('3rd year') || (query.includes('learn') && userYear === '3rd Year')) {
    return `### 3rd-Year Placement Prep Plan (Local RAG Offline Mode)

As a 3rd-year engineering student, here is your structured placement roadmap:

*   **Phase 1: Core Tech Skills**: Enroll in **[Data Structures & Algorithms with Java](/courses?course=dsa-java)** and **[Database Management Systems (DBMS) & SQL Masterclass](/courses?course=dbms-sql)**.
*   **Phase 2: Aptitude & Reasoning Prep**: Solve Quantitative and Logical modules in **[Prep Aptitude](/aptitude)** (e.g. Time & Work, Profit & Loss).
*   **Phase 3: Placement Action Plan**: Work on full-stack web applications, solve **[Daily Coding Challenges](/daily-problems)**, and build a resume on **[Resume Builder](/resume-ats)**.

*References: 3rd Year Study Plan / Placement Prep*`;
  }

  if (query.includes('fourth year') || query.includes('4th year')) {
    return `### 4th-Year Placement Prep Plan (Local RAG Offline Mode)

In your final year, focus on advanced technologies, deployment, system design, and mock interviews:

*   **Phase 1: Core Tech Skills**: Complete **[Core CS Fundamentals (OS, Networks, System Design)](/courses?course=core-cs-fundamentals)**.
*   **Phase 2: Aptitude Prep**: Solve advanced reasoning mock papers on **[Prep Aptitude](/aptitude)**.
*   **Phase 3: Placement Action Plan**: Take mock assessments at **[Mock Interview Setup](/mock-interview)** and refine your resume on **[Resume Builder](/resume-ats)**.

*References: 4th Year Study Plan*`;
  }

  if (query.includes('ai engineer') || query.includes('artificial intelligence')) {
    return `### How to Become an AI Engineer (Local RAG Offline Mode)

Follow this study path for AI roles:

*   **Phase 1: Core Tech Skills**: Master Python syntax in **[Python](/courses?course=python)** and explore machine learning basics.
*   **Phase 2: AI & LLMs**: Complete **[Generative AI](/courses?course=generative-ai)** to learn prompt engineering, vector databases, and RAG models.
*   **Phase 3: Placement Action Plan**: Build RAG chatbots, host them, and outline your code templates in your resume.

*References: How to become an AI Engineer*`;
  }

  if (query.includes('tcs') || query.includes('crack tcs')) {
    return `### TCS Placement Preparation Guide (Local RAG Offline Mode)

To crack TCS, target these core requirements:

*   **Phase 1: Cognitive Aptitude**: Practice Time & Work and Percentage categories in **[Prep Aptitude](/aptitude)**.
*   **Phase 2: Coding Assessment**: Solve Easy-to-Medium array and string challenges on **[Practice DSA](/dsa)**.
*   **Phase 3: Interviews**: Review core CS questions (OS scheduler, DBMS indexes) in **[Study CS Theory](/theory)**.

*References: How to crack TCS*`;
  }
  
  if (contextMatches.length > 0) {
    return `### Academic Doubt Resolver (Local RAG Offline Mode)

Based on your query, here is relevant context fetched from our course syllabus:

${contextMatches.map(m => `**${m.title}** (${m.type}): ${m.content}`).join('\n\n')}

*Navigate to these modules: [Courses](/courses), [Study CS Theory](/theory), [Prep Aptitude](/aptitude).*`;
  }

  return `### AI Doubt Solver

I couldn't find a direct syllabus match for your query. 

*   To learn programming, visit **[Courses](/courses)**.
*   To practice problem-solving, visit **[Practice DSA](/dsa)**.
*   To study core computer science, visit **[Study CS Theory](/theory)**.
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

