import React, { useState, useEffect } from 'react';
import { fetchCompanies } from '../../api/companies';
import { useNavigate } from 'react-router-dom';

const CompanySectorGroups = () => {
    const [sectors, setSectors] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const data = await fetchCompanies();
                const grouped = data.reduce((acc, company) => {
                    const sector = company.industry || 'Other';
                    if (!acc[sector]) acc[sector] = [];
                    acc[sector].push(company);
                    return acc;
                }, {});
                setSectors(grouped);
            } catch (error) {
                console.error("Failed to load companies by sector", error);
            } finally {
                setLoading(false);
            }
        };
        loadCompanies();
    }, []);

    if (loading || Object.keys(sectors).length === 0) return null;

    return (
        <div className="mb-8 w-full">
            <h2 className="text-xl font-bold text-white mb-4">Explore Companies by Sector</h2>
            <div className="flex flex-col gap-6">
                {Object.entries(sectors).map(([sector, companies]) => (
                    <div key={sector} className="glass-panel p-5 rounded-2xl border border-white/5">
                        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">{sector}</h3>
                        <div className="flex overflow-x-auto gap-4 custom-scrollbar pb-2">
                            {companies.map((company) => (
                                <div 
                                    key={company._id} 
                                    onClick={() => navigate(`/jobs?company=${company.name}`)}
                                    className="min-w-[140px] flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10"
                                >
                                    <div className="size-12 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                                        {company.logo && company.logo !== '#' && company.logo !== '' ? (
                                            <img 
                                                src={company.logo} 
                                                alt={company.name} 
                                                className="w-full h-full object-contain p-1" 
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : null}
                                        <span 
                                            className="material-symbols-outlined text-black" 
                                            style={{ display: company.logo && company.logo !== '#' ? 'none' : 'block' }}
                                        >
                                            {company.icon || 'domain'}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-white truncate w-full text-center">{company.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanySectorGroups;
