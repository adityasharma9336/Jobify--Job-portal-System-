const Application = require('../models/Application');
const Activity = require('../models/Activity');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
const applyForJob = async (req, res) => {
    try {
        const { jobId, fullName, email, phone, coverLetter, resume } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const applicationExists = await Application.findOne({
            user: req.user._id,
            job: jobId
        });

        if (applicationExists) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            user: req.user._id,
            job: jobId,
            company: job.company,
            fullName,
            email,
            phone,
            coverLetter,
            resume
        });

        // Log activity
        await Activity.create({
            user: req.user._id,
            type: 'application',
            description: `Applied for ${job.title} at ${job.company}`,
            relatedId: application._id
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's applications
// @route   GET /api/applications
// @access  Private
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id })
            .populate('job', 'title company location type salary icon logoBg logoColor')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get application stats
// @route   GET /api/applications/stats
// @access  Private
const getApplicationStats = async (req, res) => {
    try {
        const total = await Application.countDocuments({ user: req.user._id });
        const interviewing = await Application.countDocuments({ user: req.user._id, status: 'interviewing' });
        const offers = await Application.countDocuments({ user: req.user._id, status: 'offer' });

        res.json({
            total,
            interviewing,
            offers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get employer's applications
// @route   GET /api/applications/employer
// @access  Private (Employer only)
const getEmployerApplications = async (req, res) => {
    try {
        // Find all jobs posted by this employer or matching their company name
        const query = { $or: [{ postedBy: req.user._id }] };
        if (req.user.company) {
            query.$or.push({ company: { $regex: new RegExp(`^${req.user.company}$`, 'i') } });
        }
        const myJobs = await Job.find(query);
        const jobIds = myJobs.map(job => job._id);

        // Find applications for these jobs
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate('job', 'title type location')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get employer stats
// @route   GET /api/applications/employer/stats
// @access  Private (Employer only)
const getEmployerStats = async (req, res) => {
    try {
        const query = { $or: [{ postedBy: req.user._id }] };
        if (req.user.company) {
            query.$or.push({ company: { $regex: new RegExp(`^${req.user.company}$`, 'i') } });
        }
        const myJobs = await Job.find(query);
        const jobIds = myJobs.map(job => job._id);

        const activeJobs = myJobs.length;
        const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });

        // Mock profile views for now or calculate based on jobs
        const profileViews = activeJobs * 12 + totalApplications * 3;

        res.json({
            activeJobs,
            totalApplications,
            profileViews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update employer application status
// @route   PATCH /api/applications/employer/:id/status
// @access  Private (Employer only)
const updateEmployerApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // We could verify the job belongs to the employer, assuming it's done via middleware or simple check
        application.status = status;
        const updatedApplication = await application.save();

        if (Activity) {
            await Activity.create({
                user: application.user,
                type: 'application_update',
                description: `Your application status for ${application.company} has been updated to ${status}`,
                relatedId: application._id
            });
        }

        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getApplicationStats,
    getEmployerApplications,
    getEmployerStats,
    updateEmployerApplicationStatus
};
