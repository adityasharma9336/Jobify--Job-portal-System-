import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);
        navigate(`/jobs?${params.toString()}`);
    };

    return (
        <section className="flex flex-col items-center justify-center pt-10 pb-6 text-center relative z-10 w-full max-w-7xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                <span className="block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">Over 10,000 new jobs added today</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 drop-shadow-2xl">
                Find your next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-primary">jobify-grade</span> opportunity.
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mb-12 font-light">
                Explore thousands of high-paying remote and on-site jobs in tech, design, engineering, and finance on the premier glassmorphic network.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-4xl glass-panel p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <div className="flex-1 flex items-center h-14 px-4 gap-3 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-auto">
                    <span className="material-symbols-outlined text-primary text-2xl">search</span>
                    <input
                        className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full focus:ring-0 text-base h-full"
                        placeholder="Job title, keywords, or company"
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                <div className="flex-1 flex items-center h-14 px-4 gap-3 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-auto">
                    <span className="material-symbols-outlined text-gray-400 text-2xl">location_on</span>
                    <input
                        className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full focus:ring-0 text-base h-full"
                        placeholder="City, state, or remote"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                <button
                    onClick={handleSearch}
                    className="h-14 px-8 rounded-xl bg-primary hover:bg-purple-600 text-white font-bold text-lg shadow-lg transition-all w-full md:w-auto whitespace-nowrap"
                >
                    Search Jobs
                </button>
            </div>
        </section>
    );
};

export default HeroSection;
