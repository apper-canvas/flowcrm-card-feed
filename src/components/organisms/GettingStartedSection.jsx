import React from 'react';
import CheckedListItem from '@/components/molecules/CheckedListItem';
import { motion } from 'framer-motion';

const GettingStartedSection = ({ initialDelay }) => {
    const items = [
        'Import or add your first contacts',
        'Create deals and track them through your pipeline',
        'Log activities to maintain detailed customer history'
    ];
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: initialDelay }}
            className="bg-surface border border-gray-200 rounded-lg p-6"
        >
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Getting Started with FlowCRM
            </h3>
            <div className="space-y-3 text-gray-600">
                {items.map((text, index) => (
                    <CheckedListItem key={index} text={text} />
                ))}
            </div>
        </motion.div>
    );
};

export default GettingStartedSection;