import React, { useEffect, useState } from 'react';
import { fetchJobs } from '../../api/jobs';
import { fetchCompanies } from '../../api/companies';
import { formatTimeAgo } from '../../utils/date';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleJobs, setVisibleJobs] = useState(6);
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    const [expandedJobId, setExpandedJobId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const [jobsData, companiesData] = await Promise.all([
                    fetchJobs({ limit: 10, sort: 'newest' }),
                    fetchCompanies()
                ]);

                // Map company logos to jobs
                const jobsWithLogos = jobsData.map(job => {
                    const company = companiesData.find(c => c.name === job.company);
                    return {
                        ...job,
                        companyLogo: company?.logo || null,
                        companyIcon: company?.icon || job.icon || 'domain'
                    };
                });

                setJobs(jobsWithLogos);
                fetchSavedJobIds();
            } catch (error) {
                console.error("Failed to load jobs", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchSavedJobIds = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('/api/users/saved-jobs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSavedJobIds(new Set(data.map(job => job._id)));
                }
            } catch (error) {
                console.error("Error fetching saved job IDs:", error);
            }
        };

        loadJobs();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 120 }
        }
    };

    const toggleSave = async (jobId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('/api/users/saved-jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ jobId })
            });
            if (res.ok) {
                const data = await res.json();
                setSavedJobIds(prev => {
                    const next = new Set(prev);
                    if (data.saved) next.add(jobId);
                    else next.delete(jobId);
                    return next;
                });
            }
        } catch (error) {
            console.error("Error toggling save:", error);
        }
    };

    const handleLoadMore = () => {
        setVisibleJobs(prev => prev + 4);
    };

    if (loading) {
        return <div className="text-center text-gray-400 py-20">Loading opportunities...</div>;
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-6 mt-16 mb-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Recent Openings
                </h2>
                <Link to="/jobs" className="text-sm text-primary hover:text-white transition-colors">View all jobs →</Link>
            </div>

            {jobs.length === 0 ? (
                <div className="text-gray-400 p-4 text-center">No recent openings found.</div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {jobs.slice(0, visibleJobs).map((job) => (
                        <motion.div
                            key={job._id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            layout
                            onClick={() => navigate(`/jobs?selectedJobId=${job._id}`)}
                            className="glass-panel p-5 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.07] transition-colors group border-l-4 border-l-transparent hover:border-l-primary cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`size-14 rounded-xl ${job.logoBg || 'bg-white'} flex items-center justify-center shrink-0 overflow-hidden shadow-lg`}>
                                    {job.companyLogo && job.companyLogo !== '#' ? (
                                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className={`material-symbols-outlined ${job.logoColor || 'text-black'} text-3xl`}>{job.companyIcon}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-tight">{job.title}</h3>
                                            <p className="text-sm text-primary font-medium mt-1">{job.company}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSave(job._id);
                                            }}
                                            className={`size-9 rounded-lg flex items-center justify-center transition-all shrink-0 ${savedJobIds.has(job._id)
                                                ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            <span className={`material-symbols-outlined text-[22px] ${savedJobIds.has(job._id) ? 'fill-1' : ''}`}>bookmark</span>
                                        </button>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-4 mt-4">
                                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                            <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                            <span className="material-symbols-outlined text-[18px] text-secondary">work</span>
                                            {job.type}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-green-400 text-sm font-bold">
                                            <span className="material-symbols-outlined text-[18px]">payments</span>
                                            {job.salary}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span> {formatTimeAgo(job.postedAt)}
                                </span>
                                <div className="flex items-center gap-1 text-primary text-sm font-bold group-hover:translate-x-1 transition-transform">
                                    View Details <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {visibleJobs < jobs.length && (
                <div className="mt-12 text-center">
                    <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
                    >
                        Load More Jobs
                    </button>
                </div>
            )}
        </section>
    );
};

export default FeaturedJobs;
