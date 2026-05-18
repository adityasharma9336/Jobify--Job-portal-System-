import React, { useState, useEffect } from 'react';
import { fetchCompanies } from '../../api/companies';

const CompaniesShowcase = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const data = await fetchCompanies();
                // Filter companies that have a logo, or just take top 6
                setCompanies(data.slice(0, 6));
            } catch (error) {
                console.error("Failed to load companies", error);
            }
        };
        loadCompanies();
    }, []);

    return (
        <section className="w-full max-w-7xl mx-auto px-6 mb-24">
            <div className="text-center mb-12">
                <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Trusted by Industry Leaders</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Join the world's most innovative teams</h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                {companies.map((company) => (
                    <div key={company._id || company.name} className="h-8 md:h-10 flex items-center justify-center cursor-pointer" title={company.name}>
                        {company.logo && company.logo !== '' && company.logo !== '#' ? (
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="h-full object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
                            />
                        ) : (
                            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                <span className={`material-symbols-outlined text-2xl`}>{company.icon || 'domain'}</span>
                                <span className="font-bold text-xl tracking-wider uppercase">{company.name}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CompaniesShowcase;
