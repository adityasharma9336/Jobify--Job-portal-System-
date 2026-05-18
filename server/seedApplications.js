const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');
const Application = require('./models/Application');

dotenv.config();

const seedApplications = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected via script');

        await Application.deleteMany({});
        console.log('Old applications removed');

        const jobs = await Job.find().limit(5);
        if (jobs.length === 0) {
            console.error('No jobs found. Run seedJobs.js first.');
            process.exit(1);
        }

        const seekers = await User.find({ userType: 'job_seeker' });
        if (seekers.length === 0) {
            console.error('No job seekers found. Run seedUsers.js first.');
            process.exit(1);
        }

        const applications = [];
        const statuses = ['pending', 'viewed', 'interviewing', 'accepted', 'rejected', 'offer'];

        // Assign a few applications from random seekers to random jobs
        for (let i = 0; i < 15; i++) {
            const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
            const randomSeeker = seekers[Math.floor(Math.random() * seekers.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            applications.push({
                user: randomSeeker._id,
                job: randomJob._id,
                company: randomJob.company,
                status: randomStatus,
                appliedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) // random date in last 10 days
            });
        }

        // To ensure uniqueness of (user, job) pair if there was an index, let's just insert them
        // There's no unique compound index by default in Application.js
        await Application.insertMany(applications);
        console.log(`${applications.length} Applications seeded successfully`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedApplications();
