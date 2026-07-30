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
  slug: {
    type: String,
    required: true,
    unique: true
  },
  year_level: {
    type: [String],
    default: ["2nd", "3rd", "4th"]
  },
  target_role: {
    type: String,
    default: 'Software Engineer'
  },
  is_placement_prep: {
    type: Boolean,
    default: true
  },
  isDaily: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DSAProblem', DSAProblemSchema);
