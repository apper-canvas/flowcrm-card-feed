import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const ContactListItem = ({ contact, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors"
        >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
<p className="font-medium text-gray-900 truncate">
                    {contact.Name || contact.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                    {contact.email}
                </p>
            </div>
            <div className="flex-shrink-0">
                {contact.tags?.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {contact.tags[0]}
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default ContactListItem;