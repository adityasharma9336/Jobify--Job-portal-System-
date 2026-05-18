const Activity = require('../models/Activity');

// @desc    Get recent activity
// @route   GET /api/activities
// @access  Private
const getRecentActivity = async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logActivity = async (userId, type, description, relatedId = null) => {
    try {
        await Activity.create({
            user: userId,
            type,
            description,
            relatedId
        });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

module.exports = {
    getRecentActivity,
    logActivity
};
