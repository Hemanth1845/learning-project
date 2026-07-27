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

    res.json({
      ...topic.toObject(),
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

module.exports = router;
