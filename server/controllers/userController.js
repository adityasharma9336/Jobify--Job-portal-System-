const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const { logActivity } = require('./activityController');

// @desc    Toggle saved job
// @route   POST /api/users/saved-jobs
// @access  Private
const toggleSavedJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user.savedJobs) {
            user.savedJobs = [];
        }

        if (user.savedJobs.includes(jobId)) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
            await user.save();
            return res.json({ message: 'Job removed from saved list', saved: false });
        } else {
            user.savedJobs.push(jobId);
            await user.save();
            return res.json({ message: 'Job saved successfully', saved: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private
const getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedJobs');
        res.json(user?.savedJobs || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle follow company
// @route   POST /api/users/followed-companies
// @access  Private
const toggleFollowCompany = async (req, res) => {
    try {
        const { companyId } = req.body;
        const user = await User.findById(req.user._id);
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        if (!user.followedCompanies) {
            user.followedCompanies = [];
        }

        if (user.followedCompanies.includes(companyId)) {
            user.followedCompanies = user.followedCompanies.filter(id => id.toString() !== companyId);
            await user.save();
            await logActivity(user._id, 'unfollow', `You unfollowed ${company.name}`, companyId);
            return res.json({ message: 'Unfollowed company', followed: false });
        } else {
            user.followedCompanies.push(companyId);
            await user.save();
            await logActivity(user._id, 'follow', `You followed ${company.name}`, companyId);
            return res.json({ message: 'Company followed successfully', followed: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get followed companies
// @route   GET /api/users/followed-companies
// @access  Private
const getFollowedCompanies = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('followedCompanies');
        res.json(user?.followedCompanies || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name avatar email');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    toggleSavedJob,
    getSavedJobs,
    toggleFollowCompany,
    getFollowedCompanies,
    getUserById
};
