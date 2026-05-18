import React from 'react';
import { Link } from 'react-router-dom';

const JobSearchHeader = () => {
    return (
        <header className="glass-nav sticky top-0 z-50 w-full px-6 py-4 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-gradient-to-br from-primary to-purple-900 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(140,43,238,0.4)]">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>diamond</span>
                    </div>
                    <Link to="/" className="text-xl font-bold tracking-tight text-white">Jobify<span className="text-primary font-light">Portal</span></Link>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/jobs" className="text-sm font-medium text-white transition-colors relative group">
                        Find Jobs
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transition-all"></span>
                    </Link>
                    <a className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group" href="#">
                        Companies
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </a>
                    <a className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group" href="#">
                        Salaries
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </a>
                </nav>
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-2 mr-4 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                        <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
                        <input className="bg-transparent border-none text-sm text-white placeholder-gray-500 focus:ring-0 p-0 w-32 outline-none" placeholder="UI Designer" type="text" />
                    </div>
                    <button className="size-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative">
                        <span className="material-symbols-outlined text-gray-300">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-secondary rounded-full border border-[#121214]"></span>
                    </button>
                    <div className="size-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10 overflow-hidden cursor-pointer">
                        <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwfElHtPNst8Rm9LSR8AJawqKuTMT2UgxDh522sli5WatRLRHgrCDuCwckiMQvUUEtx_mgfIB2NFtSiORcb9O_E2Hwh-lZDlwBUdW-C9teaLOrgqHLpWTfVgAfPWCaWTXNyTkCb2Ly8QT1h4_ABLKeMa2_axOcQf85zZifLg0J3eWRxSCrnURWnYdxHMwTxyE7W2M0M9_ORoFvhORq4gTB3qEWOu4l21JdgeJ9D8jeXJVmww4CSjLIFL0xk-koixNPW9D09uNJzVY" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default JobSearchHeader;
