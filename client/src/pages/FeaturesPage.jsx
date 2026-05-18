import React from 'react';

const FeaturesPage = () => {
    const features = [
        { title: 'AI Resume Builder', icon: 'description', desc: 'Create professional resumes in minutes with our AI-powered tool.' },
        { title: 'Smart Job Matching', icon: 'auto_awesome', desc: 'Get personalized job recommendations based on your skills and experience.' },
        { title: 'Direct Chat', icon: 'chat', desc: 'Connect directly with recruiters and hiring managers.' },
        { title: 'Career Coaching', icon: 'psychology', desc: 'Access expert career tips and guidance to accelerate your growth.' },
        { title: 'Interview Scheduler', icon: 'event', desc: 'Manage and schedule interviews with ease.' },
        { title: 'Company Insights', icon: 'apartment', desc: 'Get detailed reviews and tech stack information for thousands of companies.' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Platform <span className="text-primary">Features</span></h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">Discover the tools and features designed to help you land your dream job or find the perfect talent.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
                        <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-primary text-3xl">{feature.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesPage;
