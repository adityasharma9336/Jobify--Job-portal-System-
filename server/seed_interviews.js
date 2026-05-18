const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedForVerification = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://adityasharma9336:aditya123@cluster0.ru6jsl6.mongodb.net/jobify?retryWrites=true&w=majority');
        console.log('Connected to MongoDB...');

        // 1. Create/Find Recruiter
        let recruiter = await User.findOne({ email: 'recruiter_test@jobify.com' });
        if (!recruiter) {
            recruiter = await User.create({
                name: 'Ravi Recruiter',
                email: 'recruiter_test@jobify.com',
                password: 'password123',
                userType: 'employer',
                title: 'Hiring Manager'
            });
        }

        // 2. Create/Find Seeker
        let seeker = await User.findOne({ email: 'seeker_test@jobify.com' });
        if (!seeker) {
            seeker = await User.create({
                name: 'Sarah Jenkins',
                email: 'seeker_test@jobify.com',
                password: 'password123',
                userType: 'job_seeker'
            });
        }

        // 3. Create a Job for the recruiter
        let job = await Job.findOne({ title: 'Full Stack Developer', postedBy: recruiter._id });
        if (!job) {
            job = await Job.create({
                title: 'Full Stack Developer',
                company: 'TechFlow',
                location: 'Remote',
                type: 'Full-time',
                salary: '$120k - $150k',
                category: 'Engineering',
                description: 'Build amazing things.',
                postedBy: recruiter._id,
                icon: 'code',
                logoBg: 'bg-blue-600',
                logoColor: 'text-white'
            });
        }

        // 4. Create an Application for that job
        let app = await Application.findOne({ user: seeker._id, job: job._id });
        if (!app) {
            app = await Application.create({
                user: seeker._id,
                job: job._id,
                company: 'TechFlow',
                fullName: 'Sarah Jenkins',
                email: 'seeker_test@jobify.com',
                phone: '+1 234 567 890',
                status: 'pending',
                resume: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
            });
        }

        console.log('Seeding successful! Recruiter: recruiter_test@jobify.com / password123');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedForVerification();
