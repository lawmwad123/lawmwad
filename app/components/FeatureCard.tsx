'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  name: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  hoverBg: string;
  index: number;
}

export default function FeatureCard({
  name,
  description,
  icon,
  bgColor,
  textColor,
  borderColor,
  hoverBg,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Animated background gradient */}
      <div 
        className={`absolute inset-0 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 blur-xl ${hoverBg}`}
      />

      {/* Card content */}
      <div className={`
        relative flex flex-col rounded-2xl 
        backdrop-blur-sm border ${borderColor} 
        p-8 transition-all duration-300 
        hover:scale-[1.02] hover:shadow-2xl
        bg-opacity-10 ${bgColor}
      `}>
        {/* Tech-inspired decorative elements */}
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className={`absolute top-0 left-0 w-2 h-2 ${borderColor}`} />
          <div className={`absolute top-0 left-0 w-2 h-8 ${borderColor}`} />
          <div className={`absolute top-0 left-0 w-8 h-2 ${borderColor}`} />
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16">
          <div className={`absolute bottom-0 right-0 w-2 h-2 ${borderColor}`} />
          <div className={`absolute bottom-0 right-0 w-2 h-8 ${borderColor}`} />
          <div className={`absolute bottom-0 right-0 w-8 h-2 ${borderColor}`} />
        </div>

        {/* Icon with glowing effect */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative mb-4"
        >
          <span className={`
            text-5xl filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]
            transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]
          `}>
            {icon}
          </span>
          <div className={`
            absolute inset-0 blur-md opacity-50 
            transition-opacity duration-300 group-hover:opacity-75
            ${textColor}
          `}>
            {icon}
          </div>
        </motion.div>

        {/* Content */}
        <dt className="flex flex-col gap-y-2">
          <motion.span
            className={`text-xl font-semibold leading-7 ${textColor}`}
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {name}
          </motion.span>
        </dt>
        <dd className="mt-4 flex flex-auto flex-col">
          <p className="flex-auto text-base leading-7 text-gray-300">
            {description}
          </p>
          <p className="mt-6">
            <motion.a
              href="#"
              className={`
                text-sm font-semibold leading-6 ${textColor}
                flex items-center gap-1
                transition-colors duration-300
              `}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Learn more 
              <motion.span
                aria-hidden="true"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                →
              </motion.span>
            </motion.a>
          </p>
        </dd>

        {/* Animated tech lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.1 }}>
          <motion.line
            x1="0"
            y1="100%"
            x2="100%"
            y2="0"
            stroke={textColor}
            strokeWidth="1"
            strokeDasharray="2,4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>
    </motion.div>
  );
} 