const mongoose = require('mongoose');
const Application = require('./models/Application');
const dotenv = require('dotenv');

dotenv.config();

const checkApps = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Register models
        require('./models/User');
        require('./models/Job');

        const apps = await Application.find()
            .populate('user', 'name email github')
            .populate('job', 'title company location type');

        console.log(`Total applications in DB: ${apps.length}`);
        if (apps.length > 0) {
            console.log('Sample Application:');
            console.log(JSON.stringify(apps[0], null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkApps();
