import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PostJobModal from '../components/dashboard/PostJobModal';
import API_URL from '../api/config';

const EmployerDashboard = ({ user }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const [currentUser, setCurrentUser] = useState(user);
    const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
    const [myJobs, setMyJobs] = useState([]);
    const [stats, setStats] = useState({ activeJobs: 0, totalApplications: 0, profileViews: 0 });
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [companyProfile, setCompanyProfile] = useState({
        name: '', industry: '', about: '', website: '', location: '', logo: ''
    });

    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setCurrentUser(parsedUser);
                setCompanyProfile({
                    name: parsedUser.company || parsedUser.name || '',
                    industry: parsedUser.industry || '',
                    about: parsedUser.bio || parsedUser.about || '',
                    website: parsedUser.website || '',
                    location: parsedUser.location || '',
                    logo: parsedUser.avatar || ''
                });
            }
        } else {
            setCurrentUser(user);
            setCompanyProfile({
                name: user.company || user.name || '',
                industry: user.industry || '',
                about: user.bio || user.about || '',
                website: user.website || '',
                location: user.location || '',
                logo: user.avatar || ''
            });
        }
    }, [user]);

    // Schedule Interview Modal State
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [interviewParams, setInterviewParams] = useState({
        userId: '', applicationId: '', candidateName: '', company: '', title: '', type: 'Technical', date: '', time: ''
    });

    const fetchEmployerData = async () => {
        try {
            const token = localStorage.getItem('token');
            // Fetch stats
            const statsRes = await fetch(`${API_URL}/applications/employer/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            // Fetch applications
            const appsRes = await fetch(`${API_URL}/applications/employer`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (appsRes.ok) {
                const appsData = await appsRes.json();
                setApplications(appsData);
            }

            // Fetch my jobs
            const jobsRes = await fetch(`${API_URL}/jobs/my-jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                setMyJobs(jobsData);
            }

            // Fetch employer interviews
            const interviewsRes = await fetch(`${API_URL}/interviews/employer`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (interviewsRes.ok) {
                const interviewsData = await interviewsRes.json();
                setInterviews(interviewsData);
            }

        } catch (error) {
            console.error("Error fetching employer data:", error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchEmployerData();
        }
    }, [activeTab, currentUser]);

    const handleJobPosted = (newJob) => {
        setMyJobs(prev => [newJob, ...prev]);
        setStats(prev => ({ ...prev, activeJobs: prev.activeJobs + 1 }));
    };

    const updateAppStatus = async (appId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/applications/employer/${appId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchEmployerData();
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleScheduleInterview = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/interviews`, {
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
                fetchEmployerData();
            } else {
                const errorData = await res.json();
                alert(`Failed to schedule interview: ${errorData.message || 'Server error'}`);
            }
        } catch (error) {
            console.error("Error scheduling interview", error);
            alert("Something went wrong while scheduling the interview.");
        }
    };

    const handleCompanyUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...companyProfile,
                    company: companyProfile.name // Map company name to the 'company' field
                })
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setCurrentUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert("Company profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating company profile:", error);
            alert("Failed to update profile.");
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCompanyProfile(prev => ({ ...prev, logo: reader.result, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen pt-32 px-4 md:px-8 max-w-7xl mx-auto w-full pb-20">
            <main className="w-full">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back, {currentUser?.name || 'Recruiter'}</h2>
                    <p className="text-slate-400">Manage your job postings and find the best talent.</p>
                </header>

                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div
                                onClick={() => setSearchParams({ tab: 'jobs' })}
                                className="glass-card p-6 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                        <span className="material-symbols-outlined">work</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">+2 this week</span>
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium mb-1">Active Jobs</h3>
                                <p className="text-3xl font-bold text-white">{stats.activeJobs}</p>
                            </div>
                            <div
                                onClick={() => setSearchParams({ tab: 'applications' })}
                                className="glass-card p-6 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                        <span className="material-symbols-outlined">group</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">+15 today</span>
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium mb-1">Total Applications</h3>
                                <p className="text-3xl font-bold text-white">{stats.totalApplications}</p>
                            </div>
                            <div
                                onClick={() => setSearchParams({ tab: 'interviews' })}
                                className="glass-card p-6 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
                                        <span className="material-symbols-outlined">event</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">New</span>
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium mb-1">Interviews</h3>
                                <p className="text-3xl font-bold text-white">{interviews.length}</p>
                            </div>
                            <div className="glass-card p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                                        <span className="material-symbols-outlined">visibility</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">+12%</span>
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium mb-1">Profile Views</h3>
                                <p className="text-3xl font-bold text-white">{stats.profileViews}</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-4">Recent Applications</h3>
                            {applications.length > 0 ? (
                                <div className="space-y-4">
                                    {applications.slice(0, 3).map(app => (
                                        <div key={app._id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex justify-between items-center group">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                                                    {app.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">{app.user?.name || 'Unknown Candidate'}</h3>
                                                    <p className="text-sm text-gray-400">Applied for: <span className="text-primary">{app.job?.title}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 capitalize">
                                                    {app.status || 'reviewing'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-slate-400 text-center py-8">
                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                                    <p>No new applications yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'jobs' && (
                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">My Job Postings</h2>
                            <button
                                onClick={() => setIsPostJobModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Post New Job
                            </button>
                        </div>
                        <div className="space-y-4">
                            {myJobs.length > 0 ? (
                                myJobs.map(job => (
                                    <div key={job._id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex justify-between items-center group">
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">{job.title}</h3>
                                            <p className="text-sm text-gray-400">{job.location} • {job.type}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">Active</span>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-400 text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                                    <p>No jobs posted yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'applications' && (
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-xl font-bold mb-6">Candidates Overview</h2>
                        {applications.length > 0 ? (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                                            <th className="py-3 px-4 font-medium">Candidate Name</th>
                                            <th className="py-3 px-4 font-medium">Applied Job</th>
                                            <th className="py-3 px-4 font-medium">Date</th>
                                            <th className="py-3 px-4 font-medium">Status</th>
                                            <th className="py-3 px-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(app => (
                                            <tr key={app._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                                                            {app.user?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <span className="font-medium text-white">{app.user?.name || 'Unknown User'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-gray-300">{app.job?.title || 'Unknown Job'}</td>
                                                <td className="py-4 px-4 text-gray-400 text-sm">
                                                    {new Date(app.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`text-xs px-2 py-1 rounded capitalize ${app.status === 'pending' ? 'bg-primary/20 text-primary border border-primary/30' :
                                                        app.status === 'accepted' || app.status === 'offer' || app.status === 'hired' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                            app.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                        }`}>
                                                        {app.status || 'reviewing'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {(!app.status || app.status === 'pending') && (
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
                                                                }} className="text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/30 px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 font-medium">Accept</button>
                                                                <button onClick={() => updateAppStatus(app._id, 'rejected')} className="text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/30 px-2 py-1 rounded text-xs transition-colors">Reject</button>
                                                            </>
                                                        )}
                                                        <Link to={`/profile/${app.user?._id}`} className="text-primary hover:text-white transition-colors font-medium text-xs ml-2">View Profile</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-slate-400 text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                                <p>No applications received yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'interviews' && (
                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Scheduled Interviews</h2>
                        </div>
                        <div className="space-y-4">
                            {interviews.length > 0 ? (
                                interviews.map(interview => (
                                    <div key={interview._id} className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary text-lg">
                                                {interview.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{interview.user?.name || 'Unknown Candidate'}</h3>
                                                <p className="text-sm text-gray-400">For: <span className="text-white font-medium">{interview.title}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end gap-1">
                                            <div className="flex items-center gap-2 text-primary font-bold">
                                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                {new Date(interview.date).toLocaleDateString()} at {interview.time}
                                            </div>
                                            {interview.location && (
                                                <div className="flex items-center justify-end gap-1 text-xs text-gray-400 mt-1">
                                                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                    {interview.location.startsWith('http') ? (
                                                        <a href={interview.location} target="_blank" rel="noreferrer" className="text-primary hover:underline">Join Meeting</a>
                                                    ) : (
                                                        <span>{interview.location}</span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                    {interview.type}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded ${interview.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                    interview.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                        'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    }`}>
                                                    {interview.status || 'Scheduled'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-400 text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10 flex flex-col items-center">
                                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50">event_busy</span>
                                    <p>No interviews scheduled yet.</p>
                                    <p className="text-sm mt-2 opacity-75">Accept some candidate applications to start scheduling!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'company' && (
                    <div className="flex justify-center items-center w-full min-h-[60vh]">
                        <div className="glass-card p-6 md:p-10 rounded-2xl w-full max-w-3xl">
                            <h2 className="text-xl font-bold mb-6">Company Profile Settings</h2>
                            <form className="space-y-6" onSubmit={handleCompanyUpdate}>
                                <div className="flex items-center gap-6 mb-8">
                                    <div
                                        onClick={() => document.getElementById('logo-upload').click()}
                                        className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer overflow-hidden relative">
                                        {companyProfile.logo ? (
                                            <img src={companyProfile.logo} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-3xl mb-1">add_photo_alternate</span>
                                                <span className="text-xs font-medium">Upload Logo</span>
                                            </>
                                        )}
                                        <input
                                            id="logo-upload"
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{companyProfile.name || 'Company Profile'}</h3>
                                        <p className="text-sm text-gray-400">Update your company's public identity.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                                        <input
                                            type="text"
                                            value={companyProfile.name}
                                            onChange={(e) => setCompanyProfile({ ...companyProfile, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Technology, Healthcare"
                                            value={companyProfile.industry}
                                            onChange={(e) => setCompanyProfile({ ...companyProfile, industry: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">About the Company</label>
                                        <textarea
                                            rows="4"
                                            placeholder="Describe your company's mission and culture..."
                                            value={companyProfile.about}
                                            onChange={(e) => setCompanyProfile({ ...companyProfile, about: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors custom-scrollbar shrink-0"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                                        <input
                                            type="url"
                                            placeholder="https://"
                                            value={companyProfile.website}
                                            onChange={(e) => setCompanyProfile({ ...companyProfile, website: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Location (HQ)</label>
                                        <input
                                            type="text"
                                            placeholder="City, State"
                                            value={companyProfile.location}
                                            onChange={(e) => setCompanyProfile({ ...companyProfile, location: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex justify-end">
                                    <button type="submit" className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <PostJobModal
                isOpen={isPostJobModalOpen}
                onClose={() => setIsPostJobModalOpen(false)}
                onJobPosted={handleJobPosted}
            />

            {/* Modal: Schedule Interview */}
            {showInterviewModal && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl w-full max-w-md"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Schedule Interview</h3>
                            <button onClick={() => setShowInterviewModal(false)} className="text-slate-400 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">Scheduling for: <strong className="text-white">{interviewParams.candidateName}</strong> for <strong className="text-white">{interviewParams.title}</strong></p>
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
                            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all mt-6">
                                Send Invite
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default EmployerDashboard;
