import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DashboardHeader = () => {
    const location = useLocation();
    const [user, setUser] = useState({ name: 'User', title: 'Job Seeker' });

    useEffect(() => {
        const syncUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };
        syncUser();
    }, [location.pathname]);

    return (
        <div className="flex flex-col mb-8 relative z-10">
            <h2 className="text-3xl font-bold text-white mb-1">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{user.name}</span>
            </h2>
            <p className="text-gray-400 text-sm">Here is what's happening with your hiring pipeline today.</p>
        </div>
    );
};

export default DashboardHeader;
