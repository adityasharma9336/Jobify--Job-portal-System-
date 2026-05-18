import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../api/config';

const SignUpForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        userType: 'job_seeker'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { name, email, password, userType } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        const email = window.prompt(`Enter your ${provider} email to register:`, `newuser@${provider.toLowerCase()}.com`);
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
        <div className="flex flex-col p-8 md:p-12 lg:p-16 bg-[#191022]/40 backdrop-blur-sm h-full overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-black tracking-tight text-white">Join the <span className="text-primary">Amethyst</span> Network</h1>
                <p className="text-white/50 text-sm">Already have an account? <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">Log in</Link></p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-3 mb-6">
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

            <div className="relative flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Or register with email</span>
                <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <form className="flex flex-col gap-5 flex-1" onSubmit={onSubmit}>
                {/* User Type Toggle */}
                <div className="bg-black/20 p-1 rounded-xl flex relative">
                    <label className="flex-1 relative cursor-pointer group">
                        <input
                            name="userType"
                            type="radio"
                            value="job_seeker"
                            checked={userType === 'job_seeker'}
                            onChange={onChange}
                            className="peer sr-only"
                        />
                        <div className="w-full h-9 flex items-center justify-center rounded-lg text-sm font-medium text-white/60 transition-all duration-300 peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-primary/25 z-10 relative">
                            Job Seeker
                        </div>
                    </label>
                    <label className="flex-1 relative cursor-pointer group">
                        <input
                            name="userType"
                            type="radio"
                            value="employer"
                            checked={userType === 'employer'}
                            onChange={onChange}
                            className="peer sr-only"
                        />
                        <div className="w-full h-9 flex items-center justify-center rounded-lg text-sm font-medium text-white/60 transition-all duration-300 peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-primary/25 z-10 relative">
                            Employer
                        </div>
                    </label>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <div className="group">
                        <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-white/40 text-[20px]">person</span>
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                className="w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                placeholder="Sarah Jenkins"
                                required
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">Work Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-white/40 text-[20px]">mail</span>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                placeholder="sarah@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">Create Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-white/40 text-[20px]">lock</span>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                placeholder="••••••••"
                                required
                                minLength="6"
                            />
                        </div>
                        <p className="text-[10px] text-white/40 mt-1 ml-1">Must be at least 6 characters</p>
                    </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 mt-1">
                    <input id="terms" type="checkbox" required className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-offset-[#191022] focus:ring-primary" />
                    <label htmlFor="terms" className="text-xs text-white/60 leading-relaxed">
                        I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 mt-2 bg-gradient-to-r from-primary to-[#a855f7] hover:to-[#9333ea] text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span>Creating Account...</span>
                    ) : (
                        <>
                            <span>Create Account</span>
                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default SignUpForm;
