'use client';

import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Rocket, Bot, Star, Users } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import CircuitBackground from './CircuitBackground';
import GlowingBorder from './GlowingBorder';

const stats = [
  { id: 1, name: 'Projects Delivered', value: '200+', icon: Rocket, color: 'text-blue-400' },
  { id: 2, name: 'AI Models Deployed', value: '50+', icon: Bot, color: 'text-purple-400' },
  { id: 3, name: 'Client Satisfaction', value: '98%', icon: Star, color: 'text-yellow-400' },
  { id: 4, name: 'Team Experts', value: '45+', icon: Users, color: 'text-green-400' },
];

export default function TechStats() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      <CircuitBackground />
      
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),theme(colors.gray.900))] opacity-20" />
      
      {/* Tech circuit lines */}
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900/10 ring-1 ring-white/10 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6 }}
              onAnimationComplete={() => setHasAnimated(true)}
            >
              <GlowingBorder className="inline-block mb-8">
                <div className="relative">
                  <div className="absolute -inset-x-2 -inset-y-4">
                    <div className="mx-auto h-full w-full rotate-180 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
                  </div>
                  <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    Driving Innovation Through Technology
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-gray-300">
                    Our impact in numbers showcases our commitment to technological excellence
                  </p>
                </div>
              </GlowingBorder>
            </motion.div>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-4 overflow-hidden text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlowingBorder>
                  <div className="relative">
                    {/* Tech-inspired decorative elements */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-blue-500/30"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-blue-500/30"></div>
                    
                    <div className="space-y-4">
                      <div className={`${stat.color} flex justify-center`}>
                        <stat.icon className="h-10 w-10" />
                      </div>
                      <dt className="text-sm font-semibold leading-6 text-gray-300">{stat.name}</dt>
                      <dd className="text-3xl font-semibold tracking-tight text-white">
                        {hasAnimated && (
                          <AnimatedCounter 
                            value={stat.value} 
                            duration={2 + index * 0.2} 
                          />
                        )}
                      </dd>
                    </div>
                  </div>
                </GlowingBorder>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 