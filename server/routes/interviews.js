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

    let firstQuestion = '';

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a technical interviewer at ${companyName} conducting a ${difficulty} interview.
Candidate's Resume Text: "${resumeText.substring(0, 3000)}"

This is the start of the interview. Please welcome the candidate and ask the first question. 
Keep the response professional, crisp, and direct. Ask only ONE technical question to start.`;

        firstQuestion = await callGemini(prompt);
      } catch (err) {
        console.warn('Gemini start error, falling back to local question engine:', err);
        firstQuestion = getFallbackQuestion(companyName, difficulty, [], resumeText);
      }
    } else {
      firstQuestion = getFallbackQuestion(companyName, difficulty, [], resumeText);
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

Provide a detailed evaluation scorecard. Return ONLY a JSON object. Do not wrap in markdown tags or backticks. Format must match:
{
  "overallScore": 85,
  "summary": "Detailed paragraph evaluating their performance and communication skill.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
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

module.exports = router;
