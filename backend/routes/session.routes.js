const express = require('express');
const router = express.Router();
const Session = require('../models/Session.model');

// Create session
router.post('/', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session by 6-character code (for students joining)
router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const upperCode = code.toUpperCase();
    
    // Fetch all active sessions and find by last 6 characters
    const allSessions = await Session.find({ isActive: true });
    const session = allSessions.find(s => 
      s._id.toString().slice(-6).toUpperCase() === upperCode
    );
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ success: true, session });
  } catch (error) {
    console.error('Error finding session by code:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get session by full ObjectId
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End session
router.patch('/:id/end', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { isActive: false, endTime: new Date() },
      { new: true }
    );
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
