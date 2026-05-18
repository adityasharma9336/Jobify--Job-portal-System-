import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchJobById } from '../api/jobs';
import API_URL from '../api/config';

const ApplyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const jobId = searchParams.get('jobId');

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        github: '',
        portfolio: ''
    });
    const [userProfile, setUserProfile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!jobId) {
            navigate('/jobs');
            return;
        }

        const loadData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Load Job
                const jobData = await fetchJobById(jobId);
                setJob(jobData);

                // Load User for pre-fill
                if (token) {
                    const userRes = await fetch(`${API_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setUserProfile(userData);
                        setFormData(prev => ({
                            ...prev,
                            fullName: userData.name || '',
                            email: userData.email || '',
                            phone: userData.phone || ''
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [jobId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please log in to submit your application");
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_URL}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobId,
                    ...formData
                })
            });

            if (response.ok) {
                alert("Application submitted successfully!");
                navigate('/applications');
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to submit application");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-r-transparent"></div>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="min-h-screen py-12 px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto glass-panel p-8 rounded-3xl relative z-10 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className={`size-16 rounded-2xl ${job.logoBg || 'bg-white'} flex items-center justify-center shrink-0`}>
                        <span className={`material-symbols-outlined ${job.logoColor || 'text-black'} text-3xl`}>{job.icon}</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">Apply for {job.title}</h1>
                        <p className="text-primary font-bold text-lg">{job.company}</p>
                    </div>
                </div>

                {userProfile && (
                    <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-400">Profile Completion</span>
                            <span className="text-xs font-bold text-primary">{userProfile.profileCompletion}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${userProfile.profileCompletion}%` }}
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                            ></motion.div>
                        </div>
                        {userProfile.profileCompletion < 100 && (
                            <p className="text-[10px] text-gray-500 mt-2">
                                Tip: Complete your profile to increase your chances of being hired.
                                <Link to="/profile" className="text-primary hover:underline ml-1">Complete now</Link>
                            </p>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 ml-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 ml-1">GitHub / Portfolio Link</label>
                            <input
                                type="url"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                placeholder="https://github.com/username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Cover Letter</label>
                        <textarea
                            name="coverLetter"
                            rows="6"
                            value={formData.coverLetter}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                            placeholder="Tell us why you're a great fit for this role..."
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Resume / CV</label>
                        <div
                            onClick={triggerFileUpload}
                            className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group"
                        >
                            <span className="material-symbols-outlined text-4xl text-gray-500 mb-3 group-hover:text-primary transition-colors">
                                {selectedFile ? 'task' : 'cloud_upload'}
                            </span>
                            <p className="text-sm text-gray-400">
                                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX (Max 5MB)'}
                            </p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.docx"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-4 px-6 rounded-2xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-[2] py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-[0_0_20px_rgba(219,39,119,0.4)] transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyPage;
