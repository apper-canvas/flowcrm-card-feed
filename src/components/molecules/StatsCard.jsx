import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatsCard = ({ title, value, icon, iconClassName, cardClassName, delay }) => {
    const isGradient = cardClassName?.includes('gradient-card');
    const titleColorClass = isGradient ? 'text-purple-100' : 'text-gray-600';
    const valueColorClass = isGradient ? 'text-white' : 'text-gray-900';

    return (
        <Card
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className={cardClassName}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${titleColorClass}`}>{title}</p>
                    <p className={`text-3xl font-bold ${valueColorClass}`}>{value}</p>
                </div>
                <ApperIcon name={icon} className={`w-8 h-8 ${iconClassName}`} />
            </div>
        </Card>
    );
};

export default StatsCard;