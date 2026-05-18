import React from 'react';

const TestimonialPanel = () => {
    return (
        <div
            className="hidden lg:flex flex-col relative h-full p-8 justify-end bg-cover bg-center group"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlWdDJhu8Z7s0oQ6J-ddKtOFNhjzI1iKmfZsQ2Fdo4qW8ilrODXrw7llHo_glyOfUA8I7sSPOXRZrxSahvroTIb4jy4YsWNCPESpUBehrC2hlSikvxmDfI9pVubWcQ-YE-l9-miJULeXz-1BO0DGt7dqisE2rMg1MXjAvNlVvR3SX9toFsP1aMzn_xPJP3yo2Nm_fiTJbiVp8OpwEz3Pb_PYV6EXBZqFtrweX_WVavTnoKO6QdEseyW83rVrzin-2Ih-U1qWDY68s')" }}
        >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#191022] via-[#191022]/50 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-lg">
                    <div className="flex gap-1 text-primary mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="material-symbols-outlined text-[20px] fill-current">star</span>
                        ))}
                    </div>
                    <p className="text-white text-lg font-medium leading-relaxed italic mb-4">
                        "This platform completely transformed how we hire top talent. The interface is stunning and the matching AI is incredibly precise."
                    </p>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-cover bg-center border border-white/20"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJSgjDn_CBN9rmsn54kDzn94ErUBXqJT038p_XAKEGhAWg9z-tQ_r8RvJpXKFafSL2J54uF_CvyW8fM4fGC6XhMd1j4vnpPnN2VChzDNpTPaNS7oLBAPaf2D1JAb_DwtPx_u0InixDSKgA27X6F8W_DCQcpABOhtIbjFLp-F8uO-XOa6Zio7gr_-bbzcLPb4ps-UcxbwLe9-mwKTmQ0PWARffbp8GNEb4_BmQ2t5v-_tTWDB7zjt-qP0HBSXSSFd8leeYdCPT8KQs')" }}
                        ></div>
                        <div>
                            <p className="text-white text-sm font-semibold">Sarah Jenkins</p>
                            <p className="text-white/60 text-xs">VP of HR, TechFlow</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialPanel;
