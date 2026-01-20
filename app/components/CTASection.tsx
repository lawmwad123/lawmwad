'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from './ui/Button';

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-900" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />

      {/* Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-10" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build Something{' '}
            <span className="text-accent-400">Amazing</span>?
          </h2>

          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss your project. Whether you need a school management system,
            fleet tracking solution, or custom software, we're here to help.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                variant="accent"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Start a Project
              </Button>
            </Link>

            <a
              href="https://wa.me/+256781236221"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                leftIcon={<MessageCircle className="w-5 h-5" />}
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Chat on WhatsApp
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-sm text-gray-400 mb-4">Trusted by businesses across Africa</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              <div className="text-white font-semibold">SchoolAdmin</div>
              <div className="text-white font-semibold">Abel Motors</div>
              <div className="text-white font-semibold">Makonosi</div>
              <div className="text-white font-semibold">RYD Mental Health</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
