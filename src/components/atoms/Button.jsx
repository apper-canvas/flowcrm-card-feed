import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, ...motionProps }) => {
    return (
        <motion.button
            className={className}
            onClick={onClick}
            {...motionProps}
        >
            {children}
        </motion.button>
    );
};

export default Button;