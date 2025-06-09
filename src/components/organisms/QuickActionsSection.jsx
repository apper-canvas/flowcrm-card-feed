import React from 'react';
import QuickActionButton from '@/components/molecules/QuickActionButton';
import { motion } from 'framer-motion';

const QuickActionsSection = ({ actions, initialDelay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: initialDelay }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
        >
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Quick Actions
            </h3>
            <div className="space-y-3">
                {actions.map((action, index) => (
                    <QuickActionButton
                        key={action.title}
                        title={action.title}
                        description={action.description}
                        icon={action.icon}
                        color={action.color}
                        action={action.action}
                        delay={initialDelay + 0.1 + index * 0.1}
                        containerClassName="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-surface transition-all duration-200"
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        iconSize="w-5 h-5"
                        showChevron={true}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default QuickActionsSection;