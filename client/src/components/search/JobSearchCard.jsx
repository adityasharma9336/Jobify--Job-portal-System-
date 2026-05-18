import React from 'react';
import { formatTimeAgo } from '../../utils/date';

const JobSearchCard = ({ job, isSelected, isSaved, onClick, onToggleSave }) => {
    return (
        <div
            onClick={onClick}
            className={`glass-card p-5 rounded-xl cursor-pointer transition-all group relative overflow-hidden mb-4 border
        ${isSelected
                    ? 'border-primary/50 bg-white/[0.08] shadow-[0_0_15px_rgba(219,39,119,0.15)]'
                    : 'border-white/5 hover:border-gray-600 hover:bg-white/[0.08]'
                }`}
        >
            {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
            )}
            <div className="flex gap-4 items-start relative z-10">
                <div className={`size-12 rounded-lg ${job.logoBg || 'bg-white'} flex items-center justify-center shrink-0 glow-logo overflow-hidden border border-gray-100`}>
                    {job.companyLogo && job.companyLogo !== '#' && job.companyLogo !== '' ? (
                        <img 
                            src={job.companyLogo} 
                            alt={job.company} 
                            className="w-full h-full object-contain p-1" 
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                    ) : null}
                    <span 
                        className={`material-symbols-outlined ${job.logoColor || 'text-black'} text-2xl`}
                        style={{ display: job.companyLogo && job.companyLogo !== '#' ? 'none' : 'block' }}
                    >
                        {job.icon}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors truncate">{job.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleSave();
                                }}
                                className={`size-8 rounded-lg flex items-center justify-center transition-all ${isSaved
                                    ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                title={isSaved ? "Remove from saved" : "Save Job"}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'fill-1' : ''}`}>bookmark</span>
                            </button>
                            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{formatTimeAgo(job.postedAt)}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-300 mt-0.5">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">{job.location}</span>
                        {job.type && <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">{job.type}</span>}
                        <span className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-medium">{job.salary}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearchCard;
