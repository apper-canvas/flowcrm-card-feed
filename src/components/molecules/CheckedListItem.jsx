import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const CheckedListItem = ({ text }) => {
    return (
        <p className="flex items-center space-x-2">
            <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
            <span>{text}</span>
        </p>
    );
};

export default CheckedListItem;