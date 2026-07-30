const express = require('express');
const router = express.Router();
const TheorySubject = require('../models/TheorySubject');
const TheoryChapter = require('../models/TheoryChapter');
const Submission = require('../models/Submission');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all subjects and chapters with user progress and bookmarked status
// @route   GET /api/theory
router.get('/', protect, async (req, res) => {
  try {
    const subjects = await TheorySubject.find().sort({ order: 1 });
    const userSubmissions = await Submission.find({
      userId: req.user._id,
      itemType: 'theory',
      status: 'completed'
    });
    const completedIds = userSubmissions.map(s => s.itemId.toString());

    const userBookmarks = await Bookmark.find({
      userId: req.user._id,
      itemType: 'theory'
    });
    const bookmarkedIds = userBookmarks.map(b => b.itemId.toString());

    const result = [];
    for (let subj of subjects) {
      const chapters = await TheoryChapter.find({ subjectId: subj.id }).sort({ order: 1 });
      const chaptersWithStatus = chapters.map(ch => ({
        ...ch.toObject(),
        completed: completedIds.includes(ch._id.toString()),
        bookmarked: bookmarkedIds.includes(ch._id.toString())
      }));

      const totalChapters = chapters.length;
      const completedCount = chaptersWithStatus.filter(c => c.completed).length;
      const progressPercent = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

      result.push({
        ...subj.toObject(),
        chapters: chaptersWithStatus,
        totalChapters,
        completedChapters: completedCount,
        progress: progressPercent
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get details of a single chapter
// @route   GET /api/theory/chapters/:id
router.get('/chapters/:id', protect, async (req, res) => {
  try {
    const chapter = await TheoryChapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    
    // Check if user completed or bookmarked it
    const completed = await Submission.findOne({
      userId: req.user._id,
      itemType: 'theory',
      itemId: chapter._id,
      status: 'completed'
    });

    const bookmarked = await Bookmark.findOne({
      userId: req.user._id,
      itemType: 'theory',
      itemId: chapter._id
    });

    res.json({
      ...chapter.toObject(),
      completed: !!completed,
      bookmarked: !!bookmarked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle completion of a theory chapter and reward XP
// @route   POST /api/theory/chapters/:id/toggle
router.post('/chapters/:id/toggle', protect, async (req, res) => {
  try {
    const chapterId = req.params.id;
    const chapter = await TheoryChapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

    const existing = await Submission.findOne({
      userId: req.user._id,
      itemType: 'theory',
      itemId: chapterId
    });

    let completed = false;
    let xpAwarded = 0;

    if (existing) {
      // Toggle off - delete submission
      await Submission.findByIdAndDelete(existing._id);
      
      // Deduct XP
      const user = await User.findById(req.user._id);
      if (user) {
        user.xp = Math.max(0, user.xp - chapter.xpReward);
        await user.save();
      }
      completed = false;
    } else {
      // Create completed submission
      await Submission.create({
        userId: req.user._id,
        itemType: 'theory',
        itemId: chapterId,
        status: 'completed',
        xpEarned: chapter.xpReward
      });

      // Add XP
      const user = await User.findById(req.user._id);
      if (user) {
        user.xp += chapter.xpReward;
        await user.save();
      }
      completed = true;
      xpAwarded = chapter.xpReward;
    }

    res.json({ success: true, completed, xpAwarded });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle bookmark status of a theory chapter
// @route   POST /api/theory/chapters/:id/bookmark
router.post('/chapters/:id/bookmark', protect, async (req, res) => {
  try {
    const chapterId = req.params.id;
    const existing = await Bookmark.findOne({
      userId: req.user._id,
      itemType: 'theory',
      itemId: chapterId
    });

    let bookmarked = false;
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      bookmarked = false;
    } else {
      await Bookmark.create({
        userId: req.user._id,
        itemType: 'theory',
        itemId: chapterId
      });
      bookmarked = true;
    }

    res.json({ success: true, bookmarked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Operations

// @desc    Create subject
// @route   POST /api/theory/subjects
router.post('/subjects', protect, adminOnly, async (req, res) => {
  try {
    const { id, title, icon, order, description } = req.body;
    const newSubj = await TheorySubject.create({ id, title, icon, order, description });
    res.status(201).json(newSubj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create chapter
// @route   POST /api/theory/chapters
router.post('/chapters', protect, adminOnly, async (req, res) => {
  try {
    const newChapter = await TheoryChapter.create(req.body);
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update chapter
// @route   PUT /api/theory/chapters/:id
router.put('/chapters/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await TheoryChapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Chapter not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete chapter
// @route   DELETE /api/theory/chapters/:id
router.delete('/chapters/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await TheoryChapter.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Chapter not found' });
    
    // Clean up submissions and bookmarks
    await Submission.deleteMany({ itemType: 'theory', itemId: req.params.id });
    await Bookmark.deleteMany({ itemType: 'theory', itemId: req.params.id });

    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete theory subject
// @route   DELETE /api/theory/subjects/:id
router.delete('/subjects/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await TheorySubject.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Subject not found' });
    const TheoryChapter = require('../models/TheoryChapter');
    await TheoryChapter.deleteMany({ subjectId: req.params.id });
    res.json({ message: 'Subject and its chapters deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update theory subject
// @route   PUT /api/theory/subjects/:id
router.put('/subjects/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, icon, order, description } = req.body;
    const updated = await TheorySubject.findOneAndUpdate(
      { id: req.params.id },
      { title, icon, order, description },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Subject not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
