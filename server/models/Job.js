const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: false,
        default: 'Mid'
    },
    description: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: true,
        default: 'Other'
    },
    icon: {
        type: String, // Material symbol name
        required: true,
    },
    logoBg: {
        type: String, // Tailwind class for background color e.g. 'bg-white'
        required: false,
        default: 'bg-white'
    },
    logoColor: {
        type: String, // Tailwind class for text color e.g. 'text-black'
        required: false,
        default: 'text-black'
    },
    companyLogo: {
        type: String,
        required: false,
        default: ''
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for now to avoid breaking existing data
    }
}, {
    timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
