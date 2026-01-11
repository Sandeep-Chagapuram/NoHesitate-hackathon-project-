const express = require('express');
const router = express.Router();
const confusionController = require('../controllers/confusion.controller');

router.post('/', confusionController.submitConfusion.bind(confusionController));
router.get('/stats/:sessionId', confusionController.getStats.bind(confusionController));

module.exports = router;