import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    // Check if we should show the footer. 
    // Usually full-screen apps like JobSearchPage might not want a footer, or maybe they do?
    // Let's include it for now.
    const isJobSearch = location.pathname === '/jobs';

    return (
        <div className="flex flex-col min-h-screen bg-jobify text-white font-display">
            <Header />
            <main className="flex-grow pt-[88px] relative z-10">
                {children}
            </main>
            {!isJobSearch && <Footer />}
        </div>
    );
};

export default Layout;
