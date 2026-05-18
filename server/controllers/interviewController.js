const Interview = require('../models/Interview');
const Application = require('../models/Application');

const getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user._id }).sort({ date: 1 });
        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const scheduleInterview = async (req, res) => {
    try {
        // If employer is scheduling, they will pass userId and applicationId.
        // Otherwise, it might be a user scheduling for themselves (fallback for backward compatibility).
        const { userId, applicationId, company, title, type, location, date, time, interviewer } = req.body;

        if (!date || !time) {
            return res.status(400).json({ message: 'Date and time are required' });
        }

        const scheduledUserId = userId || (req.user ? req.user._id : null);
        if (!scheduledUserId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const interview = await Interview.create({
            user: scheduledUserId,
            employer: req.user._id,
            company: company || 'Jobify Partner',
            title: title || 'Job Interview',
            type: type || 'Technical',
            location,
            date,
            time,
            interviewer: interviewer || { name: (req.user && req.user.name) ? req.user.name : 'Recruiter', role: 'Hiring Manager', avatar: '' }
        });

        // Update application if context provided
        if (applicationId) {
            await Application.findByIdAndUpdate(applicationId, { status: 'accepted' });
        }

        res.status(201).json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmployerInterviews = async (req, res) => {
    try {
        // Find interviews where the employer matches the logged-in user
        const interviews = await Interview.find({ employer: req.user._id })
            .populate('user', 'name email avatar')
            .sort({ date: 1 });
        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyInterviews, scheduleInterview, getEmployerInterviews };
