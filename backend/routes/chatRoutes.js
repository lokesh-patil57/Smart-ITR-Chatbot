const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Chat endpoint
router.post('/chat', chatController.processMessage);

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Chat route is working!' });
});

module.exports = router; 