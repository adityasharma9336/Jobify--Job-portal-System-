const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('../models/Company');

dotenv.config();

const companies = [
    {
        name: "Nebula Innovations",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlWdDJhu8Z7s0oQ6J-ddKtOFNhjzI1iKmfZsQ2Fdo4qW8ilrODXrw7llHo_glyOfUA8I7sSPOXRZrxSahvroTIb4jy4YsWNCPESpUBehrC2hlSikvxmDfI9pVubWcQ-YE-l9-miJULeXz-1BO0DGt7dqisE2rMg1MXjAvNlVvR3SX9toFsP1aMzn_xPJP3yo2Nm_fiTJbiVp8OpwEz3Pb_PYV6EXBZqFtrweX_WVavTnoKO6QdEseyW83rVrzin-2Ih-U1qWDY68s",
        location: "San Francisco, CA",
        industry: "Cloud Computing",
        description: "Nebula Innovations is redefining the boundaries of what's possible in cloud infrastructure. We believe that the future of technology lies in transparency and community-driven development.",
        foundedYear: "2018",
        companySize: "201-500 Employees",
        headquarters: "San Francisco, CA",
        website: "nebula.io",
        techStack: ["React", "Node.js", "Python", "TensorFlow", "Kubernetes", "AWS", "Go"],
        rating: 4.8,
        openPositions: 12,
        icon: "cloud",
    },
    {
        name: "EcoSphere Solutions",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJSgjDn_CBN9rmsn54kDzn94ErUBXqJT038p_XAKEGhAWg9z-tQ_r8RvJpXKFafSL2J54uF_CvyW8fM4fGC6XhMd1j4vnpPnN2VChzDNpTPaNS7oLBAPaf2D1JAb_DwtPx_u0InixDSKgA27X6F8W_DCQcpABOhtIbjFLp-F8uO-XOa6Zio7gr_-bbzcLPb4ps-UcxbwLe9-mwKTmQ0PWARffbp8GNEb4_BmQ2t5v-_tTWDB7zjt-qP0HBSXSSFd8leeYdCPT8KQs",
        location: "Austin, TX",
        industry: "Green Tech",
        description: "Empowering a sustainable future through smart energy management systems and AI-driven environmental analytics.",
        foundedYear: "2020",
        companySize: "51-200 Employees",
        headquarters: "Austin, TX",
        website: "ecosphere.tech",
        techStack: ["Vue.js", "Django", "PostgreSQL", "Docker", "Terraform"],
        rating: 4.6,
        openPositions: 8,
        icon: "eco",
    },
    {
        name: "Quantum Leap Financial",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPzpjmDktcbPT-QRl5j6m-NGr24vA7NLiEJ80sYBxk7QEDvnaNtD70XxrHJJahEaYtogdyuc6TAquftDRkqXAz4iQXvY84FCaXKqY9YTq1k3lLUZeWCyYCyMDiARJ647biBY_sYQlKTL7kpivrlMbr3VQg-tUZWhQ_KuQfJQ1x_5STAt3Vw3wfnEsQHFTNyVdnVr3vwNRrPUbQMBNT7kuKRNI2vSNHI8Ekrp6FnzJJC4rkNcP8tX88ag9c6MXWYH-thf8oF2DPQY4",
        location: "New York, NY",
        industry: "FinTech",
        description: "Revolutionizing high-frequency trading with quantum computing algorithms and blockchain security.",
        foundedYear: "2019",
        companySize: "501-1000 Employees",
        headquarters: "New York, NY",
        website: "quantumleap.fi",
        techStack: ["Angular", "Java", "Spring Boot", "Cassandra", "Kafka"],
        rating: 4.9,
        openPositions: 24,
        icon: "trending_up",
    },
    {
        name: "Pixel Perfect Studios",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbP8B0PHelRwWC80dFqJ2Y1c8891WEDzfRf3Xk_XtFPNxRMNguBuehunHnPGOJmTvpwJxC9oVmkqlYX353Mc4DVUFdp40dBZ1CUWQYu0qmUIezo8Xderw5f88r2F-hBevc4tXNRYt24CYddY4sIn9eeORI8OoJHrx0gfF3MGTlnO2LbCDVJaLjN9WyRxzwykDQYmJ8LeLF1jFiY9nHmDTBhChLpnEH9sDFLP_Va7v4nLeZ4b6Zko9jlyDe8k4wooclxe0Vr66QYKM",
        location: "Los Angeles, CA",
        industry: "Gaming",
        description: "Creating immersive open-world experiences that blur the line between reality and digital entertainment.",
        foundedYear: "2015",
        companySize: "1000+ Employees",
        headquarters: "Los Angeles, CA",
        website: "pixelperfect.games",
        techStack: ["C++", "Unreal Engine 5", "Python", "Maya", "Blender"],
        rating: 4.7,
        openPositions: 15,
        icon: "sports_esports",
    },
    {
        name: "CyberGuard Defense",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtBZK7n8L0RhF4_wZrXyVgjwgwkWl7VjR-NMPeMZQdUWIjuHNGNtCoO0G_Oohf6chxOFGAL5qvbnBu3bNhAepC6YX605g1uXDazuJxe70hFXN-P95nwIiC4LODH5J77SQLtwF_fav1b_Jwgn4BsyX3pUf18SipkFWOylmwPNtKJ24qQFyMilinLZV8QPSth_N0s58IiaER-sX87vG3h-JOMB2yiUrbxoobC66ksJ9dw6KNaQFASVC6unNbIYlaLAH7eG3qfIc-H84",
        location: "Tel Aviv, Israel",
        industry: "Cybersecurity",
        description: "Next-generation threat detection and neutralization using autonomous AI agents.",
        foundedYear: "2021",
        companySize: "51-200 Employees",
        headquarters: "Tel Aviv, Israel",
        website: "cyberguard.ai",
        techStack: ["Rust", "Python", "C#", "Azure", "Elasticsearch"],
        rating: 4.5,
        openPositions: 6,
        icon: "security",
    },
    {
        name: "Vitality Health Systems",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5-0QiKMO6G9We9JGxZpHZ5EHkd3R-wjPFJckpMqJr_7Iz6Sofmx501BI1DLUXXpVPgWD_ir0nHJ8Rk_5uWhhrI-j6bmd3BknYow5I2QPC8orH-12tyssXXj4EKR7Asx7CmN4q0GVzEE3xeUSpgjZrcu3kLdZIGabEZZLx7Jx643EUMeI_a6v7vFWlkr81HCU84BJpm42UyiE3_w_PWvv8w7pQ3oWRJPZXPeXdv2MpIPSvtPUYnx7682G5Y7XdLBIWm1LFceO8JEo",
        location: "Boston, MA",
        industry: "HealthTech",
        description: "Connecting patients with personalized care plans through wearable technology and real-time health monitoring.",
        foundedYear: "2017",
        companySize: "501-1000 Employees",
        headquarters: "Boston, MA",
        website: "vitality.health",
        techStack: ["Swift", "Kotlin", "Ruby on Rails", "Redis", "Google Cloud"],
        rating: 4.8,
        openPositions: 18,
        icon: "favorite",
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Clear existing companies
        await Company.deleteMany({});
        console.log('Cleared existing companies');

        // Insert new companies
        await Company.insertMany(companies);
        console.log(`Seeded ${companies.length} companies`);

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        mongoose.connection.close();
    });
