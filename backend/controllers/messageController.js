const Message = require('../models/Message');
const User = require('../models/User');

const isSender = (message, userId) => {
    if (!message) return false;
    const senderId = message.sender?._id ? message.sender._id.toString() : message.sender?.toString();
    return senderId === userId.toString();
};

// @desc    Get all unique conversations for the current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender', 'firstName lastName profilePicture role')
        .populate('receiver', 'firstName lastName profilePicture role')
        .sort({ createdAt: -1 });

        // Get unique conversation partners
        const seen = new Set();
        const conversations = [];
        for (const msg of messages) {
            // Guard against deleted sender/receiver accounts
            if (!msg.sender || !msg.receiver) continue;
            const partner = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
            if (!seen.has(partner._id.toString())) {
                seen.add(partner._id.toString());
                conversations.push({
                    partner,
                    lastMessage: msg.text,
                    lastTime: msg.createdAt,
                    propertyId: msg.property,
                });
            }
        }

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all messages between current user and a specific user
// @route   GET /api/messages/:userId
// @access  Private
const getChatMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const partnerId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: partnerId },
                { sender: partnerId, receiver: userId },
            ]
        })
        .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages/send
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, text, propertyId } = req.body;

        if (!receiverId || !text) {
            return res.status(400).json({ message: 'Receiver and message text are required' });
        }

        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            text,
            property: propertyId || null,
        });

        const populated = await message.populate([
            { path: 'sender', select: 'firstName lastName profilePicture' },
            { path: 'receiver', select: 'firstName lastName profilePicture' },
        ]);

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Edit a message sent by the current user
// @route   PUT /api/messages/:messageId
// @access  Private
const updateMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (!isSender(message, req.user._id)) {
            return res.status(403).json({ message: 'You can only edit your own messages' });
        }

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        message.text = text.trim();
        message.editedAt = new Date();
        await message.save();

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a message sent by the current user
// @route   DELETE /api/messages/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (!isSender(message, req.user._id)) {
            return res.status(403).json({ message: 'You can only delete your own messages' });
        }

        await message.deleteOne();

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete the entire conversation between current user and a partner
// @route   DELETE /api/messages/conversation/:userId
// @access  Private
const deleteConversation = async (req, res) => {
    try {
        const partnerId = req.params.userId;
        const userId = req.user._id;

        await Message.deleteMany({
            $or: [
                { sender: userId, receiver: partnerId },
                { sender: partnerId, receiver: userId },
            ],
        });

        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getConversations,
    getChatMessages,
    sendMessage,
    updateMessage,
    deleteMessage,
    deleteConversation,
};
