const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  teacherId: {
    type: String,
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  settings: {
    allowAnonymous: {
      type: Boolean,
      default: true
    },
    confusionThreshold: {
      type: Number,
      default: 60
    },
    autoMergeDoubts: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    totalDoubts: {
      type: Number,
      default: 0
    },
    answeredDoubts: {
      type: Number,
      default: 0
    },
    activeStudents: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);
