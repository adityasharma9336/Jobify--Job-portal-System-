const CareerTip = require('../models/CareerTip');

// @desc    Get all career tips
// @route   GET /api/tips
// @access  Public
const getTips = async (req, res) => {
    try {
        const tips = await CareerTip.find({}).sort({ createdAt: -1 });
        res.json(tips);
    } catch (error) {
        console.error('Error fetching tips:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single career tip by ID
// @route   GET /api/tips/:id
// @access  Public
const getTipById = async (req, res) => {
    try {
        const tip = await CareerTip.findById(req.params.id);
        if (tip) {
            res.json(tip);
        } else {
            res.status(404).json({ message: 'Tip not found' });
        }
    } catch (error) {
        console.error('Error fetching tip:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getTips,
    getTipById
};
