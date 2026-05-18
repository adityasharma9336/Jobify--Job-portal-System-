const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./models/User');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        const fetch = require('node-fetch');
        const resJob = await fetch('http://localhost:8000/api/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Test', company: 'Test', location: 'Test', type: 'Full-time', salary: 'Test', description: 'Test', category: 'Engineering', icon: 'work', logoBg: 'bg-primary', logoColor: 'text-white'
            })
        });
        const text = await resJob.text();
        console.log('Status:', resJob.status);
        console.log('Body:', text);
        process.exit(0);
    } catch (e) {
        console.error("FATAL", e);
        process.exit(1);
    }
})();
