import React from 'react';
import ContactListItem from '@/components/molecules/ContactListItem';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RecentContactsSection = ({ contacts, initialDelay }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: initialDelay }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-semibold text-gray-900">
                    Recent Contacts
                </h3>
                <Button
                    onClick={() => navigate('/contacts')}
                    className="text-primary hover:text-secondary transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    View All
                </Button>
            </div>

            {contacts.length === 0 ? (
                <div className="text-center py-8">
                    <ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No contacts yet</p>
                    <Button
                        onClick={() => navigate('/contacts')}
                        className="gradient-button text-white px-4 py-2 rounded-lg text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Add Contact
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {contacts.map((contact, index) => (
                        <ContactListItem
                            key={contact.id}
                            contact={contact}
                            delay={initialDelay + 0.2 + index * 0.1}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default RecentContactsSection;