import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../api/config';

const JobDetailView = ({ job, isSaved, onToggleSave }) => {
    const navigate = useNavigate();
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    // Reset applied state when the selected job changes
    React.useEffect(() => {
        setHasApplied(false);
    }, [job?._id]);

    if (!job) return null;

    const handleApply = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please log in to apply");
            navigate('/login');
            return;
        }
        navigate(`/apply?jobId=${job._id}`);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please log in to save jobs");
                return;
            }

            const res = await fetch(`${API_URL}/users/saved-jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ jobId: job._id })
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error saving job:", error);
        }
    };

    const handleMessage = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please log in to message the recruiter");
            return;
        }

        if (job.postedBy) {
            navigate('/messages', { state: { startChatWith: job.postedBy } });
        } else {
            // Fallback if no postedBy (shouldn't happen with new seed)
            alert("This job post doesn't have a linked recruiter profile.");
        }
    };

    return (
        <div className="glass-panel w-full h-full rounded-2xl overflow-hidden flex flex-col relative border border-white/10 shadow-2xl">
            {/* Reduced banner height from h-32 to h-20 */}
            <div className="h-20 w-full bg-gradient-to-r from-purple-900/60 to-indigo-900/60 relative border-b border-white/5">
                <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'0.1\\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
            </div>
            <div className="px-8 pb-8 flex-1 overflow-y-auto -mt-10 z-10 custom-scrollbar">
                <div className="flex justify-between items-end mb-6">
                    <div className="flex items-end gap-5">
                        {/* Adjusted icon size to integrate better with the shorter banner */}
                        <div className={`size-16 rounded-xl ${job.logoBg || 'bg-white'} flex items-center justify-center shadow-lg border-2 border-[#161618] overflow-hidden`}>
                            {job.companyLogo && job.companyLogo !== '#' && job.companyLogo !== '' ? (
                                <img 
                                    src={job.companyLogo} 
                                    alt={job.company} 
                                    className="w-full h-full object-contain p-1" 
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <span 
                                className={`material-symbols-outlined ${job.logoColor || 'text-black'} text-3xl`}
                                style={{ display: job.companyLogo && job.companyLogo !== '#' ? 'none' : 'block' }}
                            >
                                {job.icon}
                            </span>
                        </div>
                        <div className="mb-1">
                            <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                            <div className="flex items-center gap-2 text-primary font-medium">
                                {job.company}
                                <span className="material-symbols-outlined text-sm">verified</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-1">
                        <button
                            onClick={onToggleSave}
                            className={`size-10 rounded-lg border flex items-center justify-center transition-all ${isSaved
                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                }`}
                            title={isSaved ? "Remove from saved" : "Save Job"}
                        >
                            <span className={`material-symbols-outlined ${isSaved ? 'fill-1' : ''}`}>bookmark</span>
                        </button>
                        <button className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-gray-300">share</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                        <span className="material-symbols-outlined text-lg text-gray-400">work</span>
                        {job.type || 'Full-time'}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                        <span className="material-symbols-outlined text-lg text-gray-400">signal_cellular_alt</span>
                        Senior Level
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                        <span className="material-symbols-outlined text-lg text-gray-400">location_on</span>
                        {job.location} (Worldwide)
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                        <span className="material-symbols-outlined text-lg text-green-400">payments</span>
                        {job.salary} USD
                    </div>
                </div>

                <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
                    {job.description ? (
                        <div dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} />
                    ) : (
                        <>
                            <section>
                                <h3 className="text-white font-bold text-lg mb-3">About the Role</h3>
                                <p>We are looking for a visionary {job.title} to join our {job.company} team. You will be responsible for defining the user experience across our digital products, ensuring they are not only functional but visually stunning and intuitive. This role requires a strong understanding of our core principles, a collaborative mindset, and the ability to thrive in a fast-paced environment.</p>
                            </section>
                            <section>
                                <h3 className="text-white font-bold text-lg mb-3">Key Responsibilities</h3>
                                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                    <li>Lead design projects from concept to launch.</li>
                                    <li>Collaborate with engineers and product managers to define product direction.</li>
                                    <li>Create high-fidelity prototypes and design systems.</li>
                                    <li>Conduct user research and usability testing.</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-white font-bold text-lg mb-3">Requirements</h3>
                                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                    <li>5+ years of experience in product design.</li>
                                    <li>Strong portfolio showcasing web and mobile apps.</li>
                                    <li>Proficiency in Figma, Prototyping, and Design Systems.</li>
                                    <li>Ability to work in a fast-paced, remote environment.</li>
                                </ul>
                            </section>
                        </>
                    )}

                    <section className="mt-8 pt-6 border-t border-white/5">
                        <h3 className="text-white font-bold text-lg mb-4">Benefits & Perks</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-sm">health_and_safety</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">Comprehensive Health</h4>
                                    <p className="text-xs text-gray-400 mt-1">100% covered medical, dental, and vision insurance.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-sm">flight_takeoff</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">Unlimited PTO</h4>
                                    <p className="text-xs text-gray-400 mt-1">Take the time you need to recharge and relax.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-sm">home_work</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">Remote First</h4>
                                    <p className="text-xs text-gray-400 mt-1">Work from anywhere in the supported regions.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-sm">fitness_center</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">Wellness Stipend</h4>
                                    <p className="text-xs text-gray-400 mt-1">$100/mo for gym, meditation, or health apps.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="mt-8 pt-6 border-t border-white/5 pb-10">
                        <h3 className="text-white font-bold text-lg mb-3">About {job.company}</h3>
                        <p>At {job.company}, we are building the future of work. Our mission is to empower professionals by providing them with the tools and opportunities they need to succeed in a digital-first world. We value transparency, continuous learning, and a passion for craftsmanship.</p>
                    </section>
                </div>

                <div className="mt-8 pt-6 flex items-center justify-between border-t border-white/10 relative z-20">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Applicants</span>
                        <div className="flex -space-x-2 mt-1">
                            <div className="size-6 rounded-full bg-gray-600 border border-[#171719]"></div>
                            <div className="size-6 rounded-full bg-gray-500 border border-[#171719]"></div>
                            <div className="size-6 rounded-full bg-gray-400 border border-[#171719] flex items-center justify-center text-[8px] text-black font-bold">+12</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).userType === 'employer' ? (
                            <button
                                onClick={() => navigate('/employer-dashboard?tab=jobs')}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(140,43,238,0.4)] transition-all"
                            >
                                Post a Similar Job
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleMessage}
                                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all"
                                >
                                    Message
                                </button>
                                <button
                                    onClick={handleApply}
                                    disabled={isApplying || hasApplied}
                                    className={`px-8 py-3 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 ${hasApplied
                                        ? 'bg-green-500 cursor-not-allowed opacity-80'
                                        : 'bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(219,39,119,0.4)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                >
                                    {isApplying ? 'Applying...' : hasApplied ? 'Applied' : 'Apply Now'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailView;
