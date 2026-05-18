const mongoose = require('mongoose');
const Application = require('./models/Application');
const Job = require('./models/Job');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const apps = await Application.find();
        console.log(`Total applications before cleanup: ${apps.length}`);

        let deletedCount = 0;
        for (const app of apps) {
            const jobExists = await Job.findById(app.job);
            const userExists = await User.findById(app.user);

            if (!jobExists || !userExists) {
                await Application.findByIdAndDelete(app._id);
                deletedCount++;
            }
        }

        console.log(`Deleted ${deletedCount} orphaned applications.`);
        const remaining = await Application.countDocuments();
        console.log(`Remaining valid applications: ${remaining}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanup();
