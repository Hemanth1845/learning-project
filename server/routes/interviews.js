const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const {
  callGemini,
  getFallbackQuestion,
  getFallbackFeedback
} = require('../utils/gemini');

// @desc    Get all interviews for the current user
// @route   GET /api/interviews
router.get('/', protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single interview by ID
// @route   GET /api/interviews/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Start a new mock interview
// @route   POST /api/interviews/start
router.post('/start', protect, async (req, res) => {
  try {
    const { companyName, difficulty, resumeText } = req.body;

    if (!companyName || !resumeText) {
      return res.status(400).json({ message: 'Company name and resume text are required.' });
    }

    const nameRegexMatch = resumeText.match(/(?:Name|Full Name):\s*([^\n\r]+)/i);
    const candidateName = nameRegexMatch ? nameRegexMatch[1].trim() : (req.user.username.charAt(0).toUpperCase() + req.user.username.slice(1));

    let firstQuestion = '';

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a technical interviewer at ${companyName} conducting a ${difficulty} interview.
Candidate's Name: ${candidateName}
Candidate's Resume Text: "${resumeText.substring(0, 3000)}"

This is the start of the interview. Please welcome the candidate by their name (e.g. "Hi ${candidateName}, welcome...") and ask them to start with their self-introduction and briefly describe their background.
Keep the response professional, crisp, and direct. Ask only ONE question to start.`;

        firstQuestion = await callGemini(prompt);
      } catch (err) {
        console.warn('Gemini start error, falling back to local question engine:', err);
        firstQuestion = `Hi ${candidateName}, welcome to your technical interview for ${companyName}. Start with your self-introduction and explain your experience with the technology stack on your resume.`;
      }
    } else {
      firstQuestion = `Hi ${candidateName}, welcome to your technical interview for ${companyName}. Start with your self-introduction and explain your experience with the technology stack on your resume.`;
    }

    const interview = await Interview.create({
      userId: req.user._id,
      companyName,
      difficulty: difficulty || 'Medium',
      resumeText,
      chatHistory: [
        { sender: 'ai', message: firstQuestion }
      ],
      status: 'active'
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Respond to an active mock interview
// @route   POST /api/interviews/:id/respond
router.post('/:id/respond', protect, async (req, res) => {
  try {
    const { message } = req.body;
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'This interview has already completed.' });
    }

    // Append user response
    interview.chatHistory.push({ sender: 'user', message });
    await interview.save();

    // Determine current round
    // We aim for 4 questions total (AI -> User -> AI -> User -> AI -> User -> AI -> User -> AI (Feedback))
    // chatHistory list length:
    // Q1 (1), A1 (2), Q2 (3), A2 (4), Q3 (5), A3 (6), Q4 (7), A4 (8)
    const totalMessages = interview.chatHistory.length;

    if (totalMessages >= 8) {
      // End interview and generate scorecard
      interview.status = 'completed';

      let feedbackObj = null;

      if (process.env.GEMINI_API_KEY) {
        try {
          const chatHistoryFormatted = interview.chatHistory
            .map(m => `${m.sender.toUpperCase()}: ${m.message}`)
            .join('\n');

          const prompt = `You are a technical interviewer at ${interview.companyName} who has finished a ${interview.difficulty} interview with a candidate.
Evaluate the candidate's responses based on their resume and the chat history.

Candidate Resume Text: "${interview.resumeText.substring(0, 2000)}"
Chat History:
${chatHistoryFormatted}

CRITICAL SCORING CONSTRAINTS:
1. Every answer must be evaluated through the following pipeline:
   - Question Intent Detection: What is the question asking?
   - Expected Answer Generation: What is the ideal correct answer?
   - Answer Relevance Check: Did the candidate actually answer the question? Check for songs, movie dialogues, random talking, off-topic discussion, repeated words, silence, or nonsense.
   - Semantic Similarity & Topic Relevance: Compare user response against expected answer.
   - Technical Accuracy: If user says something incorrect (e.g., "JWT is a database"), the technical score must be very low. Good grammar cannot compensate.
   - Resume Validation: Verify if the candidate correctly references tech stacks or details from their resume where applicable.
   - Completeness & Communication (Grammar, Vocabulary, Tone).
2. Overall Score weighting MUST strictly be:
   - Relevance: 40%
   - Technical Accuracy: 25%
   - Completeness: 15%
   - Communication: 10%
   - Grammar: 5%
   - Confidence: 5%
3. If ANY answer is detected as off-topic, a song, movie dialogue, nonsense, or random talking, set Relevance = 0%, Technical = 0%, Communication = 15%, Overall Score = 5% for that question, and overallScore for the entire interview must be set between 0 and 9. Include this feedback: "Your response did not answer the interview question. Please explain Project, Technology, Challenges, and Outcome."
4. Generate a detailed question-wise report.

Provide a detailed evaluation scorecard. Return ONLY a JSON object. Do not wrap in markdown tags or backticks. Format must match:
{
  "overallScore": 85,
  "summary": "Detailed paragraph evaluating their performance and communication skill.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "questionsReport": [
    {
      "question": "Question text asked by AI",
      "userAnswer": "User's verbal or typed response",
      "expectedAnswer": "Brief summary of the correct expected answer",
      "relevance": 95,
      "technical": 90,
      "grammar": 90,
      "confidence": 85,
      "suggestions": "Suggestions for improvement",
      "improvedAnswer": "An improved model answer the candidate should have given",
      "resources": "Recommended references, books or links"
    }
  ]
}`;

          const evaluation = await callGemini(prompt);
          // Strip backticks or markdown JSON wrapper if present
          let cleanJson = evaluation.trim();
          if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```(json)?/, '').replace(/```$/, '').trim();
          }

          feedbackObj = JSON.parse(cleanJson);
        } catch (err) {
          console.warn('Gemini feedback error, falling back to local evaluator:', err);
          feedbackObj = getFallbackFeedback(interview.companyName, interview.difficulty, interview.chatHistory, interview.resumeText);
        }
      } else {
        feedbackObj = getFallbackFeedback(interview.companyName, interview.difficulty, interview.chatHistory, interview.resumeText);
      }

      interview.feedback = feedbackObj;
      await interview.save();

      // Add 100 XP to User for interview completion
      const user = await User.findById(req.user._id);
      user.xp += 100;
      await user.save();

      // Create Notification
      await Notification.create({
        userId: req.user._id,
        title: 'Mock Interview Complete!',
        message: `You completed a mock interview for ${interview.companyName} and earned +100 XP! Score: ${feedbackObj.overallScore}/100`
      });

      return res.json(interview);
    } else {
      // Generate next question
      let nextQuestion = '';

      if (process.env.GEMINI_API_KEY) {
        try {
          const chatHistoryFormatted = interview.chatHistory
            .map(m => `${m.sender.toUpperCase()}: ${m.message}`)
            .join('\n');

          const prompt = `You are a technical interviewer at ${interview.companyName} conducting a ${interview.difficulty} interview.
Candidate's Resume Text: "${interview.resumeText.substring(0, 2000)}"

Chat History so far:
${chatHistoryFormatted}

Generate the NEXT single technical question based on their last answer, the company standard, and their resume.
Do not add any introductory text. Ask only ONE question directly.`;

          nextQuestion = await callGemini(prompt);
        } catch (err) {
          console.warn('Gemini next question error, falling back to local question engine:', err);
          nextQuestion = getFallbackQuestion(interview.companyName, interview.difficulty, interview.chatHistory, interview.resumeText);
        }
      } else {
        nextQuestion = getFallbackQuestion(interview.companyName, interview.difficulty, interview.chatHistory, interview.resumeText);
      }

      interview.chatHistory.push({ sender: 'ai', message: nextQuestion });
      await interview.save();

      res.json(interview);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Parse resume file to extract profile data
// @route   POST /api/interviews/parse-resume
router.post('/parse-resume', protect, async (req, res) => {
  try {
    const { fileContent, fileName } = req.body;
    if (!fileContent) {
      return res.status(400).json({ message: 'File content is required.' });
    }

    let fileBase64 = fileContent;
    let mimeType = 'text/plain';
    let rawText = '';

    if (fileContent.startsWith('data:')) {
      const match = fileContent.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        fileBase64 = match[2];
      }
    }

    if (mimeType.includes('pdf') || (fileName && fileName.toLowerCase().endsWith('.pdf'))) {
      try {
        const pdf = require('pdf-parse');
        const buffer = Buffer.from(fileBase64, 'base64');
        const uint8Array = new Uint8Array(buffer);
        if (typeof pdf === 'function') {
          const pdfData = await pdf(buffer);
          rawText = pdfData.text || '';
        } else if (pdf && pdf.PDFParse) {
          const parser = new pdf.PDFParse(uint8Array);
          const result = await parser.getText();
          rawText = result.text || '';
        }
      } catch (err) {
        console.error('PDF parsing in interviews failed:', err);
      }
    }

    if (!rawText && !(fileName && fileName.toLowerCase().endsWith('.pdf')) && !mimeType.includes('pdf')) {
      try {
        rawText = Buffer.from(fileBase64, 'base64').toString('utf-8');
      } catch (e) {
        rawText = '';
      }
    }

    // Try to extract name from decoded text or filename or user model fallback
    let candidateName = '';
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
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
      candidateName = req.user.username.charAt(0).toUpperCase() + req.user.username.slice(1);
    }

    const emailMatch = rawText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = rawText.match(/((?:\+?\d{1,3}[\s-])?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}|\+?\d{10,12})/);
    const githubMatch = rawText.match(/(github\.com\/[a-zA-Z0-9-_/]+)/i);
    const linkedinMatch = rawText.match(/(linkedin\.com\/in\/[a-zA-Z0-9-_/]+)/i);

    // Extract skills dynamically
    const skillsList = ['javascript', 'react', 'node', 'python', 'java', 'c++', 'sql', 'mongodb', 'express', 'html', 'css', 'docker', 'aws', 'spring boot', 'mysql', 'postgresql', 'redis', 'firebase', 'git', 'github'];
    const matchedSkills = [];
    skillsList.forEach(s => {
      const reg = new RegExp('\\b' + s.replace('.', '\\.').replace('+', '\\+') + '\\b', 'i');
      if (reg.test(rawText)) {
        matchedSkills.push(s.charAt(0).toUpperCase() + s.slice(1));
      }
    });

    const collegeMatch = rawText.match(/([A-Za-z0-9.\s,]+(?:University|Institute|College|Foundation|Academy|School|K\.L\.\s*University))/i);
    const degreeMatch = rawText.match(/(B\.Tech|M\.Tech|B\.E|B\.Sc|M\.Sc|MCA|BCA|MBA|Bachelor|Master)\s*(?:in|of)?\s*([A-Za-z\s&]+)/i);
    const cgpaMatch = rawText.match(/(?:CGPA|GPA|Grade|Pointer):\s*([0-9./]+)/i) || rawText.match(/\b([0-9]\.[0-9]{1,2})\b/);

    let educationStr = '';
    if (collegeMatch) {
      educationStr = `${degreeMatch ? degreeMatch[0].trim() : 'B.Tech'} at ${collegeMatch[0].trim()} ${cgpaMatch ? `(CGPA: ${cgpaMatch[1]})` : ''}`;
    }

    let projectTitle = '';
    let projectIdx = rawText.toLowerCase().indexOf('projects');
    if (projectIdx !== -1) {
      const projectSectionText = rawText.substring(projectIdx + 8, projectIdx + 800);
      const pLines = projectSectionText.split('\n').map(l => l.trim()).filter(Boolean);
      if (pLines.length > 0) {
        projectTitle = pLines[0].replace(/[^a-zA-Z0-9\s-]/g, '').trim();
      }
    }

    let parsedInfo = {
      fullName: candidateName || '',
      collegeName: collegeMatch ? collegeMatch[0].trim() : '',
      degree: degreeMatch ? degreeMatch[0].trim() : '',
      cgpa: cgpaMatch ? cgpaMatch[1].trim() : '',
      skills: matchedSkills.join(', ') || '',
      internship: '',
      projects: projectTitle || '',
      careerGoal: 'Software Engineer'
    };

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Analyze this resume and extract the candidate's details. Only extract information that is explicitly present in the provided resume. If a detail (like collegeName, degree, cgpa, skills, internship, or projects) is NOT present in the resume, return an empty string "" for that field. Do not invent, guess, or default any values.
        
        Return ONLY valid JSON matching this schema:
        {
          "fullName": "Candidate Name",
          "collegeName": "College / University Name",
          "degree": "Degree / Stream",
          "cgpa": "CGPA or Grades",
          "skills": "Key Technical Skills (comma separated)",
          "internship": "Internship Experience",
          "projects": "Academic Projects / Side Projects",
          "careerGoal": "Career Goal / Role"
        }
        Do not add markdown formatting or explanation outside the JSON.`;

        let response = '';
        if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('officedocument')) {
          const { callGeminiWithMedia } = require('../utils/gemini');
          response = await callGeminiWithMedia(fileBase64, mimeType, prompt);
        } else {
          response = await callGemini(`Resume Content:\n"${rawText.substring(0, 8000)}"\n\n${prompt}`);
        }

        let cleanJson = response.trim();
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        const parsed = JSON.parse(cleanJson);
        if (parsed.fullName) parsedInfo.fullName = parsed.fullName;
        if (parsed.collegeName) parsedInfo.collegeName = parsed.collegeName;
        if (parsed.degree) parsedInfo.degree = parsed.degree;
        if (parsed.cgpa) parsedInfo.cgpa = parsed.cgpa;
        if (parsed.skills) parsedInfo.skills = parsed.skills;
        if (parsed.internship) parsedInfo.internship = parsed.internship;
        if (parsed.projects) parsedInfo.projects = parsed.projects;
        if (parsed.careerGoal) parsedInfo.careerGoal = parsed.careerGoal;
      } catch (err) {
        console.warn('Gemini resume parsing error, using default extraction:', err);
      }
    }

    res.json({ success: true, parsedInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
