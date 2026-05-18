import React from 'react';
import { motion } from 'framer-motion';

const PlatformFeatures = () => {
    const features = [
        { title: 'AI Resume Builder', icon: 'description', desc: 'Create professional resumes in minutes with our AI-powered tool.' },
        { title: 'Smart Job Matching', icon: 'auto_awesome', desc: 'Get personalized job recommendations based on your skills and experience.' },
        { title: 'Direct Chat', icon: 'chat', desc: 'Connect directly with recruiters and hiring managers.' },
        { title: 'Career Coaching', icon: 'psychology', desc: 'Access expert career tips and guidance to accelerate your growth.' },
        { title: 'Interview Scheduler', icon: 'event', desc: 'Manage and schedule interviews with ease.' },
        { title: 'Company Insights', icon: 'apartment', desc: 'Get detailed reviews and tech stack information for thousands of companies.' }
    ];

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Platform <span className="text-primary">Features</span></h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Discover the tools and features designed to help you land your dream job or find the perfect talent.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group"
                    >
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-primary text-2xl">{feature.icon}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default PlatformFeatures;
