import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Link } from 'react-router-dom';
import API_URL from '../api/config';

const InterviewsPage = () => {
    const [interviews, setInterviews] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [user, setUser] = useState({ name: 'User', title: 'Job Seeker', applicationsCount: 0, userType: 'job_seeker' });
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [scheduleForm, setScheduleForm] = useState({
        date: '',
        time: '',
        type: 'Zoom',
        title: 'Technical Interview',
        location: 'Remote'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const currentUser = storedUser ? JSON.parse(storedUser) : null;

                // Fetch stats for the sidebar
                const statsEndpoint = currentUser?.userType === 'employer' ? '/api/applications/employer/stats' : '/api/applications/stats';
                const statsRes = await fetch(statsEndpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (statsRes.ok) {
                    const stats = await statsRes.json();
                    setUser(prev => ({ 
                        ...prev, 
                        applicationsCount: stats.totalApplications || stats.total 
                    }));
                }

                // Fetch real interviews (based on role)
                const interviewsEndpoint = currentUser?.userType === 'employer' ? `${API_URL}/interviews/employer` : `${API_URL}/interviews`;
                const res = await fetch(interviewsEndpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setInterviews(data);
                }

                // If employer, fetch all applicants to schedule
                if (currentUser?.userType === 'employer') {
                    const appRes = await fetch('/api/applications/employer', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (appRes.ok) {
                        const appData = await appRes.json();
                        setApplicants(appData);
                    }
                }
            } catch (error) {
                console.error("Error fetching interviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/interviews`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({
                    userId: selectedApplicant.user?._id || selectedApplicant.user,
                    applicationId: selectedApplicant._id,
                    company: selectedApplicant.job?.company || user.name,
                    title: scheduleForm.title,
                    type: scheduleForm.type,
                    location: scheduleForm.location,
                    date: scheduleForm.date,
                    time: scheduleForm.time,
                    interviewer: { name: user.name, role: 'Hiring Manager' }
                })
            });

            if (res.ok) {
                const newInterview = await res.json();
                setInterviews(prev => [...prev, newInterview]);
                setIsScheduleModalOpen(false);
                setSelectedApplicant(null);
                // Optionally refresh applicants to show status update
            }
        } catch (error) {
            console.error("Error scheduling interview:", error);
        }
    };

    const upcomingCount = interviews.filter(i => i.status === 'Scheduled' || i.status === 'Rescheduled').length;

    // A helper to format time
    const formatTime = (timeString) => {
        // Assume timeString like "10:30 AM EST"
        const parts = timeString.split(' ');
        if (parts.length >= 2) {
            return {
                time: parts[0],
                ampm: parts.slice(1).join(' ')
            };
        }
        return { time: timeString, ampm: '' };
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
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full lg:w-80 flex flex-col gap-6">
                            {/* Profile Summary Card */}
                            <div className="glass-panel rounded-xl p-6 border border-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-3xl">account_circle</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{user.name}</h3>
                                        <p className="text-xs text-gray-400">{user.title || (user.userType === 'employer' ? 'Hiring Manager' : 'Job Seeker')}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">{user.userType === 'employer' ? 'Total Applications' : 'My Applications'}</span>
                                        <span className="font-semibold text-gray-200">{user.applicationsCount || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Interviews</span>
                                        <span className="font-semibold text-primary">{upcomingCount} Upcoming</span>
                                    </div>
                                </div>
                                <button className="w-full mt-6 bg-primary text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-sm">sync</span>
                                    Sync Calendar
                                </button>
                            </div>

                            {/* Toolbox (Role-Based) */}
                            <div className="glass-panel rounded-xl p-5 border-l-4 border-primary bg-white/5">
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">
                                        {user.userType === 'employer' ? 'assignment_ind' : 'lightbulb'}
                                    </span>
                                    {user.userType === 'employer' ? 'Hiring Toolbox' : 'Prep Toolbox'}
                                </h4>
                                <ul className="space-y-3 text-sm">
                                    {user.userType === 'employer' ? (
                                        <>
                                            <li><a href="#" className="text-gray-400 hover:text-primary flex items-center justify-between transition-colors">Interview Guide <span className="material-symbols-outlined text-xs">arrow_forward_ios</span></a></li>
                                            <li><a href="#" className="text-gray-400 hover:text-primary flex items-center justify-between transition-colors">Evaluation Rubric <span className="material-symbols-outlined text-xs">arrow_forward_ios</span></a></li>
                                            <li><a href="#" className="text-gray-400 hover:text-primary flex items-center justify-between transition-colors">Email Templates <span className="material-symbols-outlined text-xs">arrow_forward_ios</span></a></li>
                                        </>
                                    ) : (
                                        <>
                                            <li><a href="https://www.themuse.com/advice/interview-questions-and-answers" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary flex items-center justify-between transition-colors">Common Questions <span className="material-symbols-outlined text-xs">arrow_forward_ios</span></a></li>
                                            <li><a href="https://hbr.org/2014/04/15-rules-for-negotiating-a-job-offer" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary flex items-center justify-between transition-colors">Salary Negotiation <span className="material-symbols-outlined text-xs">arrow_forward_ios</span></a></li>
                                            <li><a href="https://www.invisionapp.com/inside-design/portfolio-presentation/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary flex items-center justify-between transition-colors">Portfolio Walkthrough <span className="material-symbols-outlined text-xs">arrow_forward_ios</span></a></li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </aside>

                        {/* Primary Content */}
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Interview Schedule</h1>
                                    <p className="text-gray-400 mt-2">You have <span className="text-primary font-bold">{upcomingCount} interviews</span> scheduled.</p>
                                </div>
                                {user?.userType === 'admin' && (
                                    <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        Add Interview
                                    </button>
                                )}
                            </div>

                            {/* Tab Switcher */}
                            <div className="flex gap-8 border-b border-white/10">
                                <button
                                    onClick={() => setActiveTab('upcoming')}
                                    className={`pb-4 font-bold relative transition-colors ${activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Upcoming
                                </button>
                                {user.userType === 'employer' && (
                                    <button
                                        onClick={() => setActiveTab('applicants')}
                                        className={`pb-4 font-bold relative transition-colors ${activeTab === 'applicants' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Candidates
                                    </button>
                                )}
                                <button
                                    onClick={() => setActiveTab('past')}
                                    className={`pb-4 font-bold relative transition-colors ${activeTab === 'past' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    History
                                </button>
                            </div>

                            {/* Interview Cards List */}
                            <div className="flex flex-col gap-5">
                                {loading ? (
                                    <div className="text-center py-12 glass-panel rounded-2xl border border-white/5">
                                        <span className="material-symbols-outlined animate-spin text-primary text-4xl mb-4">progress_activity</span>
                                        <h3 className="text-xl font-bold text-white">Loading schedule...</h3>
                                    </div>
                                ) : activeTab === 'applicants' ? (
                                    applicants.length === 0 ? (
                                        <div className="text-center py-12 glass-panel rounded-2xl border border-white/5">
                                            <h3 className="text-xl font-bold text-white mb-2">No Candidates Found</h3>
                                            <p className="text-gray-400">Wait for candidates to apply to your jobs.</p>
                                        </div>
                                    ) : (
                                        applicants.map((app) => (
                                            <div key={app._id} className="glass-panel border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all">
                                                <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                            <span className="material-symbols-outlined text-2xl">person</span>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-white">{app.fullName || app.user?.name}</h3>
                                                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-sm">work</span>
                                                                {app.job?.title}
                                                            </p>
                                                            <div className="flex gap-4 mt-1">
                                                                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-xs">mail</span>
                                                                    {app.email}
                                                                </span>
                                                                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-xs">call</span>
                                                                    {app.phone}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 text-sm font-bold flex items-center gap-2 border border-white/10">
                                                            <span className="material-symbols-outlined text-sm">description</span>
                                                            CV
                                                        </a>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedApplicant(app);
                                                                setIsScheduleModalOpen(true);
                                                            }}
                                                            className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:shadow-[0_0_15px_rgba(140,43,238,0.4)] transition-all flex items-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                                                            Schedule
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )
                                ) : interviews.length === 0 ? (
                                        <div className="text-center py-12 glass-panel rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                                            <div className="size-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                                                <span className="material-symbols-outlined text-3xl">event_available</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">No Interviews Scheduled</h3>
                                            <p className="text-gray-400 max-w-md mx-auto mb-6">
                                                {user.userType === 'employer' 
                                                    ? "You don't have any interviews right now. Go to the Candidates tab to schedule one."
                                                    : "You don't have any interviews right now. Keep applying to land your dream role!"}
                                            </p>
                                            <Link 
                                                to={user.userType === 'employer' ? "/employer-dashboard" : "/jobs"} 
                                                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-[0_0_15px_rgba(140,43,238,0.4)] transition-all"
                                            >
                                                {user.userType === 'employer' ? "View Employer Dashboard" : "Browse Jobs"}
                                            </Link>
                                        </div>
                                ) : (
                                    interviews.filter(i => activeTab === 'upcoming' ? (i.status === 'Scheduled' || i.status === 'Rescheduled') : (i.status === 'Completed' || i.status === 'Cancelled'))
                                        .map((interview) => {
                                            const { time, ampm } = formatTime(interview.time);
                                            const isZoom = interview.type === 'Zoom' || interview.type === 'Google Meet';

                                            return (
                                                <div key={interview._id} className={`glass-panel border border-white/5 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(140,43,238,0.1)] hover:border-primary/30 transition-all ${interview.status === 'Cancelled' ? 'opacity-60 grayscale' : ''}`}>
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        <div className="flex-1 flex flex-col md:flex-row gap-6">
                                                            <div className={`size-20 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5 ${interview.job?.logoBg || 'bg-slate-800'}`}>
                                                                {interview.job?.logo ? (
                                                                    <img src={interview.job.logo} alt={interview.company} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="text-3xl font-black text-white">{interview.company.charAt(0)}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${interview.status === 'Rescheduled' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-primary/20 text-primary'}`}>
                                                                        {interview.status}
                                                                    </span>
                                                                    <span className="text-gray-400 text-sm flex items-center gap-1">
                                                                        <span className="material-symbols-outlined text-sm">{isZoom ? 'videocam' : 'groups'}</span>
                                                                        {interview.type}
                                                                    </span>
                                                                </div>
                                                                <h2 className="text-xl font-bold text-white">{interview.title}</h2>
                                                                <p className="text-gray-400 font-medium">{interview.company}</p>

                                                                {interview.interviewer && interview.interviewer.name && (
                                                                    <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="size-8 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center overflow-hidden">
                                                                                <span className="material-symbols-outlined text-sm">person</span>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-xs font-bold text-gray-200">{interview.interviewer.name}</p>
                                                                                <p className="text-[10px] text-gray-500">{interview.interviewer.role}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Time & Action column */}
                                                        <div className="flex flex-col items-center md:items-end justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8 gap-3 min-w-[180px]">
                                                            <div className="text-center md:text-right">
                                                                <p className="text-3xl font-black text-white">{time}</p>
                                                                <p className="text-sm font-bold text-gray-400">{ampm}</p>
                                                                <p className="text-xs text-primary mt-1">{new Date(interview.date).toLocaleDateString()}</p>
                                                            </div>
                                                            <button
                                                                disabled={interview.status === 'Cancelled'}
                                                                className={`w-full py-2 px-6 rounded-lg font-bold transition-all text-sm
                                                                ${interview.status === 'Cancelled' ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-primary hover:shadow-[0_0_15px_rgba(140,43,238,0.4)] text-white'}
                                                            `}
                                                            >
                                                                {isZoom ? 'Join Meeting' : 'View Details'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Schedule Modal */}
            {isScheduleModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsScheduleModalOpen(false)}
                    ></motion.div>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl relative z-10 overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/5 bg-primary/10">
                            <h2 className="text-xl font-bold text-white">Schedule Interview</h2>
                            <p className="text-sm text-gray-400">Invite {selectedApplicant?.fullName || 'Candidate'} to a call.</p>
                        </div>
                        <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                                    <input 
                                        type="date" required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                        value={scheduleForm.date}
                                        onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Time</label>
                                    <input 
                                        type="time" required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                        value={scheduleForm.time}
                                        onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Meeting Type</label>
                                <select 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none appearance-none"
                                    value={scheduleForm.type}
                                    onChange={(e) => setScheduleForm({...scheduleForm, type: e.target.value})}
                                >
                                    <option value="Zoom" className="bg-[#1c1723]">Zoom Meeting</option>
                                    <option value="Google Meet" className="bg-[#1c1723]">Google Meet</option>
                                    <option value="In-person" className="bg-[#1c1723]">In-person</option>
                                    <option value="Phone" className="bg-[#1c1723]">Phone Call</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Interview Title</label>
                                <input 
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                    placeholder="e.g. Technical Interview"
                                    value={scheduleForm.title}
                                    onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsScheduleModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:shadow-[0_0_20px_rgba(140,43,238,0.5)] transition-all"
                                >
                                    Schedule Now
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default InterviewsPage;
