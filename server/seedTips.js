const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CareerTip = require('./models/CareerTip');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI);

const tips = [
    {
        title: 'How to Ace Your Technical Interview',
        category: 'Interview',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800',
        excerpt: 'Master the art of technical interviews with these 5 proven strategies used by top engineers.',
        content: `<h3>Understanding the Technical Interview</h3>
        <p>Technical interviews can be daunting, but with the right preparation, you can excel. Here are 5 strategies:</p>
        <ol>
            <li><strong>Understand the Fundamentals:</strong> Review data structures and algorithms.</li>
            <li><strong>Practice Mock Interviews:</strong> Use platforms like Pramp or mock interview with friends.</li>
            <li><strong>Communicate Your Thought Process:</strong> Interviewers care more about how you think than if you get the perfect answer immediately.</li>
            <li><strong>Ask Clarifying Questions:</strong> Don't jump into coding before understanding the edge cases.</li>
            <li><strong>Review System Design:</strong> For mid-to-senior roles, system design is crucial.</li>
        </ol>
        <p>Remember, it's a conversation, not an interrogation. Good luck!</p>`,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        author: 'Sarah Chen',
        date: 'May 10, 2026'
    },
    {
        title: 'Writing a Resume That Beats the ATS',
        category: 'Resume',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
        excerpt: 'Learn exactly what Applicant Tracking Systems look for and how to format your resume for maximum visibility.',
        content: `<h3>Beating the ATS</h3>
        <p>Applicant Tracking Systems (ATS) filter out a large percentage of resumes before a human ever sees them. Here is how to ensure yours gets through:</p>
        <ul>
            <li><strong>Use standard headings:</strong> Stick to "Work Experience", "Education", "Skills".</li>
            <li><strong>Avoid complex formatting:</strong> No columns, tables, or weird fonts. Stick to standard single-column layouts.</li>
            <li><strong>Incorporate keywords naturally:</strong> Read the job description and include exact matches for skills.</li>
            <li><strong>Save as PDF or Word:</strong> Unless specified otherwise, PDF is usually best to preserve formatting.</li>
        </ul>`,
        author: 'Marcus Johnson',
        date: 'May 8, 2026'
    },
    {
        title: 'The Introvert\'s Guide to Networking',
        category: 'Networking',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800',
        excerpt: 'Networking doesn\'t have to be exhausting. Discover authentic ways to build professional relationships.',
        content: `<h3>Networking for Introverts</h3><p>You don't need to be the loudest person in the room to network effectively. Focus on 1-on-1 conversations, ask insightful questions, and follow up online.</p>`,
        author: 'Elena Rodriguez',
        date: 'May 5, 2026'
    },
    {
        title: 'Negotiating Your First Tech Salary',
        category: 'Career Growth',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
        excerpt: 'Don\'t leave money on the table. A comprehensive guide to understanding equity, bonuses, and base pay.',
        content: `<h3>Salary Negotiation</h3><p>Always counter-offer. Research market rates on levels.fyi or Glassdoor. Understand the whole package, including RSU, signing bonus, and base salary.</p>`,
        author: 'David Kim',
        date: 'May 2, 2026'
    }
];

const seedTips = async () => {
    try {
        await CareerTip.deleteMany();
        await CareerTip.insertMany(tips);
        console.log('Career tips seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding tips:', error);
        process.exit(1);
    }
};

seedTips();
