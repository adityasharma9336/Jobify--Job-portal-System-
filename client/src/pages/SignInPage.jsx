import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API_URL from '../api/config';

const SignInPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'job_seeker'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));

                if (data.userType === 'admin') {
                    navigate('/admin');
                } else if (data.userType === 'employer') {
                    navigate('/employer-dashboard');
                } else {
                    const from = location.state?.from?.pathname || '/dashboard';
                    navigate(from);
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        const email = window.prompt(`Enter your ${provider} email to login:`, `user@${provider.toLowerCase()}.com`);
        if (!email) return;

        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${API_URL}/auth/social-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name: email.split('@')[0],
                    userType: formData.userType,
                    provider
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                
                if (data.userType === 'employer') {
                    navigate('/employer-dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(data.message || 'Social login failed');
            }
        } catch (err) {
            setError('Social login service unavailable. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0f0c13] dark:bg-[#0f0c13] min-h-screen flex flex-col font-display antialiased selection:bg-primary/30 selection:text-white relative overflow-hidden">
            {/* Background Glow Orb */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[60px] pointer-events-none rounded-full opacity-60 z-0"></div>

            <main className="relative flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
                {/* Glassmorphic Card */}
                <div className="w-full max-w-[480px] rounded-2xl p-8 sm:p-10 flex flex-col gap-8 relative overflow-hidden bg-white/[0.03] backdrop-blur-[30px] border border-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(140,43,238,0.1)]">
                    {/* Subtle Top Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

                    {/* Header Section */}
                    <div className="flex flex-col gap-3 text-center">
                        {/* Optional Brand Icon */}
                        <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center shadow-lg shadow-primary/20 mb-2">
                            <span className="material-symbols-outlined text-white" style={{ fontSize: '28px' }}>diamond</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base font-medium">
                            Enter your details to access your workspace
                        </p>
                    </div>

                    {location.state?.message && (
                        <div className="bg-primary/20 border border-primary/50 text-white text-sm p-3 rounded-lg text-center">
                            {location.state.message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* Form Section */}
                    <div className="flex flex-col gap-6">
                        {/* User Type Toggle */}
                        <div className="bg-white/5 p-1 rounded-xl flex relative mb-2">
                            <button 
                                onClick={() => setFormData(prev => ({...prev, userType: 'job_seeker'}))}
                                className={`flex-1 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 ${formData.userType === 'job_seeker' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                            >
                                Job Seeker
                            </button>
                            <button 
                                onClick={() => setFormData(prev => ({...prev, userType: 'employer'}))}
                                className={`flex-1 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 ${formData.userType === 'employer' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                            >
                                Employer
                            </button>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-3 gap-3">
                            <button 
                                type="button" 
                                onClick={() => handleSocialLogin('Google')}
                                className="flex items-center justify-center gap-2 h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 group"
                            >
                                <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPzpjmDktcbPT-QRl5j6m-NGr24vA7NLiEJ80sYBxk7QEDvnaNtD70XxrHJJahEaYtogdyuc6TAquftDRkqXAz4iQXvY84FCaXKqY9YTq1k3lLUZeWCyYCyMDiARJ647biBY_sYQlKTL7kpivrlMbr3VQg-tUZWhQ_KuQfJQ1x_5STAt3Vw3wfnEsQHFTNyVdnVr3vwNRrPUbQMBNT7kuKRNI2vSNHI8Ekrp6FnzJJC4rkNcP8tX88ag9c6MXWYH-thf8oF2DPQY4" />
                                <span className="text-xs font-medium text-white/90 group-hover:text-white">Google</span>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleSocialLogin('LinkedIn')}
                                className="flex items-center justify-center gap-2 h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 group"
                            >
                                <svg className="w-5 h-5 fill-white/90 group-hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                                </svg>
                                <span className="text-xs font-medium text-white/90 group-hover:text-white">LinkedIn</span>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleSocialLogin('Instagram')}
                                className="flex items-center justify-center gap-2 h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 group"
                            >
                                <svg className="w-5 h-5 fill-white/90 group-hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.28.058 1.688.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                                </svg>
                                <span className="text-xs font-medium text-white/90 group-hover:text-white">IG</span>
                            </button>
                        </div>

                        <div className="relative flex items-center gap-4">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Or continue with email</span>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>

                        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
                        {/* Email Field */}
                        <div className="flex flex-col gap-2 group">
                            <label className="text-gray-300 text-sm font-semibold ml-1" htmlFor="email">Email</label>
                            <div className="bg-white/5 border border-white/10 transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_10px_rgba(140,43,238,0.3)] focus-within:bg-white/[0.08] rounded-xl flex items-center px-4 h-14 relative overflow-hidden">
                                <span className="material-symbols-outlined text-gray-500 mr-3">mail</span>
                                <input
                                    autoComplete="email"
                                    className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-base p-0 h-full !outline-none"
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2 group">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-gray-300 text-sm font-semibold" htmlFor="password">Password</label>
                            </div>
                            <div className="bg-white/5 border border-white/10 transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_10px_rgba(140,43,238,0.3)] focus-within:bg-white/[0.08] rounded-xl flex items-center px-4 h-14 relative overflow-hidden">
                                <span className="material-symbols-outlined text-gray-500 mr-3">lock</span>
                                <input
                                    className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-base p-0 h-full !outline-none"
                                    id="password"
                                    placeholder="Enter your password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={onChange}
                                    required
                                />
                                <button
                                    className="text-gray-500 hover:text-white transition-colors focus:outline-none ml-2"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                            <div className="flex justify-end mt-1">
                                <a className="text-sm font-medium text-primary hover:text-white transition-colors" href="#">
                                    Forgot Password?
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="mt-2 relative w-full h-12 rounded-xl bg-gradient-to-r from-[#8c2bee] to-[#c026d3] text-white font-bold text-base tracking-wide shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center overflow-hidden group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <span className="z-10 flex items-center gap-2">
                                {isLoading ? 'Signing In...' : 'Sign In'}
                                {!isLoading && <span className="material-symbols-outlined text-sm font-bold group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>}
                            </span>
                        </button>
                        </form>
                    </div>

                    {/* Footer Section */}
                    <div className="text-center pt-2">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?
                            <Link to="/signup" className="text-white font-bold hover:text-primary hover:underline underline-offset-4 transition-all ml-1">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Background decorative elements for depth */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-purple-900 rounded-full mix-blend-screen filter blur-[50px] opacity-20 animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-fuchsia-900 rounded-full mix-blend-screen filter blur-[60px] opacity-20 pointer-events-none"></div>
            </main>
        </div>
    );
};

export default SignInPage;
