import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API_URL from '../api/config';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/posts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setPosts(data);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content: newPostContent })
            });

            if (res.ok) {
                const savedPost = await res.json();
                setPosts([savedPost, ...posts]);
                setNewPostContent('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Create Post */}
            <div className="glass-card rounded-xl p-4">
                <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                        A
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Start a post..."
                            className="w-full bg-black/30 hover:bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                            rows="3"
                        />
                        <div className="flex items-center justify-between mt-3 px-2">
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium px-2 py-1 rounded hover:bg-white/5">
                                    <span className="material-symbols-outlined text-[20px] text-blue-400">image</span>
                                    <span className="hidden sm:inline">Media</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors text-sm font-medium px-2 py-1 rounded hover:bg-white/5">
                                    <span className="material-symbols-outlined text-[20px] text-amber-400">calendar_month</span>
                                    <span className="hidden sm:inline">Event</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium px-2 py-1 rounded hover:bg-white/5">
                                    <span className="material-symbols-outlined text-[20px] text-red-400">article</span>
                                    <span className="hidden sm:inline">Article</span>
                                </button>
                            </div>
                            <button
                                onClick={handlePostSubmit}
                                disabled={!newPostContent.trim()}
                                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-1.5 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(140,43,238,0.4)] hover:shadow-[0_0_20px_rgba(140,43,238,0.6)]"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed Component */}
            <div className="space-y-6">
                {posts.map((post) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={post._id}
                        className="glass-card rounded-xl overflow-hidden"
                    >
                        <div className="p-4 flex gap-3 items-start">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                                {post.author.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-white hover:text-primary hover:underline cursor-pointer">{post.author.name}</h4>
                                        <p className="text-xs text-gray-400">{post.author.title} • {new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-white">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>
                                <div className="mt-3 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </div>
                            </div>
                        </div>

                        {post.media && (
                            <div className="w-full h-64 bg-gray-800 bg-cover bg-center relative group cursor-pointer" style={{ backgroundImage: `url('${post.media}')` }}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                            </div>
                        )}

                        <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-400 border-b border-white/5">
                            <div className="flex items-center gap-1">
                                <div className="flex -space-x-1">
                                    <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center"><span className="material-symbols-outlined text-[10px] text-white">thumb_up</span></div>
                                    <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center"><span className="material-symbols-outlined text-[10px] text-white">favorite</span></div>
                                </div>
                                <span className="hover:text-primary hover:underline cursor-pointer ml-1">{post.likes.length} others</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="hover:text-primary hover:underline cursor-pointer">{post.comments.length} comments</span>
                            </div>
                        </div>

                        <div className="px-2 py-1 flex items-center justify-between">
                            <button className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-400 hover:bg-white/5 hover:text-primary rounded-lg transition-all group">
                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">thumb_up</span>
                                <span className="text-sm font-medium">Like</span>
                            </button>
                            <button className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-400 hover:bg-white/5 hover:text-primary rounded-lg transition-all group">
                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">comment</span>
                                <span className="text-sm font-medium">Comment</span>
                            </button>
                            <button className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-400 hover:bg-white/5 hover:text-primary rounded-lg transition-all group">
                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">autorenew</span>
                                <span className="text-sm font-medium">Repost</span>
                            </button>
                            <button className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-400 hover:bg-white/5 hover:text-primary rounded-lg transition-all group">
                                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">send</span>
                                <span className="text-sm font-medium">Send</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Feed;
