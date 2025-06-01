'use client';

import { motion } from 'framer-motion';

const techElements = [
  { icon: '⚡', delay: 0 },
  { icon: '🔮', delay: 0.2 },
  { icon: '🎯', delay: 0.4 },
  { icon: '💡', delay: 0.6 },
  { icon: '🚀', delay: 0.8 },
  { icon: '🔋', delay: 1 },
  { icon: '📱', delay: 1.2 },
  { icon: '💻', delay: 1.4 },
];

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-20, 20, -20],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {techElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.1,
            scale: 1,
            ...floatingAnimation.animate
          }}
          transition={{
            duration: 0.5,
            delay: element.delay,
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  );
} 