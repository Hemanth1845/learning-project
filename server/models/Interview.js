const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['ai', 'user'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const FeedbackSchema = new mongoose.Schema({
  overallScore: {
    type: Number,
    default: 0
  },
  summary: {
    type: String,
    default: ''
  },
  strengths: [{
    type: String
  }],
  weaknesses: [{
    type: String
  }],
  tips: [{
    type: String
  }]
});

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  chatHistory: [MessageSchema],
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  feedback: {
    type: FeedbackSchema,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', InterviewSchema);
