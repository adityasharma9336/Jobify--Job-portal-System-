const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['Technical', 'HR', 'Behavioral', 'Final'], required: true },
    location: { type: String, required: false }, // Store meeting link or physical address
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'], default: 'Scheduled' },
    interviewer: {
        name: String,
        role: String,
        avatar: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
