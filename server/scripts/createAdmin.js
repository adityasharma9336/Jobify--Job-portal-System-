const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: '../.env' }); // Adjust path if needed

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminEmail = 'admin@jobify.com';
        const adminPassword = 'password123';

        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin user already exists');
            console.log(`Email: ${adminEmail}`);
            console.log('If you do not know the password, you may need to delete this user manually or update the script to reset it.');
        } else {
            const user = await User.create({
                name: 'Jobify Admin',
                email: adminEmail,
                password: adminPassword,
                userType: 'admin'
            });
            console.log('Admin user created successfully');
            console.log(`Email: ${user.email}`);
            console.log(`Password: ${adminPassword}`);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
