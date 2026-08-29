const express = require('express');
const router = express.Router();
const { getConversations, getChatMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.post('/send', protect, sendMessage);
router.get('/:userId', protect, getChatMessages);

module.exports = router;
