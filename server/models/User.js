const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  xp: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastLoginDate: {
    type: Date,
    default: null
  },
  rank: {
    type: Number,
    default: 999
  },
  profilePic: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  },
  resume: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  resumeActiveSections: {
    type: [String],
    default: ['education', 'experience', 'projects', 'skills']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
