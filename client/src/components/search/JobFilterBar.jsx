import React, { useState } from 'react';

const JobFilterBar = ({ filters, onFilterChange }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const filterOptions = {
        'Category': ['Engineering', 'Design', 'Marketing', 'Finance', 'Data Science', 'Product Management', 'DevOps', 'HR', 'Sales', 'IT'],
        'Job Type': ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Fresher', 'MNC', 'Remote', 'WorkFromHome', 'WalkIn'],
        'Salary Range': ['$0-$50k', '$50k-$100k', '$100k-$150k', '$150k+'],
        'Experience Level': ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
        'Date Posted': ['Last 24h', 'Last 7 days', 'Last 30 days', 'All time']
    };

    const handleDropdownClick = (filterName) => {
        setActiveDropdown(activeDropdown === filterName ? null : filterName);
    };

    const handleOptionSelect = (filterName, option) => {
        onFilterChange(filterName, option);
        setActiveDropdown(null);
    };

    return (
        <div className="border-b border-white/5 bg-[#121214]/80 backdrop-blur-md sticky top-0 z-40 w-full px-6 py-3">
            <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-4">
                {/* Search Input */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-primary/50 focus-within:bg-white/10 transition-colors flex-1 min-w-[180px] max-w-sm">
                    <span className="material-symbols-outlined text-gray-400 text-[18px]">search</span>
                    <input
                        type="text"
                        placeholder="Search by role, company"
                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
                        onChange={(e) => onFilterChange('keyword', e.target.value)}
                        value={filters['keyword'] || ''}
                    />
                </div>

                {/* Location Input */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-primary/50 focus-within:bg-white/10 transition-colors flex-[0.7] min-w-[150px] max-w-[200px]">
                    <span className="material-symbols-outlined text-gray-400 text-[18px]">location_on</span>
                    <input
                        type="text"
                        placeholder="Location"
                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
                        onChange={(e) => onFilterChange('location', e.target.value)}
                        value={filters['location'] || ''}
                    />
                </div>

                <div className="w-[1px] h-6 bg-white/10 mx-2 hidden md:block"></div>

                <div className="flex items-center gap-2 text-gray-400 text-sm pl-2">
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    <span className="hidden sm:inline">Filters</span>
                </div>
                {Object.keys(filterOptions).map((filter) => (
                    <div key={filter} className="relative group">
                        <button
                            onClick={() => handleDropdownClick(filter)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${filters[filter] ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {filters[filter] || filter}
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>

                        {activeDropdown === filter && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-[#171719] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleOptionSelect(filter, null)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Any
                                    </button>
                                    {filterOptions[filter].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleOptionSelect(filter, option)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filters[filter] === option ? 'text-primary bg-primary/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {(filters['Job Type'] || filters['Salary Range'] || filters['Experience Level'] || filters['Date Posted']) && (
                    <button
                        onClick={() => {
                            onFilterChange('Job Type', null);
                            onFilterChange('Salary Range', null);
                            onFilterChange('Experience Level', null);
                            onFilterChange('Date Posted', null);
                        }}
                        className="text-xs text-primary hover:text-white transition-colors ml-2 font-medium"
                    >
                        Clear All
                    </button>
                )}

                <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
                    <span>Sort by:</span>
                    <button className="text-white font-medium flex items-center gap-1 hover:text-primary transition-colors">
                        Relevance <span className="material-symbols-outlined text-[16px]">sort</span>
                    </button>
                </div>
            </div>

            {/* Click outside handler for dropdowns */}
            {activeDropdown && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setActiveDropdown(null)}
                ></div>
            )}
        </div>
    );
};

export default JobFilterBar;
