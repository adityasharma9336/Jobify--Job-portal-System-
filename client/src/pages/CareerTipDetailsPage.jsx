import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const CareerTipDetailsPage = () => {
    const { id } = useParams();
    const [tip, setTip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTip = async () => {
            try {
                const res = await fetch(`/api/tips/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTip(data);
                }
            } catch (error) {
                console.error("Failed to fetch tip:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTip();
    }, [id]);

    if (loading) {
        return (
            <div className="bg-jobify text-white min-h-screen flex flex-col font-display">
                <Header />
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-gray-400">Loading tip...</div>
                </div>
            </div>
        );
    }

    if (!tip) {
        return (
            <div className="bg-jobify text-white min-h-screen flex flex-col font-display">
                <Header />
                <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
                    <h1 className="text-3xl font-bold mb-4">Tip not found</h1>
                    <Link to="/career-tips" className="text-primary hover:text-white transition-colors">← Back to Career Tips</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-jobify text-white min-h-screen flex flex-col font-display relative">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
                <div className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
            </div>
            
            <Header />

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-24 relative z-10">
                <Link to="/career-tips" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    Back to all tips
                </Link>

                <article className="glass-panel rounded-3xl overflow-hidden border border-white/10">
                    <div className="relative h-64 md:h-96 w-full">
                        <img src={tip.image} alt={tip.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/50 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold mb-4 inline-block">
                                {tip.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black text-white">{tip.title}</h1>
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span className="material-symbols-outlined text-[18px]">person</span>
                                {tip.author}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                {tip.date}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-primary">
                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                                {tip.readTime}
                            </div>
                        </div>

                        {tip.videoUrl && (
                            <div className="mb-10 w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
                                <iframe 
                                    className="w-full h-full"
                                    src={tip.videoUrl} 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}

                        <div 
                            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-white"
                            dangerouslySetInnerHTML={{ __html: tip.content }}
                        />
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default CareerTipDetailsPage;
