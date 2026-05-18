const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@jobify.com',
        password: 'admin123',
        userType: 'admin',
        status: 'active',
        title: 'System Administrator',
        bio: 'Managing the Jobify platform.',
        location: 'San Francisco, CA'
    },
    {
        name: 'Tech Corp HR',
        email: 'employer1@tech.com',
        password: 'password123',
        userType: 'employer',
        status: 'active',
        title: 'Senior Recruiter',
        bio: 'Hiring for top tech talent.',
        location: 'New York, NY'
    },
    {
        name: 'Creative Studio',
        email: 'employer2@creative.com',
        password: 'password123',
        userType: 'employer',
        status: 'active',
        title: 'Talent Acquisition',
        bio: 'Looking for creative minds.',
        location: 'London, UK'
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        userType: 'job_seeker',
        status: 'active',
        title: 'Frontend Developer',
        bio: 'React enthusiast with 3 years of experience.',
        location: 'Austin, TX'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        userType: 'job_seeker',
        status: 'active',
        title: 'UX Designer',
        bio: 'Passionate about user-centered design.',
        location: 'Seattle, WA'
    },
    {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        userType: 'job_seeker',
        status: 'pending',
        title: 'Backend Engineer',
        bio: 'Node.js and Python developer.',
        location: 'Chicago, IL'
    },
    {
        name: 'Alice Williams',
        email: 'alice@example.com',
        password: 'password123',
        userType: 'job_seeker',
        status: 'suspended',
        title: 'Full Stack Developer',
        bio: 'Suspended user for testing.',
        location: 'Remote'
    },
    {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'password123',
        userType: 'job_seeker',
        status: 'active',
        title: 'Data Scientist',
        bio: 'Machine learning expert.',
        location: 'Boston, MA'
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected via script');

        await User.deleteMany({});
        console.log('Old users removed');

        // Passwords will be hashed by the pre-save hook in the User model
        // However, insertMany doesn't trigger pre-save hooks by default in some versions or configurations
        // To be safe and ensure hashing, we'll create instances or use a loop

        // Actually, let's just manually hash them here to be sure, or better, loop and save.
        // Looping ensures the pre('save') hook runs if we instantiate and save.

        for (const user of users) {
            // Create a new user instance to trigger the pre-save hook
            await User.create(user);
        }

        console.log('Users seeded successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedUsers();
