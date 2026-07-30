const express = require('express');
const router = express.Router();
const AptitudeTopic = require('../models/AptitudeTopic');
const Submission = require('../models/Submission');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all aptitude topics with user progress grouped by category
// @route   GET /api/aptitude
router.get('/', protect, async (req, res) => {
  try {
    const topics = await AptitudeTopic.find().sort({ order: 1 });
    
    // User progress
    const userSubmissions = await Submission.find({
      userId: req.user._id,
      itemType: 'aptitude'
    });
    
    const solvedIds = userSubmissions.map(s => s.itemId.toString());
    
    const userBookmarks = await Bookmark.find({
      userId: req.user._id,
      itemType: 'aptitude'
    });
    const bookmarkedIds = userBookmarks.map(b => b.itemId.toString());

    // Format topics with status
    const formattedTopics = topics.map(t => {
      const isCompleted = solvedIds.includes(t._id.toString());
      const isBookmarked = bookmarkedIds.includes(t._id.toString());
      return {
        ...t.toObject(),
        completed: isCompleted,
        bookmarked: isBookmarked
      };
    });

    // Group by category
    const categories = {
      quant: {
        title: 'Quantitative Aptitude',
        desc: 'Master numbers with shortcuts that save 30+ seconds per question',
        icon: '🔢',
        topics: formattedTopics.filter(t => t.category === 'quant')
      },
      logical: {
        title: 'Logical Reasoning',
        desc: 'Think like a detective - patterns, puzzles, and logical deductions',
        icon: '🧠',
        topics: formattedTopics.filter(t => t.category === 'logical')
      },
      verbal: {
        title: 'Verbal Ability',
        desc: 'Build strong vocabulary, decode reading comprehensions, and master grammar rules',
        icon: '🗣️',
        topics: formattedTopics.filter(t => t.category === 'verbal')
      }
    };

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get details of a single topic
// @route   GET /api/aptitude/topics/:id
router.get('/topics/:id', protect, async (req, res) => {
  try {
    const topic = await AptitudeTopic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const submission = await Submission.findOne({
      userId: req.user._id,
      itemType: 'aptitude',
      itemId: topic._id
    });

    const bookmarked = await Bookmark.findOne({
      userId: req.user._id,
      itemType: 'aptitude',
      itemId: topic._id
    });

    // Server-side randomization & shuffling
    let questions = topic.quizQuestions || [];
    if (questions.length > 0) {
      // Split into difficulty tiers
      const easyMedium = questions.filter(q => q.difficulty === 'Easy-Medium' || !q.difficulty);
      const hard = questions.filter(q => q.difficulty === 'Hard');

      // Helper to shuffle in place
      const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      };

      let shuffledEasy = shuffle(easyMedium);
      let shuffledHard = shuffle(hard);

      const bigPools = [
        'Number System', 'Percentage', 'Profit & Loss',
        'Missing Number', 'Series', 'Mirror Images',
        'Paper Folding', 'Cube Problems', 'Data Sufficiency'
      ];
      if (bigPools.includes(topic.title)) {
        shuffledEasy = shuffledEasy.slice(0, 25);
        shuffledHard = shuffledHard.slice(0, 25);
      }

      // Recombine with Easy-Medium first, then Hard
      const combined = [...shuffledEasy, ...shuffledHard];

      // Shuffle options and recalculate correctIdx
      questions = combined.map(q => {
        const optionsWithCorrect = q.options.map((opt, idx) => ({
          text: opt,
          isCorrect: idx === q.correctIdx
        }));
        
        const shuffledOpts = shuffle(optionsWithCorrect);
        
        return {
          ...q.toObject(),
          options: shuffledOpts.map(o => o.text),
          correctIdx: shuffledOpts.findIndex(o => o.isCorrect)
        };
      });
    }

    const topicObj = topic.toObject();
    topicObj.quizQuestions = questions;

    res.json({
      ...topicObj,
      completed: !!submission,
      score: submission ? submission.score : 0,
      bookmarked: !!bookmarked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit quiz result for an aptitude topic and reward XP
// @route   POST /api/aptitude/topics/:id/submit-quiz
router.post('/topics/:id/submit-quiz', protect, async (req, res) => {
  try {
    const { score } = req.body; // percentage or score e.g. 80
    const topicId = req.params.id;
    const topic = await AptitudeTopic.findById(topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    // Check if there's an existing submission
    const existing = await Submission.findOne({
      userId: req.user._id,
      itemType: 'aptitude',
      itemId: topicId
    });

    const xpToEarn = Math.round(topic.xpReward * (score / 100));

    if (existing) {
      // Update submission details
      existing.score = score;
      existing.xpEarned = xpToEarn;
      await existing.save();
    } else {
      // Create new submission
      await Submission.create({
        userId: req.user._id,
        itemType: 'aptitude',
        itemId: topicId,
        status: 'completed',
        score,
        xpEarned: xpToEarn
      });

      // Add XP to user
      const user = await User.findById(req.user._id);
      if (user) {
        user.xp += xpToEarn;
        await user.save();
      }
    }

    res.json({ success: true, xpEarned: xpToEarn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle manual complete status for an aptitude topic theory
// @route   POST /api/aptitude/topics/:id/toggle-complete
router.post('/topics/:id/toggle-complete', protect, async (req, res) => {
  try {
    const topicId = req.params.id;
    const topic = await AptitudeTopic.findById(topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const existing = await Submission.findOne({
      userId: req.user._id,
      itemType: 'aptitude',
      itemId: topicId
    });

    let completed = false;
    let xpAwarded = 0;

    if (existing) {
      await Submission.findByIdAndDelete(existing._id);
      
      const user = await User.findById(req.user._id);
      if (user) {
        user.xp = Math.max(0, user.xp - existing.xpEarned);
        await user.save();
      }
      completed = false;
    } else {
      // Standard XP reward for complete (half of quiz reward for simple complete)
      const baseReward = Math.round(topic.xpReward * 0.5);
      await Submission.create({
        userId: req.user._id,
        itemType: 'aptitude',
        itemId: topicId,
        status: 'completed',
        score: 100,
        xpEarned: baseReward
      });

      const user = await User.findById(req.user._id);
      if (user) {
        user.xp += baseReward;
        await user.save();
      }
      completed = true;
      xpAwarded = baseReward;
    }

    res.json({ success: true, completed, xpAwarded });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle bookmark status of an aptitude topic
// @route   POST /api/aptitude/topics/:id/bookmark
router.post('/topics/:id/bookmark', protect, async (req, res) => {
  try {
    const topicId = req.params.id;
    const existing = await Bookmark.findOne({
      userId: req.user._id,
      itemType: 'aptitude',
      itemId: topicId
    });

    let bookmarked = false;
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      bookmarked = false;
    } else {
      await Bookmark.create({
        userId: req.user._id,
        itemType: 'aptitude',
        itemId: topicId
      });
      bookmarked = true;
    }

    res.json({ success: true, bookmarked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Operations

// @desc    Create aptitude topic
// @route   POST /api/aptitude/topics
router.post('/topics', protect, adminOnly, async (req, res) => {
  try {
    const newTopic = await AptitudeTopic.create(req.body);
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update aptitude topic
// @route   PUT /api/aptitude/topics/:id
router.put('/topics/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await AptitudeTopic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Topic not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete aptitude topic
// @route   DELETE /api/aptitude/topics/:id
router.delete('/topics/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await AptitudeTopic.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Topic not found' });

    // Clean submissions and bookmarks
    await Submission.deleteMany({ itemType: 'aptitude', itemId: req.params.id });
    await Bookmark.deleteMany({ itemType: 'aptitude', itemId: req.params.id });

    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const QuizHistory = require('../models/QuizHistory');

// @desc    Submit detailed quiz history and calculate analytics
// @route   POST /api/aptitude/topics/:id/history
router.post('/topics/:id/history', protect, async (req, res) => {
  try {
    const { score, totalQuestions, correctAnswers, timeTaken, answers } = req.body;
    const topicId = req.params.id;
    const topic = await AptitudeTopic.findById(topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Evaluate strong and weak subtopics
    const subtopicPerformance = {};
    if (answers && Array.isArray(answers)) {
      answers.forEach(ans => {
        const sub = ans.subtopic || 'General Concepts';
        if (!subtopicPerformance[sub]) {
          subtopicPerformance[sub] = { total: 0, correct: 0 };
        }
        subtopicPerformance[sub].total++;
        if (ans.correct) {
          subtopicPerformance[sub].correct++;
        }
      });
    }

    const strongTopics = [];
    const weakTopics = [];

    Object.keys(subtopicPerformance).forEach(sub => {
      const perf = subtopicPerformance[sub];
      const pct = (perf.correct / perf.total) * 100;
      if (pct >= 80) {
        strongTopics.push(sub);
      } else if (pct < 50) {
        weakTopics.push(sub);
      }
    });

    const quizHistory = await QuizHistory.create({
      userId: req.user._id,
      topicId,
      score,
      totalQuestions,
      correctAnswers,
      accuracy,
      timeTaken,
      strongTopics,
      weakTopics
    });

    // Also update overall topic completion / submission standard record
    const existing = await Submission.findOne({
      userId: req.user._id,
      itemType: 'aptitude',
      itemId: topicId
    });

    const xpToEarn = Math.round(topic.xpReward * (score / 100));

    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        existing.xpEarned = xpToEarn;
        await existing.save();
      }
    } else {
      await Submission.create({
        userId: req.user._id,
        itemType: 'aptitude',
        itemId: topicId,
        status: 'completed',
        score,
        xpEarned: xpToEarn
      });

      // Add XP to user
      const user = await User.findById(req.user._id);
      if (user) {
        user.xp += xpToEarn;
        await user.save();
      }
    }

    res.status(201).json({
      success: true,
      history: quizHistory,
      xpEarned: xpToEarn
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get quiz history for a specific topic
// @route   GET /api/aptitude/topics/:id/history
router.get('/topics/:id/history', protect, async (req, res) => {
  try {
    const history = await QuizHistory.find({
      userId: req.user._id,
      topicId: req.params.id
    }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
