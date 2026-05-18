import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Link } from 'react-router-dom';

const SavedJobsPage = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/users/saved-jobs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setSavedJobs(data);
                }
            } catch (error) {
                console.error("Error fetching saved jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, []);

    const handleUnsave = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/saved-jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ jobId })
            });
            if (res.ok) {
                setSavedJobs(prev => prev.filter(job => job._id !== jobId));
            }
        } catch (error) {
            console.error("Error unsaving job:", error);
        }
    };

    return (
        <div className="bg-jobify text-white font-display min-h-screen flex overflow-hidden relative">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
            </div>

            <main className="flex-1 px-6 lg:px-10 pt-8 lg:pt-12 pb-6 lg:pb-10 h-screen overflow-y-auto relative z-10 custom-scrollbar">
                <DashboardHeader />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto"
                >
                    <h1 className="text-2xl font-bold mb-8">Saved Jobs</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full text-center py-20 text-gray-400">Loading saved jobs...</div>
                        ) : savedJobs.length === 0 ? (
                            <div className="col-span-full text-center py-20 glass-panel rounded-2xl">
                                <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">bookmark_border</span>
                                <p className="text-gray-400 text-lg mb-6">You haven't saved any jobs yet.</p>
                                <Link to="/jobs" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/80 font-bold transition-all">
                                    Browse Jobs
                                </Link>
                            </div>
                        ) : (
                            savedJobs.map((job) => (
                                <div key={job._id} className="glass-panel p-6 rounded-2xl flex flex-col group hover:bg-white/[0.07] transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`size-12 rounded-xl ${job.logoBg || 'bg-indigo-600'} flex items-center justify-center text-white shadow-lg`}>
                                            <span className={`material-symbols-outlined ${job.logoColor || 'text-white'}`}>{job.icon || 'work'}</span>
                                        </div>
                                        <button
                                            onClick={() => handleUnsave(job._id)}
                                            className="size-8 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 flex items-center justify-center transition-colors"
                                            title="Remove from saved"
                                        >
                                            <span className="material-symbols-outlined text-sm">bookmark_remove</span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{job.company} • {job.location}</p>

                                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-sm font-bold text-green-400">{job.salary}</span>
                                        <Link to={`/jobs?selectedJobId=${job._id}`} className="text-xs font-bold text-primary hover:text-white transition-colors">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default SavedJobsPage;
