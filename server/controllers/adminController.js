const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const Interview = require('../models/Interview');

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const jobCount = await Job.countDocuments();
        const companyCount = await Company.countDocuments();

        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: 'pending' });
        const acceptedApplications = await Application.countDocuments({ status: 'accepted' }); // Assuming 'accepted' or similar exists. We'll map 'offer'/'hired' to accepted if needed, let's stick to the base statuses. 
        // Note: Existing application model might have 'pending', 'reviewing', 'interviewing', 'offer', 'rejected'. 
        // Let's use specific statuses based on what's common or check the Application model later. I'll stick to a generic query for now.
        const offerApplications = await Application.countDocuments({ status: { $in: ['offer', 'hired', 'accepted'] } });
        const rejectedApplications = await Application.countDocuments({ status: 'rejected' });

        // Get recent activity (last 5 users and jobs)
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
        const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5).populate('company', 'name logo');

        res.json({
            counts: {
                users: userCount,
                jobs: jobCount,
                companies: companyCount,
                applications: {
                    total: totalApplications,
                    pending: pendingApplications,
                    accepted: offerApplications,
                    rejected: rejectedApplications
                }
            },
            recentActivity: {
                users: recentUsers,
                jobs: recentJobs
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);

        if (user) {
            user.status = status || user.status;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('company', 'name').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            await job.deleteOne();
            res.json({ message: 'Job removed' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all companies
// @route   GET /api/admin/companies
// @access  Private/Admin
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ createdAt: -1 });
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete company
// @route   DELETE /api/admin/companies/:id
// @access  Private/Admin
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (company) {
            await company.deleteOne();
            // Optionally delete associated jobs
            await Job.deleteMany({ company: company.name });
            res.json({ message: 'Company removed' });
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private/Admin
const getApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('user', 'name email github')
            .populate('job', 'title company location type')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update application status
// @route   PATCH /api/admin/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (application) {
            application.status = status;
            const updatedApplication = await application.save();

            // Optionally, create an activity log for the user
            const Activity = require('../models/Activity');
            if (Activity) {
                await Activity.create({
                    user: application.user,
                    type: 'application_update',
                    description: `Your application status has been updated to ${status}`,
                    relatedId: application._id
                });
            }

            res.json(updatedApplication);
        } else {
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Schedule interview for a candidate
// @route   POST /api/admin/interviews
// @access  Private/Admin
const scheduleInterview = async (req, res) => {
    try {
        const { userId, applicationId, company, title, type, location, date, time, interviewer } = req.body;

        const interview = await Interview.create({
            user: userId,
            employer: req.user._id,
            company,
            title,
            type,
            location,
            date,
            time,
            interviewer: interviewer || { name: 'Admin Recruiter', role: 'Hiring Manager', avatar: '' }
        });

        // Update application status to 'accepted'
        if (applicationId) {
            await Application.findByIdAndUpdate(applicationId, { status: 'accepted' });
        }

        res.status(201).json(interview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all interviews
// @route   GET /api/admin/interviews
// @access  Private/Admin
const getInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find()
            .populate('user', 'name email github')
            .sort({ date: 1 });

        res.json(interviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getStats,
    getUsers,
    deleteUser,
    updateUserStatus,
    getJobs,
    deleteJob,
    getCompanies,
    deleteCompany,
    getApplications,
    updateApplicationStatus,
    scheduleInterview,
    getInterviews
};
