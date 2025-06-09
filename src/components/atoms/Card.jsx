import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', initial, animate, transition, ...props }) => {
    return (
        <motion.div
            initial={initial}
            animate={animate}
            transition={transition}
            className={`bg-white border border-gray-200 p-6 rounded-lg shadow-sm ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;