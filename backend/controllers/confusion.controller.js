const Confusion = require('../models/Confusion.model');
const Session = require('../models/Session.model');
const mongoose = require('mongoose');

class ConfusionController {
  // Submit confusion level
  async submitConfusion(req, res) {
    try {
      const { sessionId, studentId, studentName, level } = req.body;

      const confusion = new Confusion({
        sessionId,
        studentId,
        studentName,
        level
      });

      await confusion.save();

      // Get current confusion stats
      const stats = await this.getConfusionStats(sessionId);

      // Emit real-time update
      const io = req.app.get('io');
      io.to(sessionId).emit('confusion-updated', stats);

      res.status(201).json({
        success: true,
        confusion,
        stats
      });
    } catch (error) {
      console.error('Error submitting confusion:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get confusion statistics (FIXED)
  async getConfusionStats(sessionId) {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      // Convert string to ObjectId if needed
      const sessionObjectId = mongoose.Types.ObjectId.isValid(sessionId) 
        ? new mongoose.Types.ObjectId(sessionId)
        : sessionId;

      const recentConfusion = await Confusion.aggregate([
        {
          $match: {
            sessionId: sessionObjectId,
            timestamp: { $gte: fiveMinutesAgo }
          }
        },
        {
          $sort: { timestamp: -1 }
        },
        {
          $group: {
            _id: '$studentId',
            latestLevel: { $first: '$level' }
          }
        },
        {
          $group: {
            _id: '$latestLevel',
            count: { $sum: 1 }
          }
        }
      ]);

      const stats = {
        clear: 0,
        slight: 0,
        confused: 0,
        lost: 0,
        total: 0
      };

      const levelMap = ['clear', 'slight', 'confused', 'lost'];
      recentConfusion.forEach(item => {
        const levelName = levelMap[item._id];
        if (levelName) {
          stats[levelName] = item.count;
          stats.total += item.count;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting confusion stats:', error);
      // Return default stats on error
      return {
        clear: 0,
        slight: 0,
        confused: 0,
        lost: 0,
        total: 0
      };
    }
  }

  // Get confusion stats endpoint (FIXED)
  async getStats(req, res) {
    try {
      const { sessionId } = req.params;
      const stats = await this.getConfusionStats(sessionId);

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Error fetching confusion stats:', error);
      res.status(500).json({ 
        error: error.message,
        stats: {
          clear: 0,
          slight: 0,
          confused: 0,
          lost: 0,
          total: 0
        }
      });
    }
  }
}

module.exports = new ConfusionController();
