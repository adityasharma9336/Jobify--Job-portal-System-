import React from 'react';

const RecentActivity = ({ activities }) => {
    return (
        <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl h-full flex flex-col relative">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-transparent opacity-50"></div>
                <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
                <div className="relative border-l border-white/10 ml-3 space-y-8 pb-4">
                    {activities && activities.length > 0 ? (
                        activities.map((activity, index) => (
                            <div key={activity._id || index} className="relative pl-8">
                                <span className={`absolute -left-[9px] top-1 size-4 rounded-full bg-jobify border-2 ${activity.type === 'application' ? 'border-primary shadow-[0_0_8px_rgba(140,43,238,0.6)]' :
                                    activity.type === 'Follow' ? 'border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                                        activity.type === 'Unfollow' ? 'border-red-500' :
                                            activity.type === 'message' ? 'border-secondary' :
                                                'border-blue-500'
                                    }`}></span>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-500 font-mono">
                                        {new Date(activity.createdAt).toLocaleDateString()} {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <p className="text-sm text-white">{activity.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm ml-8">No recent activity.</p>
                    )}
                </div>
                <div className="mt-auto pt-6">
                    <button className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(140,43,238,0.4)] transition-all flex items-center justify-center gap-2">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecentActivity;
