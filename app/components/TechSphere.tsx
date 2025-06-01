'use client';

import { motion } from 'framer-motion';

export default function TechSphere() {
  return (
    <div className="relative w-96 h-96">
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
      >
        {/* Base circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="0.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Rotating circles */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="0.5"
            strokeDasharray="4,4"
          />
        </motion.g>

        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        </motion.g>

        {/* Orbital paths */}
        {[0, 60, 120].map((rotation, index) => (
          <motion.g
            key={rotation}
            animate={{ rotate: [rotation, rotation + 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <motion.circle
              cx="160"
              cy="100"
              r="4"
              fill="url(#gradient2)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, delay: index * 0.6, repeat: Infinity }}
            />
          </motion.g>
        ))}

        {/* Tech nodes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 100 + 80 * Math.cos(angle);
          const y = 100 + 80 * Math.sin(angle);
          
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="url(#gradient1)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          );
        })}

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glowing orb in the center */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-blue-500/20"
        style={{
          transform: 'translate(-50%, -50%)',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
} 