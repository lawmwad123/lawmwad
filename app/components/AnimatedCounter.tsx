'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 2 }: AnimatedCounterProps) {
  const [targetNumber, setTargetNumber] = useState(0);
  const [suffix, setSuffix] = useState('');

  useEffect(() => {
    // Parse the value string to separate number and suffix (e.g., "200+" -> 200 and "+")
    const match = value.match(/(\d+)(\D*)/);
    if (match) {
      setTargetNumber(parseInt(match[1]));
      setSuffix(match[2]);
    }
  }, [value]);

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    spring.set(targetNumber);
  }, [spring, targetNumber]);

  const display = useTransform(spring, (current) => Math.floor(current));

  return (
    <div className="flex items-center justify-center">
      <motion.span>{display}</motion.span>
      <span>{suffix}</span>
    </div>
  );
} 