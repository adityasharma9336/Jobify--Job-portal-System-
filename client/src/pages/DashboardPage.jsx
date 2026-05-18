import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ApplicationProgress from '../components/dashboard/ApplicationProgress';
import RecommendedJobs from '../components/dashboard/RecommendedJobs';
import RecentActivity from '../components/dashboard/RecentActivity';
import FollowedCompanies from '../components/dashboard/FollowedCompanies';
import EmployerDashboard from './EmployerDashboard';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [appStats, setAppStats] = useState({ total: 0, interviewing: 0, offers: 0 });
    const [activities, setActivities] = useState([]);

    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (token) {
            fetchStats(token);
            fetchActivity(token);
            fetchUser(token);
        } else if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [location.pathname]);

    const fetchUser = async (token) => {
        try {
            const res = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchStats = async (token) => {
        try {
            const res = await fetch('/api/applications/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAppStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchActivity = async (token) => {
        try {
            const res = await fetch('/api/activities', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    if (user?.userType === 'employer') {
        return <EmployerDashboard user={user} />;
    }

    if (user?.userType === 'admin') {
        // Optional: Redirect to admin if landing here, though /admin route exists
        // For now, let's just show a link or redirect
        // window.location.href = '/admin'; 
        // But better to just handle 'employer' and 'job_seeker' (default) here
    }

    // Default to Job Seeker Dashboard
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
                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {/* Widget 1: Progress & Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <ApplicationProgress stats={appStats} completion={user?.profileCompletion || 0} />
                    </motion.div>

                    {/* Widget 2: Recommended Jobs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <RecommendedJobs />
                    </motion.div>

                    {/* Widget 3: Followed Companies */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <FollowedCompanies />
                    </motion.div>
                </motion.div>

                {/* Recent Activity Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                >
                    <RecentActivity activities={activities} />
                </motion.div>


            </main>
        </div>
    );
};

export default DashboardPage;
