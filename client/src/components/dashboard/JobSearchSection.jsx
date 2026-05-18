import React from 'react';

const JobSearchSection = () => {
    return (
        <div className="w-full">
            {/* Filter Bar */}
            <div className="border-b border-white/5 bg-[#121214]/80 backdrop-blur-md sticky top-0 z-40 w-full px-6 py-3 mb-6 rounded-xl mt-8">
                <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm border-r border-white/10 pr-4 mr-2">
                        <span className="material-symbols-outlined">tune</span>
                        <span>Filters</span>
                    </div>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all">
                            Job Type
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                    </div>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all">
                            Salary Range
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                    </div>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all">
                            Experience Level
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                    </div>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all">
                            Date Posted
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
                        <span>Sort by:</span>
                        <button className="text-white font-medium flex items-center gap-1 hover:text-primary transition-colors">
                            Relevance <span className="material-symbols-outlined text-[16px]">sort</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="z-10 w-full max-w-[1400px] mx-auto grid grid-cols-12 gap-6 pb-2 content-height overflow-hidden">
                {/* Job List Column */}
                <div className="col-span-12 lg:col-span-5 flex flex-col h-full overflow-hidden">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">342 Jobs Found</h2>
                        <div className="text-xs text-gray-500">Showing 1-20</div>
                    </div>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-4 pb-12 custom-scrollbar">
                        {/* Job Card 1 - Active */}
                        <div className="glass-card p-5 rounded-xl cursor-pointer border-l-4 border-l-primary bg-white/[0.08] transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
                            <div className="flex gap-4 items-start relative z-10">
                                <div className="size-12 rounded-lg bg-white flex items-center justify-center shrink-0 glow-logo">
                                    <span className="material-symbols-outlined text-black text-2xl">token</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">Senior Product Designer</h3>
                                        <span className="text-xs font-medium text-gray-400 whitespace-nowrap">2h ago</span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-0.5">Jobify Corp</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">Remote</span>
                                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">Full-time</span>
                                        <span className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-medium">$120k - $160k</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Card 2 */}
                        <div className="glass-card p-5 rounded-xl cursor-pointer border-l-4 border-l-transparent hover:border-l-gray-600 hover:bg-white/[0.08] transition-all group">
                            <div className="flex gap-4 items-start">
                                <div className="size-12 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 glow-logo text-white">
                                    <span className="material-symbols-outlined text-2xl">cloud_circle</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">Lead DevOps Engineer</h3>
                                        <span className="text-xs font-medium text-gray-400 whitespace-nowrap">5h ago</span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-0.5">CloudScale Inc.</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">San Francisco, CA</span>
                                        <span className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-medium">$180k - $220k</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Card 3 */}
                        <div className="glass-card p-5 rounded-xl cursor-pointer border-l-4 border-l-transparent hover:border-l-gray-600 hover:bg-white/[0.08] transition-all group">
                            <div className="flex gap-4 items-start">
                                <div className="size-12 rounded-lg bg-pink-600 flex items-center justify-center shrink-0 glow-logo text-white">
                                    <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">Growth Marketing Manager</h3>
                                        <span className="text-xs font-medium text-gray-400 whitespace-nowrap">1d ago</span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-0.5">RocketGrowth</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">New York, NY</span>
                                        <span className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-medium">$110k - $150k</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Card 4 */}
                        <div className="glass-card p-5 rounded-xl cursor-pointer border-l-4 border-l-transparent hover:border-l-gray-600 hover:bg-white/[0.08] transition-all group">
                            <div className="flex gap-4 items-start">
                                <div className="size-12 rounded-lg bg-teal-600 flex items-center justify-center shrink-0 glow-logo text-white">
                                    <span className="material-symbols-outlined text-2xl">deployed_code</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">Backend Developer (Go)</h3>
                                        <span className="text-xs font-medium text-gray-400 whitespace-nowrap">1d ago</span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-0.5">StreamLine</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">Remote</span>
                                        <span className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-medium">$140k - $170k</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Card 5 */}
                        <div className="glass-card p-5 rounded-xl cursor-pointer border-l-4 border-l-transparent hover:border-l-gray-600 hover:bg-white/[0.08] transition-all group">
                            <div className="flex gap-4 items-start">
                                <div className="size-12 rounded-lg bg-orange-600 flex items-center justify-center shrink-0 glow-logo text-white">
                                    <span className="material-symbols-outlined text-2xl">draw</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">UX Researcher</h3>
                                        <span className="text-xs font-medium text-gray-400 whitespace-nowrap">2d ago</span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-0.5">CreativeMinds</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">Austin, TX</span>
                                        <span className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-medium">$90k - $120k</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed View Column */}
                <div className="hidden lg:flex col-span-7 h-full flex-col">
                    <div className="glass-panel w-full h-full rounded-2xl overflow-hidden flex flex-col relative border border-white/10 shadow-2xl">
                        <div className="h-32 w-full bg-gradient-to-r from-purple-900 to-indigo-900 relative">
                            <div
                                className="absolute inset-0 opacity-30 mix-blend-overlay"
                                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                            ></div>
                        </div>
                        <div className="px-8 pb-8 flex-1 overflow-y-auto -mt-10 z-10 custom-scrollbar">
                            <div className="flex justify-between items-end mb-6">
                                <div className="flex items-end gap-5">
                                    <div className="size-20 rounded-2xl bg-white flex items-center justify-center shadow-lg border-4 border-[#161618]">
                                        <span className="material-symbols-outlined text-black text-4xl">token</span>
                                    </div>
                                    <div className="mb-1">
                                        <h1 className="text-2xl font-bold text-white">Senior Product Designer</h1>
                                        <div className="flex items-center gap-2 text-primary font-medium">
                                            Jobify Corp
                                            <span className="material-symbols-outlined text-sm">verified</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mb-1">
                                    <button className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-gray-300">bookmark</span>
                                    </button>
                                    <button className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <span className="material-symbols-outlined text-gray-300">share</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-white/10">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-lg text-gray-400">work</span>
                                    Full-time
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-lg text-gray-400">signal_cellular_alt</span>
                                    Senior Level
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-lg text-gray-400">location_on</span>
                                    Remote (Worldwide)
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-lg text-green-400">payments</span>
                                    $120k - $160k USD
                                </div>
                            </div>
                            <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
                                <section>
                                    <h3 className="text-white font-bold text-lg mb-3">About the Role</h3>
                                    <p>We are looking for a visionary Senior Product Designer to join our Jobify team. You will be responsible for defining the user experience across our digital products, ensuring they are not only functional but visually stunning and intuitive.</p>
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
                            </div>
                            <div className="sticky bottom-0 mt-8 pt-6 pb-2 bg-[#171719]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Applicants</span>
                                    <div className="flex -space-x-2 mt-1">
                                        <div className="size-6 rounded-full bg-gray-600 border border-[#171719]"></div>
                                        <div className="size-6 rounded-full bg-gray-500 border border-[#171719]"></div>
                                        <div className="size-6 rounded-full bg-gray-400 border border-[#171719] flex items-center justify-center text-[8px] text-black font-bold">+12</div>
                                    </div>
                                </div>
                                <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(219,39,119,0.4)] text-white font-bold text-sm transition-all transform hover:-translate-y-0.5">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearchSection;
