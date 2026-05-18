const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');

dotenv.config();

const User = require('./models/User');

const seedJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected via script');

        // Fetch users to assign as posters
        const users = await User.find({});
        if (users.length === 0) {
            console.error('No users found. Run seedUsers.js first.');
            process.exit(1);
        }

        const employers = users.filter(u => u.userType === 'employer' || u.userType === 'admin');
        const fallbackUser = users[0]; // Fallback if no employers

        await Job.deleteMany({});
        console.log('Old jobs removed');

        const jobs = [
            // Tech Giants
            {
                title: 'Senior Frontend Engineer',
                company: 'Google',
                location: 'Mountain View, CA (Hybrid)',
                type: 'Full-time',
                salary: '$180k - $240k',
                icon: 'search',
                logoBg: 'bg-white',
                logoColor: 'text-red-500',
                description: 'Join the Chrome team to build the next generation of web experiences. We are looking for an expert in React, performance optimization, and modern web standards. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Product Designer',
                company: 'Airbnb',
                location: 'San Francisco, CA',
                type: 'Full-time',
                salary: '$160k - $210k',
                icon: 'house',
                logoBg: 'bg-[#FF5A5F]',
                logoColor: 'text-white',
                description: 'Design intuitive and beautiful experiences for millions of hosts and guests worldwide. Strong portfolio demonstrating systems thinking required. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
            },
            {
                title: 'Machine Learning Engineer',
                company: 'OpenAI',
                location: 'San Francisco, CA',
                type: 'Full-time',
                salary: '$200k - $350k',
                icon: 'smart_toy',
                logoBg: 'bg-black',
                logoColor: 'text-white',
                description: 'Work on cutting-edge generative models. Verification of large-scale distributed training systems knowledge is a must. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },

            // Startups / Remote
            {
                title: 'Head of Growth',
                company: 'Linear',
                location: 'Remote (Global)',
                type: 'Full-time',
                salary: '$140k - $200k + Equity',
                icon: 'trending_up',
                logoBg: 'bg-[#5E6AD2]',
                logoColor: 'text-white',
                description: 'Drive user acquisition and retention for the tool builders love. You will lead marketing strategies and experimentation. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Staff Backend Engineer (Rust)',
                company: 'Discord',
                location: 'Remote (US)',
                type: 'Full-time',
                salary: '$190k - $230k',
                icon: 'chat_bubble',
                logoBg: 'bg-[#5865F2]',
                logoColor: 'text-white',
                description: 'Scale our real-time communication infrastructure. Deep knowledge of Rust and distributed systems is required. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
            },

            // Enterprise / Finance
            {
                title: 'Cloud Architect',
                company: 'JPMorgan Chase',
                location: 'New York, NY',
                type: 'Contract',
                salary: '$120 - $160 / hr',
                icon: 'cloud',
                logoBg: 'bg-[#117ACA]',
                logoColor: 'text-white',
                description: 'Architect secure and scalable cloud solutions for our financial data systems. AWS and Azure certification preferred. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Data Scientist',
                company: 'Spotify',
                location: 'Stockholm, Sweden',
                type: 'Full-time',
                salary: '€80k - €110k',
                icon: 'headphones',
                logoBg: 'bg-[#1DB954]',
                logoColor: 'text-white',
                description: 'Unlock insights from petitioner data to personalize listening experiences. Proficiency in Python and SQL required. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
            },

            // Design / Creative
            {
                title: 'Creative Director',
                company: 'Pentagram',
                location: 'London, UK',
                type: 'Full-time',
                salary: '£90k - £130k',
                icon: 'palette',
                logoBg: 'bg-[#DA0018]',
                logoColor: 'text-white',
                description: 'Lead branding projects for world-class clients. A visionary eye for typography and layout is essential. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                title: '3D Artist',
                company: 'Blender Foundation',
                location: 'Amsterdam, NL',
                type: 'Part-time',
                salary: '€40k - €60k',
                icon: 'view_in_ar',
                logoBg: 'bg-[#EA7600]',
                logoColor: 'text-white',
                description: 'Create demo assets and tutorials for the open-source community. Mastery of Blender geometry nodes is a plus. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },

            // More Tech
            {
                title: 'Developer Advocate',
                company: 'Vercel',
                location: 'Remote',
                type: 'Full-time',
                salary: '$130k - $170k',
                icon: 'code',
                logoBg: 'bg-black',
                logoColor: 'text-white',
                description: 'Bridge the gap between our product and the developer community. Create content, speak at conferences, and gather feedback. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
            },
            {
                title: 'Security Engineer',
                company: 'CrowdStrike',
                location: 'Austin, TX',
                type: 'Full-time',
                salary: '$150k - $200k',
                icon: 'shield',
                logoBg: 'bg-[#FC0000]',
                logoColor: 'text-white',
                description: 'Defend against cyber threats. Experience with threat intelligence and malware analysis is required. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
            },
            {
                title: 'iOS Engineer',
                company: 'Apple',
                location: 'Cupertino, CA',
                type: 'Full-time',
                salary: '$170k - $250k',
                icon: 'phone_iphone',
                logoBg: 'bg-gray-800',
                logoColor: 'text-white',
                description: 'Build the next version of iOS. Swift and Objective-C expertise needed. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment. You will be working with cross-functional teams to deliver high-quality results. We offer competitive benefits, flexible working hours, and opportunities for continuous learning and growth. If you are passionate about making an impact and pushing the boundaries of what is possible, we would love to hear from you. Your day-to-day will involve architectural decisions, code reviews, and mentoring junior staff.',
                postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            }
        ];

        // Assign random employer to each job
        const jobsWithPosters = jobs.map(job => {
            const randomPoster = employers.length > 0
                ? employers[Math.floor(Math.random() * employers.length)]
                : fallbackUser;
            return { ...job, postedBy: randomPoster._id };
        });

        await Job.insertMany(jobsWithPosters);
        console.log('Jobs seeded successfully with posters');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedJobs();
