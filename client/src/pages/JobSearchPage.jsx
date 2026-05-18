import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import JobFilterBar from '../components/search/JobFilterBar';
import JobSearchCard from '../components/search/JobSearchCard';
import JobDetailView from '../components/search/JobDetailView';
import CompanySectorGroups from '../components/search/CompanySectorGroups';
import { fetchJobs } from '../api/jobs';

const JobSearchPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [filters, setFilters] = useState({});
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    // Reset filters and fetch saved jobs when location changes (e.g. new search)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const initialFilters = {};
        if (searchParams.get('category')) initialFilters['Category'] = searchParams.get('category');
        if (searchParams.get('keyword')) initialFilters['keyword'] = searchParams.get('keyword');
        if (searchParams.get('location')) initialFilters['location'] = searchParams.get('location');
        if (searchParams.get('type')) initialFilters['Job Type'] = searchParams.get('type');

        setFilters(initialFilters);
        fetchSavedJobIds();
    }, [location.search]);

    const fetchSavedJobIds = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch('/api/users/saved-jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSavedJobIds(new Set(data.map(job => job._id)));
            }
        } catch (error) {
            console.error("Error fetching saved job IDs:", error);
        }
    };

    const toggleSave = async (jobId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('/api/users/saved-jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ jobId })
            });
            if (res.ok) {
                const data = await res.json();
                setSavedJobIds(prev => {
                    const next = new Set(prev);
                    if (data.saved) next.add(jobId);
                    else next.delete(jobId);
                    return next;
                });
            }
        } catch (error) {
            console.error("Error toggling save:", error);
        }
    };

    useEffect(() => {
        const loadJobs = async () => {
            setLoading(true);
            try {
                const searchParams = new URLSearchParams(location.search);
                const params = {};

                // Map state-based filters to API params
                if (filters.keyword) params.keyword = filters.keyword;
                if (filters.location) params.location = filters.location;
                if (filters['Job Type']) params.type = filters['Job Type'];
                if (filters['Salary Range']) params.salary = filters['Salary Range'];
                if (filters['Experience Level']) params.experience = filters['Experience Level'];
                if (filters['Date Posted']) params.datePosted = filters['Date Posted'];
                if (filters['Category']) params.category = filters['Category'];

                if (searchParams.get('company')) params.company = searchParams.get('company');

                const data = await fetchJobs(params);
                setJobs(data);

                const urlJobId = searchParams.get('selectedJobId');

                if (data.length > 0) {
                    if (urlJobId && data.find(j => j._id === urlJobId)) {
                        setSelectedJobId(urlJobId);
                    } else if (!selectedJobId || !data.find(j => j._id === selectedJobId)) {
                        setSelectedJobId(data[0]._id);
                    }
                } else {
                    setSelectedJobId(null);
                }
            } catch (error) {
                console.error("Failed to load jobs", error);
            } finally {
                setLoading(false);
            }
        };
        loadJobs();
    }, [location.search, filters]);

    const handleFilterChange = (filterName, option) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: option
        }));
    };

    const selectedJob = jobs.find(job => job._id === selectedJobId) || (jobs.length > 0 ? jobs[0] : null);

    return (
        <div className="flex flex-col h-[calc(100vh-112px)] pt-[20px] pb-4 bg-transparent text-white font-display overflow-hidden relative">
            <JobFilterBar filters={filters} onFilterChange={handleFilterChange} />

            <main className="flex-1 w-full max-w-[1400px] mx-auto grid grid-cols-12 gap-6 px-6 pt-6 pb-2 overflow-hidden">
                {/* Left Column - Job List */}
                <div className="col-span-12 lg:col-span-5 flex flex-col h-full overflow-hidden">
                    <div className="mb-4 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-lg font-semibold text-white">
                            {loading ? 'Searching...' : user?.userType === 'employer' ? `Market Insights: ${jobs.length} Jobs` : `${jobs.length} Jobs Found`}
                        </h2>
                        {user?.userType === 'employer' ? (
                            <Link to="/employer-dashboard?tab=jobs" className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-lg border border-primary/30 font-bold hover:bg-primary/30 transition-all">
                                Manage My Jobs
                            </Link>
                        ) : (
                            <div className="text-xs text-gray-500">Showing 1-{jobs.length}</div>
                        )}
                    </div>
                    <div className="flex-grow overflow-y-auto pr-2 pb-20 custom-scrollbar">
                        {Object.keys(filters).length === 0 && <CompanySectorGroups />}
                        {loading ? (
                            <div className="text-center text-gray-400 py-10">Loading jobs...</div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center text-gray-400 py-10">No jobs found matching your criteria.</div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {jobs.map((job, index) => (
                                    <div key={job._id}>
                                        <JobSearchCard
                                            job={job}
                                            isSelected={selectedJobId === job._id}
                                            isSaved={savedJobIds.has(job._id)}
                                            onClick={() => setSelectedJobId(job._id)}
                                            onToggleSave={() => toggleSave(job._id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Job Details */}
                <div className="hidden lg:flex col-span-7 h-full flex-col overflow-hidden pb-4">
                    {selectedJob ? (
                        <div className="h-full relative">
                            {user?.userType === 'employer' && (
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="glass-panel px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-gray-400">
                                        Market View Mode
                                    </div>
                                </div>
                            )}
                            <JobDetailView
                                job={selectedJob}
                                isSaved={savedJobIds.has(selectedJob._id)}
                                onToggleSave={() => toggleSave(selectedJob._id)}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 glass-panel rounded-2xl border border-white/5 p-8 text-center">
                            <span className="material-symbols-outlined text-4xl mb-4 opacity-20">search_check</span>
                            <p className="max-w-xs">Select a job to view details and market benchmarks</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default JobSearchPage;


