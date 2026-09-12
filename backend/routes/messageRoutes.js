const express = require('express');
const router = express.Router();
const {
    getConversations,
    getChatMessages,
    sendMessage,
    updateMessage,
    deleteMessage,
    deleteConversation,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.post('/send', protect, sendMessage);
router.put('/:messageId', protect, updateMessage);
router.delete('/:messageId', protect, deleteMessage);
router.delete('/conversation/:userId', protect, deleteConversation);
router.get('/:userId', protect, getChatMessages);

module.exports = router;
