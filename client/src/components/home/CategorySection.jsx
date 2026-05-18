import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
    { name: 'IT', count: 'Software, Hardware, Support', icon: 'computer' },
    { name: 'Engineering', count: 'Software, Data, DevOps', icon: 'code' },
    { name: 'Design', count: 'Product, UI/UX, Graphic', icon: 'design_services' },
    { name: 'Marketing', count: 'SEO, Content, Social', icon: 'campaign' },
    { name: 'Finance', count: 'Accounting, Audit, Tax', icon: 'payments' },
    { name: 'Data Science', count: 'ML, AI, Analytics', icon: 'query_stats' },
    { name: 'Product Management', count: 'Strategy, Roadmap', icon: 'inventory_2' },
    { name: 'DevOps', count: 'CI/CD, Cloud, Infra', icon: 'cloud_circle' },
    { name: 'HR', count: 'Recruiting, People', icon: 'group' },
    { name: 'Sales', count: 'B2B, B2C, Account', icon: 'attach_money' },
];

const CategorySection = () => {
    const [showAll, setShowAll] = useState(false);
    const displayedCategories = showAll ? categories : categories.slice(0, 5);

    return (
        <section className="w-full max-w-7xl mx-auto px-6 mt-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">category</span>
                    Trending Categories
                </h2>
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-primary hover:text-white transition-colors outline-none"
                >
                    {showAll ? 'Show Less' : 'View all categories →'}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedCategories.map((cat, index) => (
                    <Link
                        key={index}
                        to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                        className="glass-panel p-6 rounded-2xl group hover:bg-white/[0.07] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(140,43,238,0.15)] flex flex-col gap-4"
                    >
                        <div className="size-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                            <span className="material-symbols-outlined text-white text-3xl group-hover:text-primary transition-colors">{cat.icon}</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                            <p className="text-sm text-gray-400">{cat.count}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
