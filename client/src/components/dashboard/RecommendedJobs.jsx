import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '../../api/jobs';

const RecommendedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
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
        fetchSavedJobIds();
    }, []);

    useEffect(() => {
        const loadRecommendedJobs = async () => {
            try {
                // Fetch 3 jobs
                const data = await fetchJobs({ limit: 3, sort: 'newest' });
                setJobs(data);
            } catch (error) {
                console.error("Failed to load recommended jobs", error);
            } finally {
                setLoading(false);
            }
        };
        loadRecommendedJobs();
    }, []);

    const handleApply = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ jobId })
            });

            if (res.ok) {
                alert('Application submitted successfully!');
                // Optionally refresh stats or activity here if we had a global context or callback
                window.location.reload(); // Simple refresh to update dashboard stats
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to apply');
            }
        } catch (error) {
            console.error("Error applying:", error);
            alert('Something went wrong');
        }
    };

    const handleSave = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

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
            console.error("Error saving job:", error);
        }
    };

    // Helper to format salary
    const formatSalary = (salary) => {
        if (!salary) return 'Salary not specified';
        // Simple check if it's already formatted
        if (salary.includes('$') || salary.includes('k')) return salary;
        return `$${salary}`;
    };

    return (
        <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Recommended for You</h3>
                    <a href="/jobs" className="text-xs text-primary hover:text-white transition-colors">View All</a>
                </div>
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[500px]">
                    {loading ? (
                        <div className="text-center text-gray-500 py-10">Finding recommendations...</div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">No jobs found.</div>
                    ) : (
                        jobs.map((job) => (
                            <div
                                key={job._id}
                                onClick={() => navigate(`/jobs?selectedJobId=${job._id}`)}
                                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`size-10 rounded-lg ${job.logoBg || 'bg-indigo-600'} flex items-center justify-center text-white shadow-lg`}>
                                        <span className={`material-symbols-outlined ${job.logoColor || 'text-white'}`}>{job.icon || 'work'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-400 bg-black/30 px-2 py-1 rounded">{job.location?.includes('Remote') ? 'Remote' : (job.type || 'Full-time')}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSave(job._id);
                                            }}
                                            className={`size-8 rounded-lg flex items-center justify-center transition-all ${savedJobIds.has(job._id)
                                                ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                            title={savedJobIds.has(job._id) ? "Remove from saved" : "Save Job"}
                                        >
                                            <span className={`material-symbols-outlined text-[18px] ${savedJobIds.has(job._id) ? 'fill-1' : ''}`}>bookmark</span>
                                        </button>
                                    </div>
                                </div>
                                <h4 className="font-bold text-white group-hover:text-primary transition-colors">{job.title}</h4>
                                <p className="text-sm text-gray-400 mb-3">{job.company} • {job.location}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-bold text-green-400">{job.salary}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleApply(job._id);
                                        }}
                                        className="size-8 rounded-full bg-primary/20 hover:bg-primary flex items-center justify-center text-white transition-all"
                                        title="Quick Apply"
                                    >
                                        <span className="material-symbols-outlined text-sm">send</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendedJobs;
