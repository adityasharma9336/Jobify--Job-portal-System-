import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchCompanyById } from '../api/companies';
import { fetchJobs } from '../api/jobs';
import { motion } from 'framer-motion';
import JobSearchCard from '../components/search/JobSearchCard';

const CompanyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const loadCompanyAndJobs = async () => {
            try {
                const companyData = await fetchCompanyById(id);
                setCompany(companyData);

                // Fetch jobs associated with this company
                if (companyData && companyData.name) {
                    const jobsData = await fetchJobs({ company: companyData.name });
                    setJobs(jobsData);
                }

                // Fetch follow state
                fetchFollowingState();
            } catch (error) {
                console.error("Failed to fetch company details or jobs", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchFollowingState = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('/api/users/followed-companies', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setIsFollowing(data.some(c => c._id === id));
                }
            } catch (error) {
                console.error("Error fetching following state:", error);
            }
        };

        loadCompanyAndJobs();
    }, [id]);

    const toggleFollow = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch('/api/users/followed-companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ companyId: id })
            });
            if (res.ok) {
                const data = await res.json();
                setIsFollowing(data.followed);
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!company) {
        return <div className="min-h-screen flex items-center justify-center text-white">Company not found</div>;
    }

    return (
        <div className="flex-grow z-10 px-6 py-8 w-full max-w-7xl mx-auto flex flex-col gap-8">
            {/* Hero Section */}
            <section className="glass-panel rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                        <div className="size-32 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-xlg shrink-0 overflow-hidden p-4">
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random&color=fff&size=256&bold=true`;
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                            <h1 className="text-4xl font-black text-white tracking-tight">{company.name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 text-sm mt-1">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px] text-primary">location_on</span> {company.location}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600 hidden sm:block"></span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px] text-primary">link</span> {company.website}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto relative">
                        <button
                            onClick={() => setIsShareOpen(true)}
                            className="flex-1 md:flex-none h-11 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">share</span>
                            Share
                        </button>

                        <button
                            onClick={toggleFollow}
                            className={`flex-1 md:flex-none h-11 px-8 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isFollowing
                                ? 'bg-white/10 text-white border border-white/20'
                                : 'bg-primary hover:bg-purple-600 text-white shadow-[0_0_20px_rgba(140,43,238,0.25)] hover:shadow-[0_0_30px_rgba(140,43,238,0.4)]'
                                }`}>
                            <span className="material-symbols-outlined text-[20px]">{isFollowing ? 'check' : 'add'}</span>
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>

                        {company.owner && (
                            <button
                                onClick={() => navigate('/messages', { state: { startChatWith: company.owner } })}
                                className="flex-1 md:flex-none h-11 px-8 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">chat</span>
                                Message
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <div className="glass-panel rounded-xl p-1.5 flex flex-wrap gap-1">
                {['Overview', 'Jobs', 'Culture', 'Reviews'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === (tab === 'Overview' ? 'about' : tab.toLowerCase())
                            ? 'glass-tab-active text-white bg-primary/20 border-b-2 border-primary'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab} {tab === 'Jobs' && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/10 text-xs text-white">{jobs.length}</span>}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'about' && (
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="glass-panel p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    About {company.name}
                                </h2>
                                <div className="space-y-6 text-gray-300 leading-relaxed font-light text-xl mt-4">
                                    <p className="border-l-4 border-primary/30 pl-6 py-2 bg-primary/5 rounded-r-xl">{company.description}</p>

                                    {company.requirements && company.requirements.length > 0 && (
                                        <div className="mt-10">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">verified</span>
                                                Company Requirements
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {company.requirements.map((req, index) => (
                                                    <div key={index} className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                                        <span className="material-symbols-outlined text-green-400 shrink-0 text-[20px]">check_circle</span>
                                                        <span className="text-sm font-medium">{req}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                                        <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:bg-white/10 transition-colors">
                                            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-sm">rocket_launch</span>
                                                Our Mission
                                            </h3>
                                            <p className="text-sm text-gray-400">To accelerate human progress through technology and innovation at {company.name}.</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:bg-white/10 transition-colors">
                                            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-sm">visibility</span>
                                                Our Vision
                                            </h3>
                                            <p className="text-sm text-gray-400">A world where technology is accessible, sustainable, and empowering for everyone.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Prominent Jobs Call to Action on About Page */}
                            {jobs.length > 0 && (
                                <div className="glass-panel p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Interested in joining {company.name}?</h3>
                                            <p className="text-gray-400">We have {jobs.length} exciting roles waiting for you.</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('jobs')}
                                            className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(140,43,238,0.4)] transition-all flex items-center gap-2"
                                        >
                                            View {jobs.length} Openings
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.section>
                    )}

                    {activeTab === 'jobs' && (
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">work</span>
                                    Open Positions
                                </h2>
                                <span className="text-gray-400 bg-white/5 px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                                    {jobs.length} open
                                </span>
                            </div>

                            {jobs.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {jobs.map(job => (
                                        <JobSearchCard
                                            key={job._id}
                                            job={job}
                                            onClick={() => navigate(`/jobs?company=${encodeURIComponent(company.name)}&selectedJobId=${job._id}`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center">
                                    <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-3xl text-primary">work_off</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No open positions</h3>
                                    <p className="text-gray-400">Check back later or follow {company.name} to get notified when new roles open.</p>
                                </div>
                            )}
                        </motion.section>
                    )}

                    {activeTab === 'culture' && (
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-8 rounded-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-secondary">groups</span>
                                Life at {company.name}
                            </h2>

                            {company.culture && company.culture.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    {company.culture.map((item, idx) => (
                                        <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                                            <h3 className="text-white font-bold text-lg mb-2 text-primary">{item.title}</h3>
                                            <p className="text-gray-300 font-light">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 mb-8 mt-2">No cultural values publically available.</p>
                            )}

                            {company.cultureImages && company.cultureImages.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-64 md:h-96 mt-8">
                                    {company.cultureImages.map((img, idx) => {
                                        // Make the first image span 2 rows & 2 columns for a dominant visual hierarchy
                                        const isFeatured = idx === 0;
                                        return (
                                            <div
                                                key={idx}
                                                className={`rounded-xl bg-gray-800 relative overflow-hidden group ${isFeatured ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                                                    }`}
                                            >
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                    style={{ backgroundImage: `url('${img}')` }}
                                                ></div>
                                                {/* Add a subtle gradient overlay to bottom for potential captions later */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.section>
                    )}

                    {activeTab === 'reviews' && (
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-8 rounded-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-secondary">star_half</span>
                                Employee Reviews
                            </h2>
                            {company.reviews && company.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {company.reviews.map((review, idx) => (
                                        <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/5 relative">
                                            <div className="absolute top-6 right-6 flex text-yellow-400 text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="material-symbols-outlined text-[16px]">
                                                        {i < review.rating ? 'star' : 'star_outline'}
                                                    </span>
                                                ))}
                                            </div>
                                            <h4 className="text-white font-bold text-lg">{review.author}</h4>
                                            <p className="text-gray-400 text-sm mb-3">{review.role}</p>
                                            <p className="text-gray-300 font-light italic">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No reviews available yet.</p>
                            )}
                        </motion.section>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Company Stats</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary glow-icon">domain</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Company Size</p>
                                    <p className="text-white font-medium mt-0.5">{company.companySize || 'Unknown'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary glow-icon">history</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Founded</p>
                                    <p className="text-white font-medium mt-0.5">{company.foundedYear || 'Unknown'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary glow-icon">pin_drop</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Headquarters</p>
                                    <p className="text-white font-medium mt-0.5">{company.headquarters || company.location}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary glow-icon">language</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Website</p>
                                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors font-medium mt-0.5 block">{company.website}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary glow-icon">category</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Industry</p>
                                    <p className="text-white font-medium mt-0.5">{company.industry || 'Other'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {company.techStack && company.techStack.length > 0 ? (
                                company.techStack.map((tech) => (
                                    <span key={tech} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-300">{tech}</span>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">Not specified</span>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 blur-2xl rounded-full pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-lg font-bold text-white">Latest Jobs</h3>
                            <Link to="/jobs" className="text-xs text-primary hover:text-white transition-colors">View all</Link>
                        </div>
                        <div className="space-y-3 relative z-10">
                            {jobs.slice(0, 3).map(job => (
                                <Link key={job._id} to={`/jobs?company=${encodeURIComponent(company.name)}&selectedJobId=${job._id}`} className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group border border-transparent hover:border-primary/30">
                                    <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{job.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{job.location} • {job.category}</p>
                                </Link>
                            ))}
                            {jobs.length === 0 && (
                                <p className="text-sm text-gray-400">No recent jobs available.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
            {/* Share Modal Overlay */}
            {isShareOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsShareOpen(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-[#1e1e24] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-white/5">
                            <h3 className="text-xl font-bold text-white">Share Company</h3>
                            <button onClick={() => setIsShareOpen(false)} className="text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 p-1 flex items-center justify-center">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-2 flex flex-col">
                            <button onClick={() => { navigator.clipboard.writeText(window.location.href); setIsShareOpen(false); alert('Link copied to clipboard!'); }} className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white transition-colors text-left rounded-lg w-full">
                                <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px]">link</span>
                                </div>
                                Copy Link
                            </button>
                            <a href={`mailto:?subject=Check out ${company.name} on Jobify&body=Check out open roles at ${company.name}: ${window.location.href}`} className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white transition-colors w-full rounded-lg" onClick={() => setIsShareOpen(false)}>
                                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px] text-red-500">mail</span>
                                </div>
                                Gmail
                            </a>
                            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${company.name} on Jobify: ${window.location.href}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white transition-colors w-full rounded-lg" onClick={() => setIsShareOpen(false)}>
                                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px] text-green-500">forum</span>
                                </div>
                                WhatsApp
                            </a>
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white transition-colors w-full rounded-lg" onClick={() => setIsShareOpen(false)}>
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px] text-blue-500">work</span>
                                </div>
                                LinkedIn
                            </a>
                            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out open roles at ${company.name}!`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white transition-colors w-full rounded-lg" onClick={() => setIsShareOpen(false)}>
                                <div className="w-8 h-8 rounded-full bg-sky-400/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px] text-sky-400">flutter_dash</span>
                                </div>
                                Twitter / X
                            </a>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white transition-colors w-full rounded-lg" onClick={() => setIsShareOpen(false)}>
                                <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px] text-blue-600">public</span>
                                </div>
                                Facebook
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CompanyDetailsPage;
