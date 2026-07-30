const mongoose = require('mongoose');

const CourseRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Programming', 'AI', 'DSA', 'Aptitude', 'DevOps', 'Cloud', 'Other'],
    default: 'Other'
  },
  priority: {
    type: String,
    required: true,
    enum: ['Urgent', 'Medium', 'Low'],
    default: 'Medium'
  },
  reason: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  referenceLinks: {
    type: String,
    trim: true
  },
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CourseRequest', CourseRequestSchema);
