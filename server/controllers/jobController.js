const Job = require('../models/Job');

// @desc    Fetch all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const { keyword, company, location, type, salary, datePosted, category, experience, limit } = req.query;
        let query = {};

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ];
        }

        if (company) {
            query.company = { $regex: company.trim(), $options: 'i' };
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (category) {
            const cleanCategory = category.trim();
            query.category = { $regex: `^${cleanCategory}$`, $options: 'i' };
        }

        if (experience) {
            query.experience = experience;
        }

        if (salary) {
            query.salary = salary;
        }

        if (datePosted && datePosted !== 'All time') {
            let days = 0;
            if (datePosted === 'Last 24h') days = 1;
            else if (datePosted === 'Last 7 days') days = 7;
            else if (datePosted === 'Last 30 days') days = 30;

            if (days > 0) {
                const date = new Date();
                date.setDate(date.getDate() - days);
                query.postedAt = { $gte: date };
            }
        }

        if (type) {
            query.type = { $regex: `^${type}$`, $options: 'i' };
        }

        let jobsQuery = Job.find(query);

        if (limit) {
            jobsQuery = jobsQuery.limit(parseInt(limit));
        }

        const jobs = await jobsQuery.sort({ postedAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed jobs
// @route   POST /api/jobs/seed
// @access  Public (for demo)
const seedJobs = async (req, res) => {
    try {
        const { seedDatabase } = require('./seedController');
        return seedDatabase(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer/Admin)
const createJob = async (req, res) => {
    try {
        const { title, company, location, type, salary, description, category, icon, logoBg, logoColor } = req.body;

        const job = new Job({
            title,
            company,
            location,
            type,
            salary,
            description,
            category: category || 'Other',
            icon: icon || 'work',
            logoBg: logoBg || 'bg-gray-100',
            logoColor: logoColor || 'text-gray-600',
            postedBy: req.user._id // Assuming auth middleware adds user to req
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer/Admin)
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({ postedAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getJobs,
    getJobById,
    seedJobs,
    createJob,
    getMyJobs
};
