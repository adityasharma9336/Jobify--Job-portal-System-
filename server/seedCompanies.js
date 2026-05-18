const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./models/Company');

dotenv.config();

const seedCompanies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected via script');

        await Company.deleteMany({});
        console.log('Old companies removed');

        const companies = [
            {
                name: "TechNova Solutions",
                description: "Innovating the future of cloud computing and decentralized AI architecture for the enterprise sector.",
                icon: "hub",
                gradient: "from-indigo-500 to-purple-600",
                rating: 4.9,
                jobs: 12,
                location: "San Francisco, CA"
            },
            {
                name: "Lumina Global",
                description: "A world-class leader in renewable energy logistics and smart grid optimization technologies.",
                icon: "eco",
                gradient: "from-cyan-500 to-blue-600",
                rating: 4.7,
                jobs: 8,
                location: "London, UK"
            },
            {
                name: "Quantum Flow",
                description: "Building next-gen financial infrastructure for the digital asset economy and global trade.",
                icon: "token",
                gradient: "from-rose-500 to-orange-500",
                rating: 4.8,
                jobs: 5,
                location: "Remote"
            },
            {
                name: "Jobify Labs",
                description: "Pioneering deep-tech research and development in quantum hardware and material sciences.",
                icon: "science",
                gradient: "from-emerald-500 to-teal-600",
                rating: 4.9,
                jobs: 22,
                location: "Berlin, DE"
            },
            {
                name: "Aether Systems",
                description: "Seamless connectivity and mesh networking solutions for the modern hyper-connected enterprise.",
                icon: "cloud_done",
                gradient: "from-fuchsia-500 to-purple-500",
                rating: 4.2,
                jobs: 15,
                location: "Austin, TX"
            },
            {
                name: "Nebula Dynamics",
                description: "Transforming space exploration data through advanced machine learning and predictive modeling.",
                icon: "rocket_launch",
                gradient: "from-violet-600 to-indigo-800",
                rating: 4.6,
                jobs: 3,
                location: "Seattle, WA"
            }
        ];

        await Company.insertMany(companies);
        console.log('Companies seeded successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedCompanies();
