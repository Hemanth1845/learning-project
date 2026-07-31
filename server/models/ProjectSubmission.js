const mongoose = require('mongoose');

const ProjectSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  projectIndex: {
    type: Number,
    default: 1
  },
  projectTitle: {
    type: String,
    default: 'Project'
  },
  githubLink: {
    type: String,
    default: ''
  },
  liveDemoLink: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: 'project-submission.zip'
  },
  reportText: {
    type: String,
    default: ''
  },
  remarks: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Needs Improvement'],
    default: 'Pending'
  },
  scores: {
    ui: { type: Number, default: 0 },
    codeQuality: { type: Number, default: 0 },
    logic: { type: Number, default: 0 },
    overall: { type: Number, default: 0 }
  },
  aiSuggestions: {
    strengths: { type: String, default: '' },
    weaknesses: { type: String, default: '' },
    suggestions: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProjectSubmission', ProjectSubmissionSchema);
