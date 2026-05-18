const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const debugJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobify');
        console.log('Connected to MongoDB');

        const jobs = await Job.find({}).populate('postedBy', 'name email userType');
        console.log(`Total jobs found: ${jobs.length}`);

        jobs.forEach((job, index) => {
            console.log(`\nJob ${index + 1}:`);
            console.log(`Title: ${job.title}`);
            console.log(`Company: ${job.company}`);
            console.log(`PostedBy: ${job.postedBy ? `${job.postedBy.name} (${job.postedBy.email}) [${job.postedBy.userType}]` : 'NULL'}`);
            console.log(`PostedBy ID: ${job.postedBy ? job.postedBy._id : 'N/A'}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugJobs();
