'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import FloatingElements from './FloatingElements';
import GlowingBorder from './GlowingBorder';
import CircuitBackground from './CircuitBackground';
import TechSphere from './TechSphere';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Elements */}
      <CircuitBackground />
      <FloatingElements />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-gray-900 to-gray-900" />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mt-16 sm:mt-20 lg:mt-16">
        {/* Text Content */}
        <motion.div 
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -inset-x-2 -inset-y-4">
                <div className="mx-auto h-full w-full rotate-180 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
              </div>
              <h1 className="relative text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                Innovating Tomorrow&apos;s Technology Today
              </h1>
            </div>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-6 sm:leading-8 text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Pioneering AI solutions, cutting-edge software development, and revolutionary hardware innovations. 
              We transform ideas into reality.
            </p>
          </motion.div>

          <motion.div 
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <GlowingBorder>
              <Link 
                href="#contact"
                className="rounded-md px-5 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white w-full sm:w-auto text-center"
              >
                Get Started
              </Link>
            </GlowingBorder>
            
            <Link 
              href="#solutions"
              className="text-base sm:text-lg font-semibold leading-6 text-white hover:text-blue-400 transition-colors duration-200 flex items-center justify-center w-full sm:w-auto"
            >
              Explore Solutions <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Tech Sphere Animation */}
        <motion.div 
          className="flex-1 relative w-full lg:w-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
            {/* Animated rings - adjusted for mobile */}
            <motion.div
              className="absolute top-0 -left-2 sm:-left-4 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute -bottom-4 sm:-bottom-8 right-2 sm:right-4 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Tech sphere */}
            <div className="relative">
              <GlowingBorder className="rounded-full overflow-hidden bg-gray-900/50 backdrop-blur-sm">
                <TechSphere />
              </GlowingBorder>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.div
          className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/20 rounded-full p-1"
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-1 h-2 sm:h-3 bg-white/50 rounded-full mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
} 