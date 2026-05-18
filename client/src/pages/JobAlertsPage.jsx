import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const JobAlertsPage = () => {
    const [alerts, setAlerts] = useState([
        { id: 1, keyword: 'Frontend Developer', location: 'Remote', type: 'Full-time', active: true },
        { id: 2, keyword: 'React JS', location: 'New York, NY', type: 'Any', active: false }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newAlert, setNewAlert] = useState({ keyword: '', location: '', type: 'Full-time' });

    const toggleAlert = (id) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
    };

    const deleteAlert = (id) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const handleCreateAlert = (e) => {
        e.preventDefault();
        setAlerts([...alerts, { ...newAlert, id: Date.now(), active: true }]);
        setShowModal(false);
        setNewAlert({ keyword: '', location: '', type: 'Full-time' });
    };

    return (
        <div className="bg-jobify text-white min-h-screen flex flex-col font-display relative">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
                <div className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
            </div>
            
            <Header />

            <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-32 pb-24 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Job Alerts</h1>
                        <p className="text-gray-400">Never miss an opportunity. Get notified when relevant jobs are posted.</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(140,43,238,0.3)] transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span> Create Alert
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {alerts.map((alert) => (
                        <div key={alert.id} className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-primary/5 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-primary/10"></div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white">{alert.keyword}</h3>
                                    <div 
                                        onClick={() => toggleAlert(alert.id)}
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${alert.active ? 'bg-primary' : 'bg-gray-600'}`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${alert.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                                        {alert.location || 'Any location'}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span className="material-symbols-outlined text-[18px]">work</span>
                                        {alert.type}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative z-10 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-xs text-gray-500">{alert.active ? 'Active - Receiving emails' : 'Paused'}</span>
                                <button 
                                    onClick={() => deleteAlert(alert.id)}
                                    className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">delete</span> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {alerts.length === 0 && (
                        <div className="col-span-full py-16 text-center border border-dashed border-white/20 rounded-3xl glass-panel">
                            <div className="size-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                                <span className="material-symbols-outlined text-3xl">notifications_off</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No alerts set up</h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-6">Create a job alert to get email notifications when new jobs matching your criteria are posted.</p>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 rounded-xl transition-all"
                            >
                                Create your first alert
                            </button>
                        </div>
                    )}
                </div>

                {/* Create Alert Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="bg-[#121214] border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Create Job Alert</h2>
                            <form onSubmit={handleCreateAlert} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-400">Job Title or Keyword</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newAlert.keyword}
                                        onChange={(e) => setNewAlert({...newAlert, keyword: e.target.value})}
                                        className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" 
                                        placeholder="e.g. Frontend Developer"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-400">Location (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={newAlert.location}
                                        onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                                        className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" 
                                        placeholder="e.g. Remote, New York"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-400">Job Type</label>
                                    <select 
                                        value={newAlert.type}
                                        onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                                        className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 appearance-none"
                                    >
                                        <option value="Any">Any Type</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl font-medium bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all"
                                    >
                                        Save Alert
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default JobAlertsPage;
