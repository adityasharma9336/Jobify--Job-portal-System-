import React from 'react';

const AboutSection = () => {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 mb-24 relative" id="about">
            <div className="glass-panel rounded-3xl p-8 md:p-16 border border-white/10 overflow-hidden relative">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                            <span className="text-xs font-bold text-primary tracking-wide uppercase">About Jobify</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                            Redefining how <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">talent meets opportunity.</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            We are not just another job board. Jobify is an AI-powered ecosystem designed to connect elite talent with forward-thinking companies.
                            Our platform filters through the noise to bring you opportunities that match your skills, values, and career aspirations.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-white font-bold text-lg">
                                    <span className="material-symbols-outlined text-primary">verified</span>
                                    Verified Jobs
                                </div>
                                <p className="text-sm text-gray-500">Every listing is vetted for authenticity and quality.</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-white font-bold text-lg">
                                    <span className="material-symbols-outlined text-primary">smart_toy</span>
                                    AI Matching
                                </div>
                                <p className="text-sm text-gray-500">Smart algorithms to find your perfect fit instantly.</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-white font-bold text-lg">
                                    <span className="material-symbols-outlined text-primary">lock</span>
                                    Privacy First
                                </div>
                                <p className="text-sm text-gray-500">Your data is encrypted and shared only when you apply.</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-white font-bold text-lg">
                                    <span className="material-symbols-outlined text-primary">rocket_launch</span>
                                    Career Growth
                                </div>
                                <p className="text-sm text-gray-500">Tools and insights to fast-track your promotion.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2670&auto=format&fit=crop"
                                alt="Team collaboration"
                                className="w-full h-auto opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-transparent"></div>
                        </div>

                        {/* Floating Widget 1 */}
                        <div className="absolute -left-8 -bottom-8 glass-panel p-4 rounded-xl flex items-center gap-4 border border-white/10 shadow-xl z-20 hidden md:flex animate-float">
                            <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                <span className="material-symbols-outlined">work</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Jobs Posted</p>
                                <p className="text-xl font-bold text-white">12,450+</p>
                            </div>
                        </div>

                        {/* Floating Widget 2 */}
                        <div className="absolute -right-8 top-12 glass-panel p-4 rounded-xl flex items-center gap-4 border border-white/10 shadow-xl z-20 hidden md:flex animate-float-delayed">
                            <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <span className="material-symbols-outlined">person_add</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">New Users</p>
                                <p className="text-xl font-bold text-white">850+ <span className="text-xs text-green-400 font-normal">/ day</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
