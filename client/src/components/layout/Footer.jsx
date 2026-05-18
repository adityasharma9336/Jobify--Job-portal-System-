import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-white/5 bg-[#0f0f11] py-16 px-6 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <div className="size-8 bg-gradient-to-br from-primary to-purple-900 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[18px]">diamond</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Jobify<span className="text-primary font-light">Portal</span></span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        The premium job portal for elite talent. Find your next career move with AI-powered matching.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors"><i className="fab fa-linkedin"></i></a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors"><i className="fab fa-github"></i></a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Platform</h4>
                    <ul className="flex flex-col gap-3 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-primary transition-colors">Find Jobs</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Browse Companies</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Salaries</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Post a Job</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Company</h4>
                    <ul className="flex flex-col gap-3 text-sm text-gray-500">
                        <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
                        <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Legal</h4>
                    <ul className="flex flex-col gap-3 text-sm text-gray-500">
                        <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                        <li><Link to="/legal" className="hover:text-primary transition-colors">Legal Overview</Link></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                <p>© 2026 Jobify Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-gray-400 transition-colors">Support</a>
                    <a href="#" className="hover:text-gray-400 transition-colors">Sitemap</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
