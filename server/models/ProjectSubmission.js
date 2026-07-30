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
  fileUrl: {
    type: String,
    required: true // base64 or link to uploaded project file
  },
  fileName: {
    type: String,
    default: 'project-submission.zip'
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProjectSubmission', ProjectSubmissionSchema);
