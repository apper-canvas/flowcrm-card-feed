import React from 'react';
import StatsCard from '@/components/molecules/StatsCard';

const StatsSection = ({ statsData, formatCurrency }) => {
    const statsConfig = [
        {
            title: 'Total Contacts',
            value: statsData.totalContacts,
            icon: 'Users',
            iconClassName: 'text-purple-200',
            cardClassName: 'gradient-card text-white',
            delay: 0.1
        },
        {
            title: 'Active Deals',
            value: statsData.activeDeals,
            icon: 'TrendingUp',
            iconClassName: 'text-green-500',
            cardClassName: 'bg-white border border-gray-200',
            delay: 0.2
        },
        {
            title: 'Pipeline Value',
            value: formatCurrency ? formatCurrency(statsData.totalDealValue) : `$${statsData.totalDealValue}`,
            icon: 'DollarSign',
            iconClassName: 'text-blue-500',
            cardClassName: 'bg-white border border-gray-200',
            delay: 0.3
        },
        {
            title: 'Recent Activities',
            value: statsData.recentActivities,
            icon: 'Activity',
            iconClassName: 'text-amber-500',
            cardClassName: 'bg-white border border-gray-200',
            delay: 0.4
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsConfig.map((stat, index) => (
                <StatsCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    iconClassName={stat.iconClassName}
                    cardClassName={stat.cardClassName}
                    delay={stat.delay}
                />
            ))}
        </div>
    );
};

export default StatsSection;