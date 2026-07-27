const mongoose = require('mongoose');

const DSAProblemSchema = new mongoose.Schema({
  problemId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  xp: {
    type: Number,
    required: true
  },
  solveUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  examples: [
    {
      input: String,
      output: String,
      explanation: String
    }
  ],
  codeTemplates: {
    javascript: String,
    python: String,
    java: String,
    cpp: String
  },
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DSAProblem', DSAProblemSchema);
