import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Link } from 'react-router-dom';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/applications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setApplications(data);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'applied': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'viewed': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'interviewing': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'offer': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const stats = {
        total: applications.length,
        interviewing: applications.filter(a => a.status === 'interviewing').length,
        offers: applications.filter(a => a.status === 'offer').length,
        rejected: applications.filter(a => a.status === 'rejected').length
    };

    const filteredApplications = applications.filter(app => filter === 'all' || app.status === filter);

    const STAGES = ['applied', 'viewed', 'interviewing', 'offer'];

    const ApplicationCard = ({ app }) => {
        // Determine progress stage
        let activeIndex = STAGES.indexOf(app.status);
        let isRejected = false;
        if (app.status === 'rejected') {
            isRejected = true;
            activeIndex = 1; // It reached viewed maybe, but stops. Let's just grey out everything past applied.
        }

        return (
            <div className="glass-panel hover:border-primary/40 transition-all rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 flex flex-col md:flex-row gap-6">
                        {/* Company Logo or Fallback */}
                        <div className={`size-20 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5 ${app.job?.logoBg || 'bg-slate-800'}`}>
                            {app.job?.logo ? (
                                <img src={app.job.logo} alt={app.company} className="w-full h-full object-cover" />
                            ) : (
                                <span className={`text-3xl font-black ${app.job?.logoColor || 'text-white'}`}>{app.company.charAt(0)}</span>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                                    {app.status}
                                </span>
                                <span className="text-gray-400 text-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1">{app.job?.title || 'Unknown Position'}</h2>
                            <p className="text-gray-400 font-medium">{app.company} • {app.job?.location}</p>

                            {/* Progress bar */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between relative">
                                    {/* Connecting Line */}
                                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -z-10 -translate-y-1/2"></div>
                                    <div
                                        className={`absolute top-1/2 left-0 h-[2px] -z-10 -translate-y-1/2 transition-all duration-500
                                            ${isRejected ? 'bg-red-500/50' : 'bg-primary'}`}
                                        style={{ width: `${Math.max(0, activeIndex) * (100 / (STAGES.length - 1))}%` }}
                                    ></div>

                                    {STAGES.map((stage, idx) => {
                                        let dotClass = "bg-jobify border-white/20";
                                        let textClass = "text-gray-500";

                                        if (isRejected) {
                                            if (idx <= activeIndex) {
                                                dotClass = "bg-red-500 border-red-500";
                                                textClass = "text-red-400 font-bold";
                                            }
                                        } else if (idx <= activeIndex) {
                                            dotClass = "bg-primary border-primary shadow-[0_0_10px_rgba(140,43,238,0.5)]";
                                            textClass = "text-primary font-bold";
                                        }

                                        return (
                                            <div key={stage} className="flex flex-col items-center gap-2">
                                                <div className={`size-4 rounded-full border-2 ${dotClass} transition-colors duration-300`}></div>
                                                <span className={`text-[10px] uppercase tracking-wider ${textClass}`}>{stage}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Column */}
                    <div className="flex flex-col items-center flex-shrink-0 md:items-end justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8 gap-3 min-w-[140px]">
                        {app.status === 'interviewing' && (
                            <Link to="/interviews" className="w-full bg-primary/20 text-primary border border-primary/30 py-2 px-4 rounded-lg font-bold text-sm hover:bg-primary hover:text-white transition-all text-center">
                                View Interview
                            </Link>
                        )}
                        <Link to={`/jobs?selectedJobId=${app.job?._id}`} className="w-full bg-white/5 text-white py-2 px-4 rounded-lg font-bold text-sm hover:bg-white/10 transition-all text-center">
                            View Job Def
                        </Link>
                    </div>
                </div>
            </div>
        );
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
                    className="max-w-7xl mx-auto"
                >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">Application Status</h1>
                            <p className="text-gray-400 mt-2">Track and manage your job applications across various stages.</p>
                        </div>
                        <Link to="/jobs" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
                            Browse Jobs
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-b-2 border-primary">
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Total Applied</p>
                                <p className="text-3xl font-black text-white mt-1">{stats.total}</p>
                            </div>
                            <span className="material-symbols-outlined text-primary text-3xl opacity-50">send</span>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-b-2 border-purple-500">
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Interviewing</p>
                                <p className="text-3xl font-black text-white mt-1">{stats.interviewing}</p>
                            </div>
                            <span className="material-symbols-outlined text-purple-400 text-3xl opacity-50">forum</span>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-b-2 border-green-500">
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Offers</p>
                                <p className="text-3xl font-black text-white mt-1">{stats.offers}</p>
                            </div>
                            <span className="material-symbols-outlined text-green-400 text-3xl opacity-50">verified</span>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-b-2 border-red-500">
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Rejected</p>
                                <p className="text-3xl font-black text-white mt-1">{stats.rejected}</p>
                            </div>
                            <span className="material-symbols-outlined text-red-400 text-3xl opacity-50">cancel</span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 mb-8 border-b border-white/5 pb-4 overflow-x-auto custom-scrollbar">
                        {['all', 'applied', 'viewed', 'interviewing', 'offer', 'rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === status
                                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(140,43,238,0.3)]'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Application Cards List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-12 glass-panel rounded-2xl">
                                <span className="material-symbols-outlined animate-spin text-primary text-4xl mb-4">progress_activity</span>
                                <h3 className="text-xl font-bold text-white mb-2">Loading applications...</h3>
                            </div>
                        ) : filteredApplications.length === 0 ? (
                            <div className="text-center py-12 glass-panel rounded-2xl">
                                <span className="material-symbols-outlined text-gray-500 text-5xl mb-4 text-opacity-50">draft</span>
                                <h3 className="text-xl font-bold text-white mb-2">No applications found</h3>
                                <p className="text-gray-400 max-w-sm mx-auto">
                                    {filter === 'all'
                                        ? "You haven't applied to any jobs yet."
                                        : `You don't have any applications with the status '${filter}'.`}
                                </p>
                            </div>
                        ) : (
                            filteredApplications.map((app) => (
                                <ApplicationCard key={app._id} app={app} />
                            ))
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default MyApplicationsPage;
