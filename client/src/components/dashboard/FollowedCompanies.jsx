import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FollowedCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFollowedCompanies = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('/api/users/followed-companies', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCompanies(data);
                }
            } catch (error) {
                console.error("Error fetching followed companies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowedCompanies();
    }, []);

    if (loading) return <div className="glass-panel p-6 rounded-2xl h-full flex flex-col items-center justify-center text-gray-400">Loading followed companies...</div>;

    return (
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">corporate_fare</span>
                    Following
                </h3>
                <Link to="/companies" className="text-xs text-primary hover:text-white transition-colors">Find More</Link>
            </div>

            <div className="flex flex-col gap-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {companies.length > 0 ? (
                    companies.map((company) => (
                        <Link
                            key={company._id}
                            to={`/companies/${company._id}`}
                            className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all group/item"
                        >
                            <div className="size-12 rounded-lg bg-white flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-lg">
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random&color=fff&size=128&bold=true`;
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white group-hover/item:text-primary transition-colors text-sm truncate">{company.name}</h4>
                                <p className="text-xs text-gray-500 truncate">{company.industry || 'Tech Industry'}</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-600 group-hover/item:text-primary transition-colors text-sm">arrow_forward</span>
                        </Link>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-8">
                        <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-gray-600">domain_add</span>
                        </div>
                        <p className="text-xs text-gray-500 max-w-[150px]">Follow companies to see them here and get updates.</p>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{companies.length} Companies</span>
                    <span className="flex items-center gap-1 text-green-500/80 font-medium">
                        <span className="block size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Real-time updates
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FollowedCompanies;
