const Company = require('../models/Company');
const Job = require('../models/Job');
const companiesData = require('../data/companiesSeedData');

/**
 * @desc    Seed database with companies and initial jobs
 * @route   POST /api/seed/db
 * @access  Public (for development)
 */
const seedDatabase = async (req, res) => {
    try {
        // Clear existing data (optional but recommended for a clean seed)
        await Company.deleteMany({});
        await Job.deleteMany({});

        console.log('Cleared existing companies and jobs.');

        const createdCompanies = await Company.insertMany(companiesData);
        console.log(`${createdCompanies.length} companies items seeded.`);

        // Create sample jobs for each company
        const jobsToCreate = [];
        const jobTitles = [
            'Senior Software Engineer',
            'Full Stack Developer',
            'Product Designer',
            'Product Manager',
            'Frontend Engineer',
            'Backend Engineer',
            'Marketing Lead',
            'Sales Executive',
            'HR Manager',
            'Financial Analyst',
            'DevOps Engineer',
            'Data Scientist',
            'Quality Assurance Engineer',
            'UI/UX Designer',
            'Content Writer',
            'Business Development Manager',
            'IT Support Specialist',
            'Cloud Architect',
            'Security Analyst',
            'Network Engineer',
            'Mobile App Developer'
        ];

        const salaries = ['$0-$50k', '$50k-$100k', '$100k-$150k', '$150k+'];
        const experiences = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];
        const types = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Fresher', 'Remote', 'WorkFromHome', 'WalkIn', 'MNC'];
        const locations = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Remote'];

        const categoryMap = {
            'Engineering': ['Senior Software Engineer', 'Full Stack Developer', 'Frontend Engineer', 'Backend Engineer', 'Mobile App Developer'],
            'Design': ['Product Designer', 'UI/UX Designer', 'Graphic Designer', 'Brand Designer'],
            'Marketing': ['Marketing Lead', 'Content Writer', 'SEO Specialist', 'Social Media Manager'],
            'Finance': ['Financial Analyst', 'Accountant', 'Investment Banker', 'Tax Consultant'],
            'Data Science': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'BI Developer'],
            'Product Management': ['Product Manager', 'Associate Product Manager', 'Product Owner'],
            'DevOps': ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer'],
            'HR': ['HR Manager', 'Technical Recruiter', 'People Operations'],
            'Sales': ['Sales Executive', 'Business Development Manager', 'Account Executive'],
            'IT': ['IT Support Specialist', 'Network Engineer', 'Security Analyst', 'Systems Administrator']
        };

        const allCategories = Object.keys(categoryMap);

        createdCompanies.forEach(company => {
            // Add 4-8 jobs per company for a dense database
            const numJobs = Math.floor(Math.random() * 5) + 4;
            for (let i = 0; i < numJobs; i++) {
                // Pick a random category
                const category = allCategories[Math.floor(Math.random() * allCategories.length)];
                // Pick a random title from that category
                const titles = categoryMap[category];
                const title = titles[Math.floor(Math.random() * titles.length)];

                jobsToCreate.push({
                    title,
                    company: company.name,
                    location: locations[Math.floor(Math.random() * locations.length)],
                    type: types[Math.floor(Math.random() * types.length)],
                    salary: salaries[Math.floor(Math.random() * salaries.length)],
                    experience: experiences[Math.floor(Math.random() * experiences.length)],
                    description: `Join ${company.name} as a ${title}. We are looking for talented individuals to help us build the future of ${company.industry}.`,
                    category,
                    icon: company.icon || 'developer_mode',
                    logoBg: 'bg-white',
                    logoColor: 'text-black',
                });
            }
        });

        const createdJobs = await Job.insertMany(jobsToCreate);
        console.log(`${createdJobs.length} jobs items seeded.`);

        // Update company job counts
        for (const company of createdCompanies) {
            const count = createdJobs.filter(j => j.company === company.name).length;
            await Company.findByIdAndUpdate(company._id, { jobs: count });
        }

        res.status(201).json({
            success: true,
            message: 'Database seeded successfully',
            companiesCount: createdCompanies.length,
            jobsCount: createdJobs.length
        });
    } catch (error) {
        console.error('Seeding failed:', error);
        res.status(500).json({
            success: false,
            message: 'Seeding failed',
            error: error.message
        });
    }
};

module.exports = {
    seedDatabase
};
