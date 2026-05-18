const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    icon: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: ''
    },
    foundedYear: {
        type: String,
        default: '2020'
    },
    companySize: {
        type: String,
        default: '1-50'
    },
    headquarters: {
        type: String,
        default: 'Remote'
    },
    website: {
        type: String,
        default: '#'
    },
    techStack: [{
        type: String
    }],
    socialLinks: {
        linkedin: String,
        twitter: String,
        github: String
    },
    rating: {
        type: Number,
        default: 0
    },
    jobs: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true
    },
    ceo: {
        type: String,
        default: 'Not specified'
    },
    revenue: {
        type: String,
        default: 'Undisclosed'
    },
    industry: {
        type: String,
        default: 'Other'
    },
    funding: {
        type: String,
        default: 'Bootstrapped'
    },
    remoteFriendly: {
        type: Boolean,
        default: false
    },
    gradient: {
        type: String,
        default: 'from-blue-500 to-indigo-600'
    },
    requirements: [{
        type: String
    }],
    culture: [{
        title: String,
        description: String
    }],
    cultureImages: [{
        type: String
    }],
    reviews: [{
        author: String,
        role: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
