const mongoose = require('mongoose');
const Job = require('./models/Job');
const dotenv = require('dotenv');

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobify');
        console.log('Connected to MongoDB');

        const totalJobs = await Job.countDocuments();
        console.log(`Total jobs in DB: ${totalJobs}`);

        const categories = ['Engineering', 'Design', 'Marketing', 'Finance', 'Data Science', 'Product Management', 'DevOps', 'HR', 'Sales', 'IT'];

        console.log('\nJobs per Category:');
        for (const cat of categories) {
            const count = await Job.countDocuments({ category: cat });
            console.log(`${cat}: ${count}`);
        }

        const types = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Fresher', 'MNC', 'Remote', 'WorkFromHome', 'WalkIn'];
        console.log('\nJobs per Type:');
        for (const t of types) {
            const count = await Job.countDocuments({ type: t });
            console.log(`${t}: ${count}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
