import React from 'react';
import TestimonialPanel from '../components/auth/TestimonialPanel';
import SignUpForm from '../components/auth/SignUpForm';

const SignUpPage = () => {
    return (
        <div className="bg-[#f7f6f8] dark:bg-[#191022] min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-display text-white selection:bg-primary selection:text-white">
            {/* Ambient Glow Backgrounds */}
            <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#d946ef]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

            {/* Main Container */}
            <div className="w-full max-w-[1100px] z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 glass-panel rounded-2xl overflow-hidden min-h-[650px] shadow-2xl">
                <TestimonialPanel />
                <SignUpForm />
            </div>
        </div>
    );
};

export default SignUpPage;
