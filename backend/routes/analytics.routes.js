const express = require('express');
const router = express.Router();
const Doubt = require('../models/Doubt.model');
const Confusion = require('../models/Confusion.model');
const mongoose = require('mongoose');

// Get session analytics
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Convert string to ObjectId
    const sessionObjectId = mongoose.Types.ObjectId.isValid(sessionId)
      ? new mongoose.Types.ObjectId(sessionId)
      : sessionId;

    const topicDistribution = await Doubt.aggregate([
      { $match: { sessionId: sessionObjectId } },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const confusionTimeline = await Confusion.aggregate([
      { $match: { sessionId: sessionObjectId } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%H:%M', date: '$timestamp' }
          },
          avgLevel: { $avg: '$level' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      analytics: {
        topicDistribution,
        confusionTimeline
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
