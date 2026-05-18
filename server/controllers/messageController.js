const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            content
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get conversation with a user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user._id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all conversations
// @route   GET /api/messages
// @access  Private
const getConversations = async (req, res) => {
    try {
        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: req.user._id }, { receiver: req.user._id }]
        }).populate('sender', 'name avatar').populate('receiver', 'name avatar').sort({ createdAt: -1 });

        // Extract unique users from messages
        const users = [];
        const userIds = new Set();

        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
            if (!userIds.has(otherUser._id.toString())) {
                userIds.add(otherUser._id.toString());
                users.push({
                    user: otherUser,
                    lastMessage: msg
                });
            }
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getConversations
};
