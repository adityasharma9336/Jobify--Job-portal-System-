const mongoose = require('mongoose');
require('dotenv').config();

const { createJob } = require('./controllers/jobController');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected");

        const req = {
            body: {
                title: 'Test Job',
                company: 'Tech Innovators',
                location: 'Remote',
                type: 'Full-time',
                salary: '$120k',
                description: 'Test description',
                category: 'Engineering',
                icon: 'work',
                logoBg: 'bg-primary',
                logoColor: 'text-white'
            },
            user: { _id: new mongoose.Types.ObjectId() }
        };

        const res = {
            status: (code) => {
                console.log("Status:", code);
                return res;
            },
            json: (data) => {
                console.log("JSON:", data);
                process.exit(code === 201 ? 0 : 1);
            }
        };

        await createJob(req, res);

    } catch (e) {
        console.error("FATAL", e);
        process.exit(1);
    }
})();
