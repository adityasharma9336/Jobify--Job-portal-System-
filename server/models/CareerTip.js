const mongoose = require('mongoose');

const careerTipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Interview', 'Resume', 'Networking', 'Career Growth', 'Other'],
        default: 'Other'
    },
    readTime: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true // Can contain full article HTML or Markdown
    },
    videoUrl: {
        type: String, // Optional YouTube or external video URL
        required: false
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CareerTip', careerTipSchema);
