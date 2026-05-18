const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./models/Company');
const Job = require('./models/Job');
const companiesData = require('./data/companiesSeedData');

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobify');
        console.log('Connected to MongoDB');

        // Clear existing data
        await Company.deleteMany({});
        await Job.deleteMany({});
        console.log('Cleared existing companies and jobs');

        // Insert companies
        const createdCompanies = await Company.insertMany(companiesData);
        console.log(`${createdCompanies.length} companies inserted`);

        // Create sample jobs
        const jobTemplates = [
            'Software Engineer',
            'Full Stack Developer',
            'Product Designer',
            'Frontend Engineer',
            'Backend Engineer',
            'DevOps Engineer',
            'Data Scientist',
            'Mobile Developer',
            'Systems Architect'
        ];

        const jobsToInsert = [];
        createdCompanies.forEach(company => {
            const numJobs = Math.floor(Math.random() * 3) + 2; // 2-4 jobs per company
            for (let i = 0; i < numJobs; i++) {
                const title = jobTemplates[Math.floor(Math.random() * jobTemplates.length)];
                jobsToInsert.push({
                    title,
                    company: company.name,
                    location: company.location,
                    type: ['Full-time', 'Part-time', 'Contract'][Math.floor(Math.random() * 3)],
                    salary: `${Math.floor(Math.random() * 100) + 80}k - ${Math.floor(Math.random() * 100) + 180}k`,
                    description: `This is a sample job description for ${title} at ${company.name}. We are looking for passionate individuals who want to change the world in the ${company.industry} sector.`,
                    category: company.industry,
                    icon: company.icon || 'work',
                    logoBg: 'bg-white',
                    logoColor: 'text-black',
                });
            }
        });

        const createdJobs = await Job.insertMany(jobsToInsert);
        console.log(`${createdJobs.length} jobs inserted`);

        // Update company job counts
        for (const company of createdCompanies) {
            const count = createdJobs.filter(j => j.company === company.name).length;
            await Company.findByIdAndUpdate(company._id, { jobs: count });
        }
        console.log('Company job counts updated');

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
