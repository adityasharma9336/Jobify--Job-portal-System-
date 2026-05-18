const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedAdminData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Create Admin User if not exists
        const adminEmail = 'admin@jobify.com';
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            admin = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: 'admin123',
                userType: 'admin',
                status: 'active'
            });
            console.log('Admin user created');
        } else {
            admin.userType = 'admin';
            await admin.save();
            console.log('Admin user updated');
        }

        // 2. Create a Job Seeker
        const seekerEmail = 'seeker@example.com';
        let seeker = await User.findOne({ email: seekerEmail });
        if (!seeker) {
            seeker = await User.create({
                name: 'Job Seeker',
                email: seekerEmail,
                password: 'seeker123',
                userType: 'job_seeker',
                status: 'active'
            });
            console.log('Job seeker created');
        }

        // 3. Create some applications
        const jobs = await Job.find().limit(5);
        if (jobs.length > 0) {
            // Clear existing applications for clean test
            await Application.deleteMany({ user: seeker._id });

            const applications = jobs.map(job => ({
                user: seeker._id,
                job: job._id,
                company: job.company,
                fullName: seeker.name,
                email: seeker.email,
                phone: '1234567890',
                coverLetter: 'I am interested in this position.',
                resume: 'resume.pdf',
                status: ['pending', 'applied', 'viewed', 'interviewing'][Math.floor(Math.random() * 4)]
            }));

            await Application.insertMany(applications);
            console.log(`${applications.length} applications seeded for seeker`);
        } else {
            console.log('No jobs found to create applications for. Please run seedDatabase first.');
        }

        console.log('Admin data seeding complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdminData();
