const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Activity = require('./models/Activity');
const Company = require('./models/Company');
const CareerTip = require('./models/CareerTip');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://adityasharma9336:aditya123@cluster0.ru6jsl6.mongodb.net/jobify?retryWrites=true&w=majority');
        console.log('Connected to MongoDB for seeding...');

        // 1. Find the user 'aditya' to associate data with
        const user = await User.findOne({ email: 'adityasharma9336@gmail.com' }) || await User.findOne({ name: /aditya/i });
        if (!user) {
            console.log('User aditya not found. Please register first.');
            process.exit(1);
        }
        console.log(`Seeding data for user: ${user.name} (${user._id})`);

        // 2. Clear existing data (optional, but good for clean state)
        // await Job.deleteMany({});
        // await Application.deleteMany({ user: user._id });
        // await Activity.deleteMany({ user: user._id });

        // 1b. Create an employer user
        let employer = await User.findOne({ email: 'employer@jobify.com' });
        if (!employer) {
            employer = await User.create({
                name: 'Sarah Recruiter',
                email: 'employer@jobify.com',
                password: 'password123',
                userType: 'employer',
                title: 'Senior HR at Google'
            });
        }
        console.log(`Employer created: ${employer.name} (${employer._id})`);

        // 3. Seed Companies
        const companies = [
            { name: 'Google', industry: 'Technology', location: 'Mountain View, CA', logo: 'https://logo.clearbit.com/google.com', owner: employer._id },
            { name: 'Meta', industry: 'Social Media', location: 'Menlo Park, CA', logo: 'https://logo.clearbit.com/meta.com', owner: employer._id },
            { name: 'Amazon', industry: 'E-commerce', location: 'Seattle, WA', logo: 'https://logo.clearbit.com/amazon.com', owner: employer._id },
            { name: 'Microsoft', industry: 'Software', location: 'Redmond, WA', logo: 'https://logo.clearbit.com/microsoft.com', owner: employer._id }
        ];

        let companyDocs = [];
        for (const c of companies) {
            let existing = await Company.findOne({ name: c.name });
            if (!existing) {
                existing = await Company.create(c);
            } else {
                existing.owner = employer._id;
                await existing.save();
            }
            companyDocs.push(existing);
        }

        // 4. Seed Jobs
        const jobsData = [
            { title: 'Frontend Developer', company: 'Google', location: 'Remote', type: 'Full-time', salary: '$120k - $150k', category: 'Engineering', description: 'We are looking for a visionary Frontend Developer to join our Google team. You will be responsible for defining the user experience across our digital products, ensuring they are not only functional but visually stunning and intuitive.' },
            { title: 'Product Designer', company: 'Meta', location: 'Menlo Park, CA', type: 'Full-time', salary: '$130k - $160k', category: 'Design', description: 'Design next gen social features for billions of users.' },
            { title: 'Backend Engineer', company: 'Amazon', location: 'Seattle, WA', type: 'Full-time', salary: '$140k - $180k', category: 'Engineering', description: 'Scaling microservices and cloud infrastructure.' },
            { title: 'Marketing Manager', company: 'Microsoft', location: 'Redmond, WA', type: 'Full-time', salary: '$110k - $140k', category: 'Marketing', description: 'Leading cloud marketing campaigns for Azure.' },
            { title: 'Senior UX Designer', company: 'Google', location: 'Mountain View, CA', type: 'Full-time', salary: '$150k - $190k', category: 'Design', description: 'Evolving the future of search and AI interfaces.' },
            { title: 'Cloud Architect', company: 'Amazon', location: 'Remote', type: 'Contract', salary: '$160k - $220k', category: 'Engineering', description: 'Designing serverless architectures on AWS.' }
        ];

        let jobDocs = [];
        for (const j of jobsData) {
            const companyDoc = companyDocs.find(c => c.name === j.company);
            let existing = await Job.findOne({ title: j.title, company: j.company });
            if (!existing) {
                existing = await Job.create({
                    ...j,
                    companyLogo: companyDoc?.logo || '',
                    icon: j.category === 'Engineering' ? 'code' : j.category === 'Design' ? 'palette' : 'campaign',
                    logoBg: j.category === 'Engineering' ? 'bg-blue-600' : j.category === 'Design' ? 'bg-pink-600' : 'bg-orange-600',
                    logoColor: 'text-white',
                    postedBy: employer._id
                });
            } else {
                existing.companyLogo = companyDoc?.logo || '';
                existing.postedBy = employer._id;
                existing.description = j.description;
                await existing.save();
            }
            jobDocs.push(existing);
        }

        // 5. Seed Applications
        const statuses = ['applied', 'viewed', 'interviewing', 'offer', 'rejected'];
        for (let i = 0; i < jobDocs.length; i++) {
            const existingApp = await Application.findOne({ user: user._id, job: jobDocs[i]._id });
            if (!existingApp) {
                await Application.create({
                    user: user._id,
                    job: jobDocs[i]._id,
                    company: jobDocs[i].company,
                    fullName: user.name,
                    email: user.email,
                    status: statuses[i % statuses.length],
                    appliedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000))
                });
            }
        }

        // 6. Seed Activities/Notifications
        const activitiesData = [
            { user: user._id, type: 'application', description: 'You applied for Frontend Developer at Google', createdAt: new Date() },
            { user: user._id, type: 'alert', description: 'Your application for Product Designer at Meta was viewed', createdAt: new Date(Date.now() - 3600000) },
            { user: user._id, type: 'alert', description: 'New interview scheduled with Amazon for Backend Engineer', createdAt: new Date(Date.now() - 7200000) }
        ];

        for (const a of activitiesData) {
            await Activity.create(a);
        }

        // 7. Seed Career Tips
        const tips = [
            { 
                title: 'Resume Building 101', 
                category: 'Resume', 
                author: 'Jobify Team', 
                readTime: '5 min', 
                excerpt: 'Learn the secrets to a perfect resume that gets you noticed by top recruiters.',
                content: 'Full content for resume building...', 
                image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
                date: 'May 20, 2026'
            },
            { 
                title: 'Note: Common Interview Mistakes', 
                category: 'Note', 
                author: 'Career Expert', 
                readTime: '3 min', 
                excerpt: 'A quick checklist of things to avoid during your next job interview.',
                content: '1. Arriving late\n2. Not researching the company\n3. Poor body language...', 
                image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
                date: 'May 19, 2026'
            },
            { 
                title: 'Mastering React Interviews', 
                category: 'Interview', 
                author: 'Aditya Sharma', 
                readTime: '10 min', 
                excerpt: 'Prepare for your next technical interview with these common React questions.',
                content: 'Deep dive into hooks and performance...', 
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
                date: 'May 18, 2026'
            },
            { 
                title: 'Note: Salary Negotiation Script', 
                category: 'Note', 
                author: 'HR Lead', 
                readTime: '4 min', 
                excerpt: 'Exactly what to say when discussing your compensation package.',
                content: 'When the recruiter asks about salary, try saying: "Based on my research and the value I bring..."', 
                image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
                date: 'May 17, 2026'
            },
            { 
                title: 'Networking in Tech', 
                category: 'Networking', 
                author: 'Career Expert', 
                readTime: '7 min', 
                excerpt: 'How to build meaningful connections in the tech industry.',
                content: 'Effective networking strategies...', 
                image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
                date: 'May 15, 2026'
            }
        ];

        for (const t of tips) {
            let existing = await CareerTip.findOne({ title: t.title });
            if (!existing) {
                await CareerTip.create(t);
            }
        }

        // 8. Seed Messages
        const Message = require('./models/Message');
        const messagesData = [
            { sender: user._id, receiver: employer._id, content: 'Hi, I am interested in the Frontend Developer role at Google.' },
            { sender: employer._id, receiver: user._id, content: 'Hello Aditya! We would love to chat. Are you available for a quick call tomorrow?' },
            { sender: user._id, receiver: employer._id, content: 'Yes, definitely! What time works best for you?' }
        ];

        for (const m of messagesData) {
            const exists = await Message.findOne({ content: m.content });
            if (!exists) {
                await Message.create(m);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
