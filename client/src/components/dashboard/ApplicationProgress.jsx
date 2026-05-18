import React from 'react';
import { motion } from 'framer-motion';

const ApplicationProgress = ({ stats, completion = 0 }) => {
    const circumference = 251.2;
    const offset = circumference - (completion / 100) * circumference;

    return (
        <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl text-primary">donut_large</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    Application Progress
                </h3>
                <div className="flex flex-col items-center justify-center relative py-4">
                    <div className="relative size-40">
                        <svg className="size-full" viewBox="0 0 100 100">
                            <circle className="text-white/10 stroke-current text-opacity-10" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
                            <motion.circle
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="text-primary progress-ring__circle stroke-current drop-shadow-[0_0_10px_rgba(140,43,238,0.5)]"
                                cx="50" cy="50" fill="transparent" r="40"
                                strokeDasharray={circumference}
                                strokeLinecap="round" strokeWidth="8"
                            ></motion.circle>
                        </svg>
                        <div className="absolute top-0 left-0 size-full flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">{completion}%</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wide">Profile</span>
                        </div>
                    </div>
                    <p className="text-center text-gray-400 mt-4 text-sm px-4">
                        {completion < 100
                            ? "Complete your portfolio to boost visibility by 2x."
                            : "Your profile is complete! You're ready for top companies."}
                    </p>
                    {completion < 100 && (
                        <a href="/profile" className="mt-4 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-primary text-xs font-bold border border-primary/20 transition-all">Complete Profile</a>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl flex flex-col justify-center items-center text-center hover:bg-white/[0.07] transition-all">
                    <span className="text-2xl font-bold text-white mb-1">{stats?.total || 0}</span>
                    <span className="text-xs text-gray-400">Applied</span>
                </div>
                <div className="glass-panel p-4 rounded-xl flex flex-col justify-center items-center text-center hover:bg-white/[0.07] transition-all">
                    <span className="text-2xl font-bold text-white mb-1">{stats?.interviewing || 0}</span>
                    <span className="text-xs text-gray-400">Interviews</span>
                </div>
            </div>
        </div>
    );
};

export default ApplicationProgress;
