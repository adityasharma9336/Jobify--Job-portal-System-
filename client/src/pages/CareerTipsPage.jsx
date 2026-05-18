import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const CareerTipsPage = () => {
    const categories = ['All', 'Interview', 'Resume', 'Networking', 'Career Growth', 'Note'];
    const [activeCategory, setActiveCategory] = useState('All');

    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const res = await fetch('/api/tips');
                const data = await res.json();
                setTips(data);
            } catch (error) {
                console.error("Failed to fetch tips", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTips();
    }, []);

    const filteredTips = activeCategory === 'All' 
        ? tips 
        : tips.filter(tip => tip.category === activeCategory);

    return (
        <div className="bg-jobify text-white min-h-screen flex flex-col font-display relative">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
                <div className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
            </div>
            
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-24 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Career Tips & Advice</h1>
                    <p className="text-lg text-gray-400">Expert insights, resume strategies, and interview tips to help you land your dream job and accelerate your career.</p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                activeCategory === category 
                                ? 'bg-primary text-white shadow-[0_0_20px_rgba(140,43,238,0.4)]' 
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center text-gray-400 py-12">Loading tips...</div>
                    ) : filteredTips.map((tip) => (
                        <article 
                            key={tip._id} 
                            onClick={() => navigate(`/career-tips/${tip._id}`)}
                            className={`glass-panel rounded-3xl overflow-hidden border ${tip.category === 'Note' ? 'border-primary/50 bg-primary/5' : 'border-white/10'} group cursor-pointer hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col`}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                <img 
                                    src={tip.image} 
                                    alt={tip.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 z-20 flex gap-2">
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                        {tip.category}
                                    </span>
                                    {tip.category === 'Note' && (
                                        <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-black uppercase tracking-wider animate-pulse">
                                            Quick Read
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-3">
                                    <span className="material-symbols-outlined text-[16px]">{tip.category === 'Note' ? 'sticky_note_2' : 'schedule'}</span>
                                    {tip.readTime}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {tip.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                    {tip.excerpt}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-200">{tip.author}</span>
                                        <span className="text-xs text-gray-500">{tip.date}</span>
                                    </div>
                                    <div className="size-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <span className="material-symbols-outlined text-[18px] text-white">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Newsletter Section */}
                <div className="mt-24 glass-panel p-8 md:p-12 rounded-3xl border border-primary/20 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="material-symbols-outlined text-5xl text-primary mb-4">mail</span>
                        <h2 className="text-3xl font-black mb-4">Get Career Tips Weekly</h2>
                        <p className="text-gray-400 mb-8">Join over 50,000 professionals who get our best insights delivered straight to their inbox every Tuesday.</p>
                        <form className="flex flex-col sm:flex-row gap-3 justify-center" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                className="bg-[#1a1a1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 w-full sm:w-96"
                                required
                            />
                            <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(140,43,238,0.3)] transition-all whitespace-nowrap">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default CareerTipsPage;
