'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowingBorderProps {
  children: ReactNode;
  className?: string;
}

export default function GlowingBorder({ children, className = '' }: GlowingBorderProps) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
      
      {/* Tech-inspired corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-500"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-500"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-500"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-purple-500"></div>
      
      {/* Content */}
      <div className="relative bg-gray-900 p-6 rounded-lg">
        {children}
      </div>
      
      {/* Animated glow effect */}
      <div className="absolute -inset-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent rounded-lg group-hover:via-blue-500/20 transition-all duration-1000 -z-10"></div>
    </motion.div>
  );
} 