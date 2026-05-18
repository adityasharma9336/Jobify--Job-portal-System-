import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/activities', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={onClose}></div>
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 origin-top-right"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <h3 className="text-white font-bold">Notifications</h3>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                                {notifications.length} New
                            </span>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-gray-400 text-xs">Fetching updates...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <span className="material-symbols-outlined text-gray-600 text-4xl mb-2">notifications_off</span>
                                    <p className="text-gray-400 text-sm">All caught up!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.map((notif) => (
                                        <div key={notif._id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className="flex gap-3">
                                                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                    notif.type === 'application' ? 'bg-blue-500/10 text-blue-400' : 
                                                    notif.type === 'alert' ? 'bg-amber-500/10 text-amber-400' : 
                                                    'bg-primary/10 text-primary'
                                                }`}>
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {notif.type === 'application' ? 'send' : notif.type === 'alert' ? 'priority_high' : 'notifications'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-200 leading-snug group-hover:text-white transition-colors">
                                                        {notif.description}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 mt-1 font-medium">
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-white/5 text-center bg-white/5">
                            <Link to="/interviews" onClick={onClose} className="text-xs font-bold text-primary hover:text-white transition-colors">
                                View All Activity
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
