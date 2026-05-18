import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import API_URL from '../api/config';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ name: 'User' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/activities`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Sort by newest first
                    setNotifications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'application': return 'description';
            case 'interview': return 'event';
            case 'message': return 'chat';
            case 'alert': return 'notifications_active';
            case 'application_update': return 'update';
            default: return 'info';
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'application': return 'text-blue-400 bg-blue-500/10';
            case 'interview': return 'text-purple-400 bg-purple-500/10';
            case 'message': return 'text-green-400 bg-green-500/10';
            case 'alert': return 'text-amber-400 bg-amber-500/10';
            case 'application_update': return 'text-pink-400 bg-pink-500/10';
            default: return 'text-gray-400 bg-gray-500/10';
        }
    };

    return (
        <div className="bg-jobify text-white font-display min-h-screen relative overflow-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                <DashboardHeader />

                <div className="mt-12 mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Notifications</h1>
                        <p className="text-gray-400 mt-2">Stay updated with your latest activities and alerts.</p>
                    </div>
                    <button className="text-sm font-bold text-primary hover:underline">Mark all as read</button>
                </div>

                <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined animate-spin text-primary text-5xl mb-4">progress_activity</span>
                            <p className="text-gray-400 font-bold">Fetching your alerts...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                <span className="material-symbols-outlined text-4xl text-gray-600">notifications_off</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">All quiet for now</h3>
                            <p className="text-gray-500 max-w-sm">When you receive job alerts or interview invitations, they'll appear here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {notifications.map((note, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={note._id}
                                    className="p-6 hover:bg-white/[0.03] transition-all flex gap-5 group cursor-pointer"
                                >
                                    <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${getIconColor(note.type)}`}>
                                        <span className="material-symbols-outlined">{getIcon(note.type)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-white group-hover:text-primary transition-colors">{note.description}</h4>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">schedule</span>
                                                {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {note.type === 'interview' && (
                                                <span className="text-primary font-bold">Action Required</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-gray-600 hover:text-white">more_vert</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Insight */}
                <div className="mt-8 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">security</span>
                    Your notification data is encrypted and secure.
                </div>
            </main>
        </div>
    );
};

export default NotificationsPage;
