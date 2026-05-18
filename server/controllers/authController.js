const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_123', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, userType } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            userType
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                title: user.title,
                bio: user.bio,
                location: user.location,
                github: user.github,
                linkedin: user.linkedin,
                profileCompletion: user.profileCompletion,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                title: user.title,
                bio: user.bio,
                location: user.location,
                github: user.github,
                linkedin: user.linkedin,
                profileCompletion: user.profileCompletion,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            if (req.body.name !== undefined) user.name = req.body.name;
            if (req.body.title !== undefined) user.title = req.body.title;
            if (req.body.bio !== undefined) user.bio = req.body.bio;
            if (req.body.about !== undefined) user.bio = req.body.about; // Recruiters use 'about' for 'bio'
            if (req.body.location !== undefined) user.location = req.body.location;
            if (req.body.github !== undefined) user.github = req.body.github;
            if (req.body.linkedin !== undefined) user.linkedin = req.body.linkedin;
            if (req.body.industry !== undefined) user.industry = req.body.industry;
            if (req.body.website !== undefined) user.website = req.body.website;
            if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
            if (req.body.logo !== undefined) user.avatar = req.body.logo; // Map logo to avatar
            if (req.body.company !== undefined) user.company = req.body.company;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                userType: updatedUser.userType,
                title: updatedUser.title,
                bio: updatedUser.bio,
                location: updatedUser.location,
                github: updatedUser.github,
                linkedin: updatedUser.linkedin,
                industry: updatedUser.industry,
                website: updatedUser.website,
                avatar: updatedUser.avatar,
                company: updatedUser.company,
                profileCompletion: updatedUser.profileCompletion,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Social Login (Google/LinkedIn)
// @route   POST /api/auth/social-login
// @access  Public
const socialLogin = async (req, res) => {
    try {
        const { email, name, userType, provider } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, login
            return res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                title: user.title,
                bio: user.bio,
                location: user.location,
                github: user.github,
                linkedin: user.linkedin,
                company: user.company,
                profileCompletion: user.profileCompletion,
                token: generateToken(user._id),
            });
        }

        // New user, register with social info
        // We generate a random password since they use social login
        const randomPassword = Math.random().toString(36).slice(-8) + 'A1!';
        
        user = await User.create({
            name: name || 'Social User',
            email,
            password: randomPassword,
            userType: userType || 'job_seeker'
        });

        if (user) {
            // Seed initial data for new users so Overview is not empty
            try {
                const Activity = require('../models/Activity');
                const Application = require('../models/Application');
                const Job = require('../models/Job');

                if (user.userType === 'job_seeker') {
                    // Create some dummy applications and activities
                    const dummyJobs = await Job.find().limit(3);
                    if (dummyJobs.length > 0) {
                        for (const job of dummyJobs) {
                            await Application.create({
                                user: user._id,
                                job: job._id,
                                company: job.company,
                                fullName: user.name,
                                email: user.email,
                                status: 'pending'
                            });
                        }
                    }
                    await Activity.create({
                        user: user._id,
                        type: 'alert',
                        description: 'Welcome to Jobify! Your profile is being viewed by top recruiters.'
                    });
                }
            } catch (seedError) {
                console.error('Error seeding new social user:', seedError);
            }

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    socialLogin
};
