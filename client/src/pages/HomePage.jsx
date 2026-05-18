import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedJobs from '../components/home/FeaturedJobs';
import CompaniesShowcase from '../components/home/CompaniesShowcase';
import AboutSection from '../components/home/AboutSection';
import PlatformFeatures from '../components/home/PlatformFeatures';

const HomePage = () => {
    return (
        <main className="flex-grow z-10 px-6 py-12 w-full max-w-7xl mx-auto flex flex-col gap-16">
            <HeroSection />
            <CategorySection />
            <PlatformFeatures />
            <FeaturedJobs />
            <CompaniesShowcase />
            <AboutSection />
        </main>
    );
};

export default HomePage;
