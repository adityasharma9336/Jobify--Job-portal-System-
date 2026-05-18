import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';

const SettingsPage = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        title: '',
        bio: '',
        location: '',
        avatar: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(prev => ({
                        ...prev,
                        name: data.name || '',
                        email: data.email || '',
                        title: data.title || '',
                        bio: data.bio || '',
                        location: data.location || '',
                        avatar: data.avatar || ''
                    }));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

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

            <main className="flex-1 p-6 lg:p-10 h-screen overflow-y-auto relative z-10 custom-scrollbar">
                <DashboardHeader />

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Settings & Customization</h1>

                    <div className="glass-panel p-8 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="size-24 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
                                <img
                                    alt="User Avatar"
                                    className="rounded-full w-full h-full object-cover border-4 border-jobify"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxg8nzXPI6m-eaa-74Gg22-NTimMKyx93yQ3UTen92_m9McpgQ7tg-LW1WHzYQZZXSUM8BNupo5Z9QVJtsR-F3Ojxp3u5anK73QhNDHutqXxVmOBBfmLIVQ_3r5_zx_uT3VFyPmtBWmghbvtVleQpenQFw9i3R-3VXbApoSgZI4ceEohF_vv76kKRBntyA_tC7hgXs9Qon9sc63hmD4Cfs6VmyiyCiYazN5I6gwwPTDgq-uN4L4k8Uh6jd6pkEqlFWXX8q-1waaBo"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{user.name || 'User Name'}</h3>
                                <p className="text-gray-400">{user.email || 'user@example.com'}</p>
                                <button className="mt-2 text-sm text-primary hover:text-white transition-colors">Change Avatar</button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
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
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
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
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
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
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors h-32 resize-none"
                                    placeholder="Tell us a bit about yourself..."
                                />
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
