const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubt.controller');

router.post('/', doubtController.submitDoubt.bind(doubtController));
router.get('/session/:sessionId', doubtController.getDoubts.bind(doubtController));
router.patch('/:id/answer', doubtController.markAnswered.bind(doubtController));
router.post('/:id/upvote', doubtController.upvoteDoubt.bind(doubtController));

module.exports = router;
