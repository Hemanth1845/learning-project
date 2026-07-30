const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all courses with progress for the current user
// @route   GET /api/courses
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find();
    const coursesWithProgress = [];

    for (let course of courses) {
      const lessons = await Lesson.find({ courseId: course._id });
      const totalLessons = lessons.length;

      if (totalLessons === 0) {
        coursesWithProgress.push({
          ...course.toObject(),
          progress: 0,
          completedLessonsCount: 0,
          totalLessonsCount: 0
        });
        continue;
      }

      const lessonIds = lessons.map(l => l._id);
      const completedCount = await Submission.find({
        userId: req.user._id,
        itemType: 'lesson',
        itemId: { $in: lessonIds }
      }).countDocuments();

      const progressPercent = Math.round((completedCount / totalLessons) * 100);

      coursesWithProgress.push({
        ...course.toObject(),
        progress: progressPercent,
        completedLessonsCount: completedCount,
        totalLessonsCount: totalLessons
      });
    }

    res.json(coursesWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all lessons for a course
// @route   GET /api/courses/:courseId/lessons
router.get('/:courseId/lessons', protect, async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId }).sort({ order: 1 });
    
    // Check completion status for each lesson
    const lessonIds = lessons.map(l => l._id);
    const completedSubmissions = await Submission.find({
      userId: req.user._id,
      itemType: 'lesson',
      itemId: { $in: lessonIds }
    });
    
    const completedLessonIds = completedSubmissions.map(s => s.itemId.toString());

    // Also check if they passed the quiz for each lesson
    const quizSubmissions = await Submission.find({
      userId: req.user._id,
      itemType: 'quiz',
      itemId: { $in: lessonIds }
    });
    const completedQuizIds = quizSubmissions.map(s => s.itemId.toString());

    const lessonsWithStatus = lessons.map(lesson => {
      return {
        ...lesson.toObject(),
        completed: completedLessonIds.includes(lesson._id.toString()),
        quizCompleted: completedQuizIds.includes(lesson._id.toString())
      };
    });

    res.json(lessonsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single lesson & mark as completed (viewed)
// @route   GET /api/courses/:courseId/lessons/:lessonId
router.get('/:courseId/lessons/:lessonId', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findOne({
      _id: req.params.lessonId,
      courseId: req.params.courseId
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Mark as completed/viewed if not already done
    const existingView = await Submission.findOne({
      userId: req.user._id,
      itemType: 'lesson',
      itemId: lesson._id
    });

    let firstTimeCompleted = false;
    if (!existingView) {
      await Submission.create({
        userId: req.user._id,
        itemType: 'lesson',
        itemId: lesson._id,
        status: 'completed',
        xpEarned: 10 // Earn 10 XP just for reading lessons!
      });
      
      const user = await User.findById(req.user._id);
      user.xp += 10;
      await user.save();
      firstTimeCompleted = true;
    }

    // Check if quiz has been solved
    const quizSub = await Submission.findOne({
      userId: req.user._id,
      itemType: 'quiz',
      itemId: lesson._id
    });

    res.json({
      lesson,
      viewed: true,
      firstTimeCompleted,
      quizCompleted: !!quizSub,
      quizScore: quizSub ? quizSub.score : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit Quiz answers
// @route   POST /api/courses/:courseId/lessons/:lessonId/quiz/submit
router.post('/:courseId/lessons/:lessonId/quiz/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected indexes: [0, 2]
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson || !lesson.quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const questions = lesson.quiz.questions;
    let correctCount = 0;

    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && answers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercent >= 70; // 70% to pass

    const existingQuizSub = await Submission.findOne({
      userId: req.user._id,
      itemType: 'quiz',
      itemId: lesson._id
    });

    let xpEarned = 0;
    if (passed && !existingQuizSub) {
      xpEarned = lesson.quiz.xpReward || 50;
      const user = await User.findById(req.user._id);
      user.xp += xpEarned;
      await user.save();

      await Submission.create({
        userId: req.user._id,
        itemType: 'quiz',
        itemId: lesson._id,
        status: 'completed',
        score: scorePercent,
        xpEarned
      });
    }

    res.json({
      passed,
      score: scorePercent,
      correctCount,
      totalQuestions: questions.length,
      xpEarned,
      alreadySolved: !!existingQuizSub
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark interview questions for a lesson as completed
// @route   POST /api/courses/:courseId/lessons/:lessonId/interview-prep/complete
router.post('/:courseId/lessons/:lessonId/interview-prep/complete', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const existing = await Submission.findOne({
      userId: req.user._id,
      itemType: 'quiz',
      itemId: lesson._id
    });

    if (existing) {
      return res.json({ success: true, xpEarned: 0, message: 'Already completed' });
    }

    await Submission.create({
      userId: req.user._id,
      itemType: 'quiz',
      itemId: lesson._id,
      status: 'completed',
      score: 100,
      xpEarned: 50
    });

    const user = await User.findById(req.user._id);
    user.xp += 50;
    await user.save();

    res.json({ success: true, xpEarned: 50 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= ADMIN ROUTES =================

// @desc    Create course
// @route   POST /api/courses
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, category, difficulty, thumbnail, pdfUrl, externalLink, practicePageUrl } = req.body;
    const newCourse = await Course.create({
      title,
      description,
      category,
      difficulty,
      thumbnail,
      pdfUrl: pdfUrl || '',
      externalLink: externalLink || '',
      practicePageUrl: practicePageUrl || ''
    });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update course
// @route   PUT /api/courses/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, category, difficulty, thumbnail, pdfUrl, externalLink, practicePageUrl } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.difficulty = difficulty || course.difficulty;
    course.thumbnail = thumbnail || course.thumbnail;
    course.pdfUrl = pdfUrl !== undefined ? pdfUrl : course.pdfUrl;
    course.externalLink = externalLink !== undefined ? externalLink : course.externalLink;
    course.practicePageUrl = practicePageUrl !== undefined ? practicePageUrl : course.practicePageUrl;

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    await course.deleteOne();
    // Delete all related lessons
    await Lesson.deleteMany({ courseId: req.params.id });

    res.json({ message: 'Course and associated lessons deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add lesson to course
// @route   POST /api/courses/:courseId/lessons
router.post('/:courseId/lessons', protect, adminOnly, async (req, res) => {
  try {
    const { title, content, videoUrl, order, quiz } = req.body;
    
    const newLesson = await Lesson.create({
      courseId: req.params.courseId,
      title,
      content,
      videoUrl,
      order,
      quiz: quiz || null
    });
    
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update lesson
// @route   PUT /api/courses/:courseId/lessons/:lessonId
router.put('/:courseId/lessons/:lessonId', protect, adminOnly, async (req, res) => {
  try {
    const { title, content, videoUrl, order, quiz } = req.body;
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;
    lesson.videoUrl = videoUrl || lesson.videoUrl;
    lesson.order = order !== undefined ? order : lesson.order;
    lesson.quiz = quiz !== undefined ? quiz : lesson.quiz;

    await lesson.save();
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete lesson
// @route   DELETE /api/courses/:courseId/lessons/:lessonId
router.delete('/:courseId/lessons/:lessonId', protect, adminOnly, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    await lesson.deleteOne();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all course requests
// @route   GET /api/courses/requests/all
router.get('/requests/all', protect, async (req, res) => {
  try {
    const CourseRequest = require('../models/CourseRequest');
    const requests = await CourseRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit a new course request
// @route   POST /api/courses/requests/submit
router.post('/requests/submit', protect, async (req, res) => {
  try {
    const { courseName, category, priority, reason, description, referenceLinks } = req.body;
    if (!courseName || !category) {
      return res.status(400).json({ message: 'Course name and category are required.' });
    }

    const CourseRequest = require('../models/CourseRequest');
    const request = await CourseRequest.create({
      userId: req.user._id,
      username: req.user.username,
      courseName,
      category,
      priority,
      reason: reason || '',
      description: description || '',
      referenceLinks: referenceLinks || '',
      votes: [req.user._id],
      status: 'Pending'
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Vote / Upvote for a course request
// @route   POST /api/courses/requests/:id/vote
router.post('/requests/:id/vote', protect, async (req, res) => {
  try {
    const CourseRequest = require('../models/CourseRequest');
    const request = await CourseRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Course request not found.' });
    }

    const voterId = req.user._id;
    const voteIndex = request.votes.indexOf(voterId);

    if (voteIndex > -1) {
      request.votes.splice(voteIndex, 1);
    } else {
      request.votes.push(voterId);
    }

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update course request status (Admin only)
// @route   PUT /api/courses/requests/:id/status
router.put('/requests/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Completed', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const CourseRequest = require('../models/CourseRequest');
    const request = await CourseRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Course request not found.' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete course request (Admin only)
// @route   DELETE /api/courses/requests/:id
router.delete('/requests/:id', protect, adminOnly, async (req, res) => {
  try {
    const CourseRequest = require('../models/CourseRequest');
    const request = await CourseRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Course request not found.' });
    }

    await request.deleteOne();
    res.json({ message: 'Course request deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
