'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap, Sparkles, Target, Lightbulb, Rocket, Battery, Smartphone, Laptop } from 'lucide-react';

const techElements = [
  { icon: Zap, delay: 0, color: 'text-yellow-400' },
  { icon: Sparkles, delay: 0.2, color: 'text-purple-400' },
  { icon: Target, delay: 0.4, color: 'text-red-400' },
  { icon: Lightbulb, delay: 0.6, color: 'text-yellow-300' },
  { icon: Rocket, delay: 0.8, color: 'text-blue-400' },
  { icon: Battery, delay: 1, color: 'text-green-400' },
  { icon: Smartphone, delay: 1.2, color: 'text-indigo-400' },
  { icon: Laptop, delay: 1.4, color: 'text-gray-400' },
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
  const [positions, setPositions] = useState<Array<{ left: number; top: number }>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate deterministic positions per mount to avoid SSR/client mismatch
    const generated = techElements.map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
    }));
    setPositions(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" suppressHydrationWarning>
      {mounted && positions.length === techElements.length && techElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.color} opacity-10`}
          style={{
            left: `${positions[index].left}%`,
            top: `${positions[index].top}%`,
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
          <element.icon className="h-8 w-8" />
        </motion.div>
      ))}
    </div>
  );
}