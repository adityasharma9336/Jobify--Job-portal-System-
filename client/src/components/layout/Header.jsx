import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path || (location.pathname === '/employer-dashboard' && path === '/dashboard');

    const navLinks = user ? [
        { name: 'Home', path: '/' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'Resume Builder', path: '/resume-builder' },
        { name: 'Job Alerts', path: '/job-alerts' },
        { name: 'Career Tips', path: '/career-tips' },
        { name: 'Companies', path: '/companies' },
    ] : [
        { name: 'Home', path: '/' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'Companies', path: '/companies' },
        { name: 'Features', path: '/features' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4
            ${isScrolled ? 'bg-[#0f0f12]/95 backdrop-blur-xl border-b border-white/10 shadow-lg py-3' : 'bg-transparent'}`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Left: Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(140,43,238,0.3)]">
                        <span className="material-symbols-outlined text-white text-2xl">diamond</span>
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">
                        Jobify<span className="text-primary font-light">Portal</span>
                    </span>
                </Link>

                {/* Center: Nav Links (Desktop) */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.path}
                            className={`relative text-sm font-medium transition-all duration-300 py-1
                            ${isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            {link.name}
                            {isActive(link.path) && (
                                <motion.div 
                                    layoutId="nav-underline"
                                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-4 relative z-10">
                    {user ? (
                        <>
                            {/* Icons Group */}
                            <div className="hidden sm:flex items-center gap-2 mr-2">
                                <Link to="/messages" className="text-gray-400 hover:text-white transition-colors relative group">
                                    <span className="material-symbols-outlined">chat_bubble</span>
                                    <span className="absolute -top-1 -right-1 size-2 bg-primary rounded-full"></span>
                                </Link>
                                <Link to="/notifications" className="text-gray-400 hover:text-white transition-colors relative group">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute -top-1 -right-1 size-2 bg-secondary rounded-full"></span>
                                </Link>
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 hover:opacity-80 transition-all group"
                                >
                                    <div className="size-9 rounded-full bg-gray-700 overflow-hidden border border-white/10">
                                        <img src={user.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className={`material-symbols-outlined text-gray-500 text-[20px] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-3 w-48 bg-[#1c1723] border border-white/10 rounded-xl shadow-xl overflow-hidden"
                                        >
                                            <div className="p-3 border-b border-white/5">
                                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <div className="p-1">
                                                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">
                                                    <span className="material-symbols-outlined text-[18px]">person</span> Profile
                                                </Link>
                                                <Link to="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">
                                                    <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                                                </Link>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/5">
                                                    <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign In</Link>
                            <Link to="/signup" className="px-5 py-2 rounded-lg bg-primary hover:bg-purple-600 text-white text-sm font-bold transition-all shadow-md">
                                Join Now
                            </Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden size-10 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10"
                    >
                        <span className="material-symbols-outlined">
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden mt-4 overflow-hidden bg-[#0f0f12]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl"
                    >
                        <div className="p-4 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all
                                    ${isActive(link.path) ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span className="material-symbols-outlined">{link.icon}</span>
                                    <span className="font-bold">{link.name}</span>
                                </Link>
                            ))}
                            {!user && (
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <Link to="/login" className="h-14 rounded-2xl border border-white/10 flex items-center justify-center text-white font-bold">Sign In</Link>
                                    <Link to="/register" className="h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold">Join Now</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
