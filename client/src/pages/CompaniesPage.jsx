import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompanyCard from '../components/companies/CompanyCard';
import { fetchCompanies } from '../api/companies';

const filterOptions = {
    Industry: ["Information Technology", "Healthcare IT", "Financial Services", "Retail & E-commerce", "Cloud Computing", "Other"],
    "Company Size": ["1-50", "51-200", "201-500", "501-1000", "1001-5000"],
    Location: ["San Francisco", "Boston", "Singapore", "Chicago", "Remote", "London"],
    Funding: ["Bootstrapped", "Seed", "Series A", "Series B", "Series C", "Public"],
    "Remote Friendly": ["true", "false"]
};

// Custom Dropdown Component
const FilterDropdown = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full ${value ? 'bg-primary/20 text-primary border border-primary/30' : 'glass-panel hover:bg-white/10 text-gray-300'} text-sm font-medium hover:text-white transition-all`}
            >
                <span className="material-symbols-outlined text-lg">category</span>
                {value || label}
                <span className="material-symbols-outlined text-lg">
                    {isOpen ? 'expand_less' : 'expand_more'}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-12 left-0 w-48 bg-jobify-light border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        <ul className="py-2">
                            <li
                                onClick={() => { onChange(''); setIsOpen(false); }}
                                className="px-4 py-2 hover:bg-white/5 cursor-pointer text-sm text-gray-300 text-left"
                            >
                                Any {label}
                            </li>
                            {options.map((opt) => (
                                <li
                                    key={opt}
                                    onClick={() => { onChange(opt); setIsOpen(false); }}
                                    className={`px-4 py-2 hover:bg-white/5 cursor-pointer text-sm ${value === opt ? 'text-primary font-bold bg-white/5' : 'text-gray-300'} text-left`}
                                >
                                    {opt === 'true' && label === 'Remote Friendly' ? 'Yes' : opt === 'false' && label === 'Remote Friendly' ? 'No' : opt}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CompaniesPage = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [keyword, setKeyword] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        industry: '',
        companySize: '',
        location: '',
        funding: '',
        remoteFriendly: ''
    });

    const loadCompanies = async () => {
        setLoading(true);
        try {
            // Map the semantic filter names back to backend parameters
            const params = {};
            if (keyword) params.keyword = keyword;
            if (activeFilters.industry) params.industry = activeFilters.industry;
            if (activeFilters.companySize) params.companySize = activeFilters.companySize;
            if (activeFilters.location) params.location = activeFilters.location;
            if (activeFilters.funding) params.funding = activeFilters.funding;
            if (activeFilters.remoteFriendly) params.remoteFriendly = activeFilters.remoteFriendly;

            const data = await fetchCompanies(params);
            setCompanies(data);
        } catch (error) {
            console.error("Failed to load companies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompanies();
    }, [activeFilters]); // Reload when filters change

    const handleSearch = (e) => {
        e.preventDefault();
        loadCompanies();
    };

    const handleClearAll = () => {
        setKeyword('');
        setActiveFilters({
            industry: '',
            companySize: '',
            location: '',
            funding: '',
            remoteFriendly: ''
        });
    };

    const hasActiveFilters = Object.values(activeFilters).some(v => v !== '') || keyword !== '';

    return (
        <div className="min-h-screen bg-jobify text-white font-display relative overflow-hidden">
            {/* Background Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
                <div className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">

                {/* Hero Section */}
                <div className="flex flex-col gap-4 mb-10 text-center md:text-left">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black tracking-tight text-white"
                    >
                        {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).userType === 'employer' ? 'Industry Landscape' : 'Browse Companies'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl"
                    >
                        {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).userType === 'employer' 
                            ? 'Explore industry leaders and benchmark your company against the global Jobify ecosystem.'
                            : 'Discover top-tier organizations and find your next career move within the Jobify ecosystem.'}
                    </motion.p>
                </div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <form onSubmit={handleSearch} className="flex w-full h-16 items-center rounded-2xl glass-panel p-1 focus-within:border-primary/50 transition-colors">
                        <div className="flex items-center justify-center px-5 text-gray-500">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full bg-transparent border-none text-white focus:ring-0 text-lg placeholder:text-gray-600"
                            placeholder="Search by company name, industry, or technology stack..."
                        />
                        <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 h-14 rounded-xl font-bold transition-all ml-1 shadow-lg shadow-primary/20">
                            Search
                        </button>
                    </form>
                </motion.div>

                {/* Filter Chips */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-3 mb-12 items-center relative z-20"
                >
                    <FilterDropdown
                        label="Industry"
                        options={filterOptions.Industry}
                        value={activeFilters.industry}
                        onChange={(val) => setActiveFilters({ ...activeFilters, industry: val })}
                    />
                    <FilterDropdown
                        label="Company Size"
                        options={filterOptions['Company Size']}
                        value={activeFilters.companySize}
                        onChange={(val) => setActiveFilters({ ...activeFilters, companySize: val })}
                    />
                    <FilterDropdown
                        label="Location"
                        options={filterOptions.Location}
                        value={activeFilters.location}
                        onChange={(val) => setActiveFilters({ ...activeFilters, location: val })}
                    />
                    <FilterDropdown
                        label="Funding"
                        options={filterOptions.Funding}
                        value={activeFilters.funding}
                        onChange={(val) => setActiveFilters({ ...activeFilters, funding: val })}
                    />
                    <FilterDropdown
                        label="Remote Friendly"
                        options={filterOptions['Remote Friendly']}
                        value={activeFilters.remoteFriendly === 'true' ? 'Yes' : activeFilters.remoteFriendly === 'false' ? 'No' : ''}
                        onChange={(val) => setActiveFilters({ ...activeFilters, remoteFriendly: val })}
                    />

                    {hasActiveFilters && (
                        <>
                            <div className="h-8 w-[1px] bg-white/10 mx-2 self-center hidden sm:block"></div>
                            <button
                                onClick={handleClearAll}
                                className="text-primary hover:underline text-sm font-semibold px-2"
                            >
                                Clear all
                            </button>
                        </>
                    )}
                </motion.div>

                {/* Company Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-r-transparent"></div>
                        </div>
                    ) : companies.length > 0 ? (
                        companies.map((company, index) => (
                            <CompanyCard key={company._id} company={company} index={index} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 glass-panel rounded-2xl">
                            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">domain_disabled</span>
                            <h3 className="text-2xl font-bold text-white mb-2">No Companies Found</h3>
                            <p className="text-gray-400 max-w-md mx-auto">We couldn't find any companies matching your exact filters. Try adjusting your search criteria or clearing filters.</p>
                            <button
                                onClick={handleClearAll}
                                className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CompaniesPage;
