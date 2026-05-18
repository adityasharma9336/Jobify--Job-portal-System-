import React, { useState, useEffect } from 'react';
import API_URL from '../../api/config';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        status: 'all',
        timeFrame: 'all'
    });
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [users, filters]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("Failed to fetch users:", data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...users];

        // Search Filter
        if (filters.search) {
            const query = filters.search.toLowerCase();
            result = result.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.userType.toLowerCase().includes(query)
            );
        }

        // Role Filter
        if (filters.role !== 'all') {
            result = result.filter(user => user.userType === filters.role);
        }

        // Status Filter
        if (filters.status !== 'all') {
            // Map UI status to backend status if needed, or assume robust matching
            if (filters.status === 'active') {
                result = result.filter(user => !user.status || user.status === 'active');
            } else {
                result = result.filter(user => user.status === filters.status);
            }
        }

        // Time Frame Filter (simplified for now)
        if (filters.timeFrame === 'last30') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            result = result.filter(user => new Date(user.createdAt) >= thirtyDaysAgo);
        }

        setFilteredUsers(result);
    };

    const handleSearchChange = (e) => {
        setFilters({ ...filters, search: e.target.value });
    };

    const handleRoleChange = () => {
        const roles = ['all', 'job_seeker', 'employer', 'admin'];
        const currentIndex = roles.indexOf(filters.role);
        const nextIndex = (currentIndex + 1) % roles.length;
        setFilters({ ...filters, role: roles[nextIndex] });
    };

    const handleStatusChange = () => {
        const statuses = ['all', 'active', 'suspended', 'pending'];
        const currentIndex = statuses.indexOf(filters.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        setFilters({ ...filters, status: statuses[nextIndex] });
    };

    const handleUpdateStatus = async (userId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Update local state
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, status: newStatus } : user
                ));
            }
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setUsers(users.filter(user => user._id !== userId));
                setSelectedUsers(selectedUsers.filter(id => id !== userId));
            }
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
    };

    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const toggleAllSelection = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(user => user._id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Filter Ribbon */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-white text-2xl font-bold tracking-tight">User Management</h1>
                    <div className="relative">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-10 glass border border-white/10 overflow-hidden">
                            <div className="text-[#ab9db9] flex border-none items-center justify-center pl-3">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="form-input flex w-full min-w-[250px] flex-1 border-none bg-transparent focus:outline-0 focus:ring-0 text-white placeholder:text-[#ab9db9] px-3 text-sm font-normal"
                                placeholder="Search users, email..."
                                value={filters.search}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 p-1">
                    <div
                        onClick={handleRoleChange}
                        className="flex items-center glass px-3 py-1.5 rounded-xl gap-2 cursor-pointer hover:bg-jobify-light transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px] text-[#ab9db9]">filter_list</span>
                        <p className="text-sm font-medium text-slate-300">
                            Role: <span className="text-white capitalize">{filters.role}</span>
                        </p>
                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </div>

                    <div
                        onClick={handleStatusChange}
                        className="flex items-center glass px-3 py-1.5 rounded-xl gap-2 cursor-pointer hover:bg-jobify-light transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px] text-[#ab9db9]">online_prediction</span>
                        <p className="text-sm font-medium text-slate-300">
                            Status: <span className="text-white capitalize">{filters.status}</span>
                        </p>
                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </div>

                    {/* Clear Filters */}
                    {(filters.role !== 'all' || filters.status !== 'all' || filters.search) && (
                        <button
                            onClick={() => setFilters({ search: '', role: 'all', status: 'all', timeFrame: 'all' })}
                            className="text-primary text-xs font-bold uppercase tracking-wider ml-auto hover:underline"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* User Data Table */}
            <div className="glass rounded-xl overflow-hidden border border-jobify-light">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading users...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-jobify-light/50 border-b border-jobify-light text-[#ab9db9]">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest w-12">
                                    <input
                                        type="checkbox"
                                        checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                        onChange={toggleAllSelection}
                                        className="rounded border-jobify-light bg-background-dark text-primary focus:ring-primary"
                                    />
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Join Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-jobify-light/50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user._id} className={`hover:bg-primary/5 transition-colors group ${selectedUsers.includes(user._id) ? 'bg-primary/5' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user._id)}
                                                onChange={() => toggleUserSelection(user._id)}
                                                className="rounded border-jobify-light bg-background-dark text-primary focus:ring-primary"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full border border-jobify-light bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-lg">{user.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-white text-sm font-bold">{user.name}</p>
                                                    <p className="text-[#ab9db9] text-xs">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border 
                                            ${user.userType === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                    user.userType === 'employer' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                                {user.userType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2 w-2 rounded-full ${user.status === 'suspended' ? 'bg-[#fa6f38]' : user.status === 'pending' ? 'bg-yellow-400' : 'bg-[#0bda73] animate-pulse'}`}></div>
                                                <span className={`text-sm font-medium ${user.status === 'suspended' ? 'text-[#fa6f38]' : user.status === 'pending' ? 'text-yellow-400' : 'text-[#0bda73]'}`}>
                                                    {user.status ? (user.status.charAt(0).toUpperCase() + user.status.slice(1)) : 'Active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-[#ab9db9]">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.status === 'suspended' ? (
                                                    <button
                                                        onClick={() => handleUpdateStatus(user._id, 'active')}
                                                        className="p-1.5 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                                                        title="Activate User"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateStatus(user._id, 'suspended')}
                                                        className="p-1.5 hover:bg-yellow-500/20 text-yellow-500 rounded-lg transition-colors"
                                                        title="Suspend User"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">block</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-1.5 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {/* Pagination (Visual Only for now) */}
                <div className="bg-jobify-light/30 px-6 py-4 flex items-center justify-between border-t border-jobify-light">
                    <p className="text-sm text-[#ab9db9]">Showing <span className="text-white font-bold">1-{filteredUsers.length}</span> of <span className="text-white font-bold">{users.length}</span> users</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 glass rounded-lg text-sm disabled:opacity-50 cursor-not-allowed">
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-bold">1</button>
                        <button className="px-3 py-1 glass rounded-lg text-sm hover:bg-jobify-light">2</button>
                        <button className="px-3 py-1 glass rounded-lg text-sm">
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bulk Actions Floating Bar */}
            {selectedUsers.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass border border-primary/30 rounded-xl flex items-center justify-between p-4 min-w-[500px] animate-fade-in z-50 shadow-2xl shadow-primary/20">
                    <div className="flex items-center gap-4">
                        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                            <span className="material-symbols-outlined text-primary text-[20px]">check_box</span>
                        </div>
                        <p className="text-sm font-medium text-white">{selectedUsers.length} users selected</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-xl text-sm font-bold bg-yellow-600/20 text-yellow-500 border border-yellow-600/30 hover:bg-yellow-600/30 transition-colors">
                            Suspend Selected
                        </button>
                        <button className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600/20 text-red-500 border border-red-600/30 hover:bg-red-600/30 transition-colors">
                            Delete Selected
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
