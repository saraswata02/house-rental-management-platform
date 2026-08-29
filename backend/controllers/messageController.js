const Message = require('../models/Message');
const User = require('../models/User');

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

module.exports = { getConversations, getChatMessages, sendMessage };
