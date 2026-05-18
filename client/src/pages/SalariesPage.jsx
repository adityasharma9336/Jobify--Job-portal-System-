import React from 'react';
import { motion } from 'framer-motion';

const salaryData = [
    { role: "Senior Software Engineer", min: 140, max: 220, median: 175, trend: "+12%" },
    { role: "Product Manager", min: 110, max: 190, median: 145, trend: "+8%" },
    { role: "UX/UI Designer", min: 90, max: 150, median: 115, trend: "+5%" },
    { role: "Data Scientist", min: 130, max: 210, median: 165, trend: "+15%" },
    { role: "DevOps Engineer", min: 120, max: 180, median: 140, trend: "+10%" },
    { role: "Frontend Developer", min: 85, max: 145, median: 110, trend: "+6%" },
];

const SalariesPage = () => {
    return (
        <div className="min-h-screen bg-jobify text-white font-display relative overflow-hidden">
            {/* Background Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
                <div className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="flex flex-col gap-4 mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black tracking-tight text-white"
                    >
                        Salary Insights
                    </motion.h1>
                    <p className="text-gray-400 text-lg">
                        Real-time salary data to help you negotiate your worth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {salaryData.map((item, index) => (
                        <motion.div
                            key={item.role}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-6 rounded-2xl hover:border-primary/30 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">{item.role}</h3>
                                <span className="text-green-400 text-sm font-bold bg-green-400/10 px-2 py-1 rounded">{item.trend}</span>
                            </div>

                            <div className="mb-6">
                                <div className="text-3xl font-black text-white">${item.median}k</div>
                                <div className="text-sm text-gray-500">Median Base Salary</div>
                            </div>

                            <div className="relative pt-6 border-t border-white/5">
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                    <span>${item.min}k</span>
                                    <span>${item.max}k</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"
                                        style={{ width: `${((item.median - item.min) / (item.max - item.min)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default SalariesPage;
