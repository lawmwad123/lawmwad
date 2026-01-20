'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from './ui/Section';

const stats = [
  { value: 50, suffix: '+', label: 'Projects Delivered', description: 'Across various industries' },
  { value: 10, suffix: '+', label: 'Industries Served', description: 'From education to fintech' },
  { value: 98, suffix: '%', label: 'Client Satisfaction', description: 'Based on feedback' },
  { value: 4, suffix: '+', label: 'Years Experience', description: 'Building for Africa' },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-bold text-white">
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.span>
      <span className="text-accent-500">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  return (
    <Section variant="dark">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            <h3 className="text-lg font-semibold text-white mt-2">{stat.label}</h3>
            <p className="text-gray-400 text-sm mt-1">{stat.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
