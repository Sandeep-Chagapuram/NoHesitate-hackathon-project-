const mongoose = require('mongoose');

const confusionSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    min: 0,
    max: 3,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for aggregation queries
confusionSchema.index({ sessionId: 1, timestamp: -1 });

module.exports = mongoose.model('Confusion', confusionSchema);
