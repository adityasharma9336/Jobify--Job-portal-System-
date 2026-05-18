import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Link, useParams, useLocation } from 'react-router-dom';

const ProfilePage = () => {
    const location = useLocation();
    const [user, setUser] = useState({
        name: '',
        email: '',
        title: '',
        bio: '',
        location: '',
        github: '',
        linkedin: ''
    });

    const [appStats, setAppStats] = useState({ total: 0, interviewing: 0, offers: 0 });
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();
    const [isOwnProfile, setIsOwnProfile] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // Determine which user to fetch
                const targetId = id;
                const isExternal = !!targetId;
                setIsOwnProfile(!isExternal);

                // Fetch User Profile
                const userUrl = isExternal ? `/api/users/${targetId}` : '/api/auth/me';
                const userRes = await fetch(userUrl, { headers: { Authorization: `Bearer ${token}` } });
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(prev => ({ ...prev, ...userData }));
                }

                // Fetch Stats
                const statsRes = await fetch('/api/applications/stats', { headers: { Authorization: `Bearer ${token}` } });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setAppStats(statsData);
                }

                // Fetch Recent Applications
                const appRes = await fetch('/api/applications', { headers: { Authorization: `Bearer ${token}` } });
                if (appRes.ok) {
                    const appData = await appRes.json();
                    setApplications(appData.slice(0, 5)); // Just take top 5 for profile page
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id, location.pathname]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser); // Update local state for immediate UI feedback
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Something went wrong');
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
                    className="max-w-7xl mx-auto"
                >
                    <h1 className="text-3xl font-bold mb-8">{isOwnProfile ? 'My Profile' : `${user.name}'s Profile`}</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Profile Form */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="glass-panel p-8 rounded-2xl border border-white/10 mb-8">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center relative group overflow-hidden shadow-2xl">
                                            {user.github ? (
                                                <span className="material-symbols-outlined text-4xl text-primary drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]">link</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-4xl text-primary drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]">person</span>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white mb-1">{user.name || 'Anonymous User'}</h2>
                                            <p className="text-gray-400 font-medium text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-xs">work</span>
                                                {user.title || 'Set your professional title'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-56 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-inner">
                                        <div className="flex items-center justify-between mb-2 px-1">
                                            <span className="text-xs font-black text-white/40 uppercase tracking-widest">Profile Power</span>
                                            <span className="text-xs font-black text-primary drop-shadow-[0_0_5px_rgba(236,72,153,0.3)]">{user.profileCompletion || 0}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${user.profileCompletion || 0}%` }}
                                                transition={{ type: "spring", stiffness: 50, damping: 15 }}
                                                className="h-full bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 animate-gradient-x shadow-[0_0_15px_rgba(219,39,119,0.5)]"
                                            ></motion.div>
                                        </div>
                                        {user.profileCompletion < 100 && (
                                            <div className="mt-4 space-y-2">
                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Complete These to Hit 100%:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {['name', 'title', 'bio', 'location', 'github', 'linkedin'].map(field => (
                                                        !user[field] && (
                                                            <span key={field} className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize font-bold">
                                                                {field}
                                                            </span>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-8 rounded-2xl border border-white/10">
                                <h2 className="text-xl font-bold mb-6">{isOwnProfile ? 'Edit Profile Details' : 'Profile Details'}</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={user.name}
                                                onChange={handleChange}
                                                readOnly={!isOwnProfile}
                                                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors ${!isOwnProfile ? 'cursor-default' : ''}`}
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Job Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={user.title}
                                                onChange={handleChange}
                                                readOnly={!isOwnProfile}
                                                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors ${!isOwnProfile ? 'cursor-default' : ''}`}
                                                placeholder="e.g. Product Designer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={user.email}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                                placeholder="name@example.com"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={user.location}
                                                onChange={handleChange}
                                                readOnly={!isOwnProfile}
                                                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors ${!isOwnProfile ? 'cursor-default' : ''}`}
                                                placeholder="e.g. San Francisco, CA"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={user.bio}
                                            onChange={handleChange}
                                            readOnly={!isOwnProfile}
                                            className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors h-32 resize-none ${!isOwnProfile ? 'cursor-default' : ''}`}
                                            placeholder="Tell us a bit about yourself..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">GitHub Profile Link</label>
                                            <input
                                                type="text"
                                                name="github"
                                                value={user.github}
                                                onChange={handleChange}
                                                readOnly={!isOwnProfile}
                                                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors ${!isOwnProfile ? 'cursor-default' : ''}`}
                                                placeholder="https://github.com/yourusername"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">LinkedIn Profile Link</label>
                                            <input
                                                type="text"
                                                name="linkedin"
                                                value={user.linkedin}
                                                onChange={handleChange}
                                                readOnly={!isOwnProfile}
                                                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors ${!isOwnProfile ? 'cursor-default' : ''}`}
                                                placeholder="https://linkedin.com/in/yourusername"
                                            />
                                        </div>
                                    </div>

                                    {isOwnProfile && (
                                        <div className="pt-4 border-t border-white/10 flex justify-end">
                                            <button
                                                type="submit"
                                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                                            >
                                                Save Profile
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Right Column: Stats and Recent Apps */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                                    <span className="material-symbols-outlined text-primary text-3xl mb-2">send</span>
                                    <span className="text-3xl font-bold text-white mb-1">{appStats.total}</span>
                                    <span className="text-sm text-gray-400">Total Applied</span>
                                </div>
                                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                                    <span className="material-symbols-outlined text-secondary text-3xl mb-2">forum</span>
                                    <span className="text-3xl font-bold text-white mb-1">{appStats.interviewing}</span>
                                    <span className="text-sm text-gray-400">Interviews</span>
                                </div>
                            </div>

                            {/* Recent Applications */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white">Recent Applications</h3>
                                    <Link to="/applications" className="text-xs text-primary hover:text-white transition-colors">View All</Link>
                                </div>

                                <div className="space-y-4">
                                    {loading ? (
                                        <p className="text-gray-400 text-sm text-center">Loading applications...</p>
                                    ) : applications.length === 0 ? (
                                        <div className="text-center py-4">
                                            <p className="text-gray-400 text-sm mb-4">No applications yet.</p>
                                            <Link to="/companies" className="text-primary text-sm font-bold hover:underline">Find Companies</Link>
                                        </div>
                                    ) : (
                                        applications.map(app => (
                                            <Link to="/applications" key={app._id} className="block group">
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-primary/20">
                                                    <div className={`size-10 rounded-lg ${app.job?.logoBg || 'bg-indigo-600'} flex items-center justify-center text-white shrink-0`}>
                                                        <span className={`material-symbols-outlined text-sm ${app.job?.logoColor || 'text-white'}`}>{app.job?.icon || 'work'}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{app.job?.title}</h4>
                                                        <p className="text-xs text-gray-400 truncate">{app.job?.company}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300 capitalize">{app.status}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default ProfilePage;
