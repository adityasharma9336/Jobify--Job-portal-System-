import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CompanyCard = ({ company, index }) => {
    return (
        <Link to={`/companies/${company._id}`} className="block h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="glass-panel p-6 rounded-2xl flex flex-col gap-4 hover:border-primary/40 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full"
            >
                <div className="flex justify-between items-start">
                    <div className={`size-16 rounded-xl ${company.logo ? 'bg-white border border-gray-100' : `bg-gradient-to-br ${company.gradient}`} p-2 flex items-center justify-center overflow-hidden shrink-0`}>
                        {/* Always prefer the real corporate logo */}
                        {company.logo ? (
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random&color=fff&size=128&bold=true`;
                                }}
                            />
                        ) : (
                            <span className="material-symbols-outlined text-white text-3xl">{company.icon}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        <span className="material-symbols-outlined text-sm text-yellow-400 fill-[1]">star</span>
                        <span className="text-xs font-bold text-white">{company.rating}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{company.name}</h3>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-3 leading-relaxed">{company.description}</p>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Active Jobs</span>
                        <span className="text-sm font-bold text-primary">{company.jobs} openings</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{company.location}</span>
                </div>
            </motion.div>
        </Link>
    );
};

export default CompanyCard;
