import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../api/config';

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [users, setUsers] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // New Job Form State
    const [showNewJobModal, setShowNewJobModal] = useState(false);
    const [newJobParams, setNewJobParams] = useState({
        title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', category: 'Engineering'
    });

    // Schedule Interview Modal State
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [interviewParams, setInterviewParams] = useState({
        userId: '', applicationId: '', candidateName: '', company: '', title: '', type: 'Technical', date: '', time: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [statsRes, appsRes, jobsRes, usersRes, interviewsRes] = await Promise.all([
                fetch(`${API_URL}/admin/stats`, { headers }),
                fetch(`${API_URL}/admin/applications`, { headers }),
                fetch(`${API_URL}/admin/jobs`, { headers }),
                fetch(`${API_URL}/admin/users`, { headers }),
                fetch(`${API_URL}/admin/interviews`, { headers })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            else if (statsRes.status === 401 || statsRes.status === 403) {
                setError("Access Denied. You do not have administrator privileges. Please log in with the admin account (admin@jobify.com).");
            } else {
                setError("Failed to fetch dashboard data. The server might be unreachable or reporting an error.");
            }

            if (appsRes.ok) setApplications(await appsRes.json());
            if (jobsRes.ok) setJobs(await jobsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
            if (interviewsRes.ok) setInterviews(await interviewsRes.json());

        } catch (error) {
            console.error("Error fetching admin data:", error);
            setError("Failed to fetch dashboard data. Please ensure the backend server is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const updateAppStatus = async (appId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/applications/${appId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                // Refresh data
                fetchData();
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleScheduleInterview = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/interviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(interviewParams)
            });
            if (res.ok) {
                setShowInterviewModal(false);
                alert("Interview scheduled successfully! Application status updated to 'Accepted'.");
                fetchData(); // Refresh apps and interviews
            }
        } catch (error) {
            console.error("Error scheduling interview", error);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...newJobParams,
                    icon: 'work',
                    logoBg: 'bg-primary',
                    logoColor: 'text-white'
                })
            });
            if (res.ok) {
                setShowNewJobModal(false);
                fetchData(); // Refresh to show new job
            }
        } catch (error) {
            console.error("Error posting job", error);
        }
    };

    const renderDashboard = () => {
        if (!stats) return null;
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {/* Stats Overview Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div
                        onClick={() => setActiveTab('applications')}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-slate-400">Total Applications</p>
                            <span className="material-symbols-outlined text-primary">groups</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.counts?.applications?.total || 0}</p>
                    </div>

                    <div
                        onClick={() => setActiveTab('applications')}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-slate-400">Pending Review</p>
                            <span className="material-symbols-outlined text-primary">hourglass_empty</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.counts?.applications?.pending || 0}</p>
                    </div>

                    <div
                        onClick={() => setActiveTab('applications')}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-slate-400">Accepted</p>
                            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.counts?.applications?.accepted || 0}</p>
                    </div>

                    <div
                        onClick={() => setActiveTab('applications')}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-slate-400">Rejected</p>
                            <span className="material-symbols-outlined text-rose-500">cancel</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.counts?.applications?.rejected || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div
                        onClick={() => setActiveTab('users')}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-slate-400">Total Users</p>
                            <span className="material-symbols-outlined text-blue-400">person</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.counts?.users || 0}</p>
                    </div>
                    <div
                        onClick={() => setActiveTab('jobs')}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-slate-400">Active Jobs</p>
                            <span className="material-symbols-outlined text-purple-400">work</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.counts?.jobs || 0}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-slate-400">Companies</p>
                            <span className="material-symbols-outlined text-pink-400">apartment</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.counts?.companies || 0}</p>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderApplications = () => {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white">Application Pipeline</h2>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Applicant</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Job Role</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date Applied</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {applications.map(app => (
                                    <tr key={app._id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-primary">
                                                    {app.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{app.user?.name || 'Unknown User'}</p>
                                                    <p className="text-xs text-slate-500">{app.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-300">
                                            {app.job?.title || 'Unknown Job'}
                                            <span className="block text-xs text-slate-500">{app.job?.company}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-300">
                                            {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium 
                                                ${app.status === 'pending' ? 'bg-primary/20 text-primary' :
                                                    app.status === 'accepted' || app.status === 'offer' || app.status === 'hired' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        app.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {app.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {app.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => {
                                                            setInterviewParams({
                                                                userId: app.user?._id,
                                                                applicationId: app._id,
                                                                candidateName: app.user?.name,
                                                                company: app.job?.company,
                                                                title: app.job?.title,
                                                                type: 'Technical',
                                                                date: new Date().toISOString().split('T')[0],
                                                                time: '10:00',
                                                                location: ''
                                                            });
                                                            setShowInterviewModal(true);
                                                        }} className="text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/30 px-2 py-1 rounded text-xs transition-colors">Accept</button>
                                                        <button onClick={() => updateAppStatus(app._id, 'rejected')} className="text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/30 px-2 py-1 rounded text-xs transition-colors">Reject</button>
                                                    </>
                                                )}
                                                <button onClick={() => {
                                                    setInterviewParams({
                                                        userId: app.user?._id,
                                                        applicationId: app._id,
                                                        candidateName: app.user?.name,
                                                        company: app.job?.company,
                                                        title: app.job?.title,
                                                        type: 'Technical',
                                                        date: new Date().toISOString().split('T')[0],
                                                        time: '10:00',
                                                        location: ''
                                                    });
                                                    setShowInterviewModal(true);
                                                }} className="text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/30 px-2 py-1 rounded text-xs transition-colors">
                                                    Schedule Interview
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {applications.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No applications found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderJobs = () => {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white">Platform Jobs</h2>
                    <button
                        onClick={() => setShowNewJobModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Post New Job
                    </button>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Job Title</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Company</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Location</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date Posted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {jobs.map(job => (
                                    <tr key={job._id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{job.title}</td>
                                        <td className="px-6 py-4 text-slate-300">{job.company?.name || job.company}</td>
                                        <td className="px-6 py-4 text-slate-300">{job.location}</td>
                                        <td className="px-6 py-4 text-slate-300">{new Date(job.createdAt || job.postedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {jobs.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-400">No jobs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderUsers = () => {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white">Registered Users</h2>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">User</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map(user => (
                                    <tr key={user._id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-blue-400">
                                                    {user.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-slate-400">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderInterviews = () => {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white">Scheduled Interviews</h2>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Candidate</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Position</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date & Time</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Platform</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {interviews.map(interview => (
                                    <tr key={interview._id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-primary">
                                                    {interview.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{interview.user?.name}</p>
                                                    <p className="text-xs text-slate-500">{interview.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-300">
                                            {interview.title}
                                            <span className="block text-xs text-slate-500">{interview.company}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-300">
                                            {new Date(interview.date).toLocaleDateString()}
                                            <span className="block text-xs font-medium text-white">{interview.time}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-300">
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">{interview.type === 'Zoom' || interview.type === 'Google Meet' ? 'videocam' : 'groups'}</span>
                                                {interview.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${interview.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                                interview.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400' :
                                                    interview.status === 'Rescheduled' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        'bg-primary/20 text-primary'
                                                }`}>
                                                {interview.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {interviews.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No interviews scheduled.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0c] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0c] text-white">
                <span className="material-symbols-outlined text-rose-500 text-6xl mb-4">error</span>
                <h2 className="text-3xl font-bold mb-2">Access Restricted</h2>
                <p className="text-slate-400 mb-8 max-w-md text-center">{error}</p>
                <button onClick={handleLogout} className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined">login</span>
                    Log In as Admin
                </button>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#0a0a0c] font-display text-slate-100">
            {/* Background Accents */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -left-[5%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
                <div className="absolute -bottom-[10%] -right-[5%] h-[30%] w-[30%] rounded-full bg-primary/15 blur-[100px]"></div>
            </div>

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md px-6 md:px-10 py-3">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined">layers</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-white">Admin Suite</h2>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <button onClick={() => setActiveTab('dashboard')} className={`text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-primary border-b-2 border-primary py-1' : 'text-slate-400 hover:text-primary'}`}>Overview</button>
                            <button onClick={() => setActiveTab('applications')} className={`text-sm font-medium transition-colors ${activeTab === 'applications' ? 'text-primary border-b-2 border-primary py-1' : 'text-slate-400 hover:text-primary'}`}>Applications</button>
                            <button onClick={() => setActiveTab('interviews')} className={`text-sm font-medium transition-colors ${activeTab === 'interviews' ? 'text-primary border-b-2 border-primary py-1' : 'text-slate-400 hover:text-primary'}`}>Interviews</button>
                            <button onClick={() => setActiveTab('jobs')} className={`text-sm font-medium transition-colors ${activeTab === 'jobs' ? 'text-primary border-b-2 border-primary py-1' : 'text-slate-400 hover:text-primary'}`}>Jobs</button>
                            <button onClick={() => setActiveTab('users')} className={`text-sm font-medium transition-colors ${activeTab === 'users' ? 'text-primary border-b-2 border-primary py-1' : 'text-slate-400 hover:text-primary'}`}>Users</button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col p-6 md:p-10 relative z-10">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-2">
                    <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                        {activeTab === 'dashboard' ? 'Global Dashboard' :
                            activeTab === 'applications' ? 'Application Management' :
                                activeTab === 'interviews' ? 'Interview Schedule' :
                                    activeTab === 'jobs' ? 'Job Listings' : 'User Registry'}
                    </h1>
                    <p className="text-slate-400 max-w-2xl">
                        {activeTab === 'dashboard' ? 'Welcome to the master control panel of Jobify.' :
                            activeTab === 'applications' ? 'Review, filter, and process incoming candidate applications.' :
                                activeTab === 'interviews' ? 'Manage and review upcoming candidate interviews.' :
                                    activeTab === 'jobs' ? 'Manage active job postings on the platform.' : 'View all registered job seekers and employers.'}
                    </p>
                </div>

                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'applications' && renderApplications()}
                {activeTab === 'interviews' && renderInterviews()}
                {activeTab === 'jobs' && renderJobs()}
                {activeTab === 'users' && renderUsers()}
            </main>

            {/* Modal: Post Job */}
            <AnimatePresence>
                {showNewJobModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl w-full max-w-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Post New Job</h3>
                                <button onClick={() => setShowNewJobModal(false)} className="text-slate-400 hover:text-white">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={handlePostJob} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Job Title</label>
                                        <input required type="text" value={newJobParams.title} onChange={e => setNewJobParams({ ...newJobParams, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Company</label>
                                        <input required type="text" value={newJobParams.company} onChange={e => setNewJobParams({ ...newJobParams, company: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Location</label>
                                        <input required type="text" value={newJobParams.location} onChange={e => setNewJobParams({ ...newJobParams, location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Employment Type</label>
                                        <select value={newJobParams.type} onChange={e => setNewJobParams({ ...newJobParams, type: e.target.value })} className="w-full bg-[#151518] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary">
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Salary Range</label>
                                        <input required type="text" value={newJobParams.salary} onChange={e => setNewJobParams({ ...newJobParams, salary: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary" placeholder="e.g. $100k - $120k" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Category</label>
                                        <select value={newJobParams.category} onChange={e => setNewJobParams({ ...newJobParams, category: e.target.value })} className="w-full bg-[#151518] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary">
                                            <option value="Engineering">Engineering</option>
                                            <option value="Design">Design</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Management">Management</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Description</label>
                                    <textarea required rows="4" value={newJobParams.description} onChange={e => setNewJobParams({ ...newJobParams, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all">
                                    Publish Job
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal: Schedule Interview */}
            <AnimatePresence>
                {showInterviewModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl w-full max-w-md"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Schedule Interview</h3>
                                <button onClick={() => setShowInterviewModal(false)} className="text-slate-400 hover:text-white">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p className="text-sm text-slate-400 mb-4">Scheduling for: <strong className="text-white">{interviewParams.candidateName}</strong> for <strong className="text-white">{interviewParams.title}</strong> at {interviewParams.company}</p>
                            <form onSubmit={handleScheduleInterview} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Date</label>
                                    <input required type="date" value={interviewParams.date} onChange={e => setInterviewParams({ ...interviewParams, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Time</label>
                                    <input required type="time" value={interviewParams.time} onChange={e => setInterviewParams({ ...interviewParams, time: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Interview Type</label>
                                    <select value={interviewParams.type} onChange={e => setInterviewParams({ ...interviewParams, type: e.target.value })} className="w-full bg-[#151518] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary">
                                        <option value="Technical">Technical Interview</option>
                                        <option value="HR">HR Round</option>
                                        <option value="Behavioral">Behavioral Assessment</option>
                                        <option value="Final">Final Round</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Meeting Link / Location</label>
                                    <input placeholder="e.g. Google Meet link or HQ Address" required type="text" value={interviewParams.location} onChange={e => setInterviewParams({ ...interviewParams, location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary" />
                                </div>
                                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all">
                                    Send Invite
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboardPage;
