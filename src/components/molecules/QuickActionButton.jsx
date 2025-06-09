import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickActionButton = ({
    title,
    description,
    icon,
    color,
    action,
    delay,
    containerClassName,
    iconSize = 'w-6 h-6',
    showChevron = false,
    ...motionProps
}) => {
    return (
        <Button
            onClick={action}
            className={containerClassName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            {...motionProps}
        >
            <div className={`${color} p-3 rounded-lg`}>
                <ApperIcon name={icon} className={`${iconSize} text-white`} />
            </div>
            <div className="flex-1">
                <h3 className="font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            {showChevron && <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />}
        </Button>
    );
};

export default QuickActionButton;