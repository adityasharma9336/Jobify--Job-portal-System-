const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User'); // To associate the job

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Find an admin user to be the poster, or just the first user
    const user = await User.findOne({});
    
    const newJob = new Job({
      title: 'Junior Software Engineer',
      company: 'Jobify Inc.',
      location: 'Remote',
      type: 'Full-time',
      salary: '$0-$50k',
      description: 'An entry-level software engineering role focusing on full-stack development using React and Node.js. Great opportunity to learn and grow within the Jobify ecosystem.',
      category: 'Engineering',
      experience: 'Entry',
      icon: 'code',
      logoBg: 'bg-primary/20',
      logoColor: 'text-primary',
      postedBy: user ? user._id : new mongoose.Types.ObjectId(),
      postedAt: new Date() // right now, so it falls in Last 24h
    });

    await newJob.save();
    console.log('Test job successfully added!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
