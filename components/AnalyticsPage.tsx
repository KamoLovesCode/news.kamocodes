import React from 'react';

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="bg-white/5 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-accent-orange mb-2">{value}</div>
        <div className="text-sm text-on-surface">{label}</div>
    </div>
);

const ActivityItem: React.FC<{ icon: string; title: string; meta: string }> = ({ icon, title, meta }) => (
    <li className="flex items-center py-4 border-b border-outline last:border-b-0">
        <div className="w-10 h-10 rounded-full bg-accent-orange/20 flex items-center justify-center mr-4 shrink-0">
            <span className="material-symbols-outlined text-accent-orange text-xl">{icon}</span>
        </div>
        <div>
            <div className="font-semibold mb-1 text-on-primary">{title}</div>
            <div className="text-sm text-on-surface">{meta}</div>
        </div>
    </li>
);

const AnalyticsPage: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-on-primary mb-8">Analytics</h1>
            
            {/* Stats Overview */}
            <div className="bg-surface-dark border border-outline rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-on-primary mb-4">Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard value="1.2K" label="Visitors" />
                    <StatCard value="84%" label="Engagement" />
                    <StatCard value="3.4m" label="Avg. Time" />
                    <StatCard value="42" label="Conversions" />
                </div>
            </div>
            
            {/* Traffic Chart */}
            <div className="bg-surface-dark border border-outline rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-on-primary mb-4">Traffic Sources</h2>
                <div className="h-52 bg-white/5 rounded-lg flex items-center justify-center text-on-surface my-4">
                    <span>Traffic Chart Visualization</span>
                </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-surface-dark border border-outline rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-on-primary mb-4">Recent Activity</h2>
                <ul className="list-none">
                    <ActivityItem icon="trending_up" title="Traffic spike detected" meta="From social media campaign • 2 hours ago" />
                    <ActivityItem icon="person_add" title="New user signups increased" meta="+12% from yesterday • 5 hours ago" />
                    <ActivityItem icon="warning" title="Bounce rate alert" meta="Homepage exit rate increased • Yesterday" />
                </ul>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AnalyticsPage;