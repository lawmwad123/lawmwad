'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';

export default function HeroSection() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-40" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />

      {/* Floating Shapes */}
      <motion.div
        className="absolute top-32 right-[20%] w-16 h-16 border-2 border-primary-200 rounded-xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-32 left-[15%] w-12 h-12 bg-accent-100 rounded-full"
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-[10%] w-8 h-8 border-2 border-accent-300 rounded-lg rotate-45"
        animate={{
          rotate: [45, 90, 45],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-800">
                Software Solutions for Africa
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="heading-1 mb-6">
              Building Technology That{' '}
              <span className="text-gradient-accent">Works</span>{' '}
              for African Businesses
            </h1>

            {/* Description */}
            <p className="body-lg mb-8 max-w-xl">
              From school management systems to fleet tracking, we create offline-first
              applications with mobile money integration that power businesses across Africa.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/projects">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  View Our Work
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex gap-8 mt-12 pt-8 border-t border-surface-200"
            >
              <div>
                <div className="text-3xl font-bold text-primary-900">50+</div>
                <div className="text-sm text-gray-500">Projects Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-900">10+</div>
                <div className="text-sm text-gray-500">Industries Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-900">98%</div>
                <div className="text-sm text-gray-500">Client Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Visual Container */}
            <div className="relative">
              {/* Browser Window Mockup */}
              <div className="bg-white rounded-2xl shadow-soft-xl border border-surface-200 overflow-hidden">
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-surface-100 border-b border-surface-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-white rounded-lg text-xs text-gray-400 border border-surface-200">
                      schooladmin.africa
                    </div>
                  </div>
                </div>
                {/* Browser Content */}
                <div className="p-6 bg-gradient-to-br from-primary-50 to-surface-100 aspect-[4/3]">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    <div className="col-span-2 space-y-4">
                      <div className="h-8 bg-primary-800 rounded-lg w-3/4" />
                      <div className="h-4 bg-surface-300 rounded w-full" />
                      <div className="h-4 bg-surface-300 rounded w-5/6" />
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="h-24 bg-white rounded-xl shadow-soft border border-surface-200" />
                        <div className="h-24 bg-white rounded-xl shadow-soft border border-surface-200" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-32 bg-white rounded-xl shadow-soft border border-surface-200" />
                      <div className="h-20 bg-accent-100 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-soft-lg p-4 border border-surface-200"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary-900">Offline Ready</div>
                    <div className="text-xs text-gray-500">Works without internet</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-soft-lg p-4 border border-surface-200"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                    <span className="text-accent-600 text-lg">💰</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary-900">Mobile Money</div>
                    <div className="text-xs text-gray-500">M-Pesa, MTN, Airtel</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToProjects}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 hover:text-primary-800 transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs font-medium">Scroll to explore</span>
        <ChevronDown className="w-5 h-5" />
      </motion.button>
    </section>
  );
}
