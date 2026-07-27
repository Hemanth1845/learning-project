const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwttoken', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      streak: 1,
      lastLoginDate: new Date()
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        rank: user.rank,
        profilePic: user.profilePic,
        yearOfStudy: user.yearOfStudy,
        branch: user.branch
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Your account has been suspended by the administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update streak logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.lastLoginDate) {
      const lastLogin = new Date(user.lastLoginDate);
      lastLogin.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today - lastLogin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    user.lastLoginDate = new Date();
    await user.save();

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        rank: user.rank,
        profilePic: user.profilePic,
        yearOfStudy: user.yearOfStudy,
        branch: user.branch
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    OAuth/Google sign-in
// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { email, name, profilePic, googleId } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      // Create user if not exists
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        username: name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
        email,
        password: hashedPassword,
        profilePic: profilePic || '',
        streak: 1,
        lastLoginDate: new Date()
      });
    } else {
      if (user.status === 'blocked') {
        return res.status(403).json({ message: 'Your account has been suspended by the administrator.' });
      }
      // Update streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (user.lastLoginDate) {
        const lastLogin = new Date(user.lastLoginDate);
        lastLogin.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today - lastLogin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.streak += 1;
        } else if (diffDays > 1) {
          user.streak = 1;
        }
      } else {
        user.streak = 1;
      }
      user.lastLoginDate = new Date();
      if (profilePic && !user.profilePic) user.profilePic = profilePic;
      await user.save();
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        rank: user.rank,
        profilePic: user.profilePic,
        yearOfStudy: user.yearOfStudy,
        branch: user.branch
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    // Recalculate Rank dynamically based on XP
    const usersCount = await User.find({ role: { $ne: 'admin' }, xp: { $gt: req.user.xp } }).countDocuments();
    req.user.rank = usersCount + 1;
    await req.user.save();

    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      xp: req.user.xp,
      streak: req.user.streak,
      rank: req.user.rank,
      profilePic: req.user.profilePic,
      yearOfStudy: req.user.yearOfStudy,
      branch: req.user.branch
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user academic profile (year of study and branch)
// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { yearOfStudy, branch } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (yearOfStudy) user.yearOfStudy = yearOfStudy;
    if (branch) user.branch = branch;

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      xp: user.xp,
      streak: user.streak,
      rank: user.rank,
      profilePic: user.profilePic,
      yearOfStudy: user.yearOfStudy,
      branch: user.branch
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
