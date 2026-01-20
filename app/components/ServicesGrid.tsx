'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Globe,
  Smartphone,
  Building2,
  GraduationCap,
  Truck,
  ShoppingCart,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { Section, SectionHeader } from './ui/Section';

const services = [
  {
    title: 'Web Applications',
    description: 'Custom web apps built with Next.js and React for scalability and performance.',
    icon: Globe,
    href: '/services#web-application-development',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Mobile Apps',
    description: 'Cross-platform iOS and Android apps with React Native.',
    icon: Smartphone,
    href: '/services#mobile-app-development',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Enterprise Systems',
    description: 'Comprehensive business solutions for operations and growth.',
    icon: Building2,
    href: '/services#enterprise-software-solutions',
    color: 'bg-primary-50 text-primary-600',
  },
  {
    title: 'School Management',
    description: 'Offline-first systems with mobile money integration for African schools.',
    icon: GraduationCap,
    href: '/services#school-management-systems',
    color: 'bg-green-50 text-green-600',
  },
  {
    title: 'Fleet Tracking',
    description: 'Real-time vehicle monitoring for logistics and microfinance.',
    icon: Truck,
    href: '/services#fleet-vehicle-management',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'E-commerce',
    description: 'Online stores with local payment methods and inventory management.',
    icon: ShoppingCart,
    href: '/services#ecommerce-solutions',
    color: 'bg-pink-50 text-pink-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ServicesGrid() {
  return (
    <Section variant="gray" id="services">
      <SectionHeader
        subtitle="What We Do"
        title="Software Solutions Built for African Markets"
        description="We specialize in creating technology that works in challenging environments - offline-first, mobile money ready, and designed for local needs."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {services.map((service) => (
          <motion.div key={service.title} variants={itemVariants}>
            <Link href={service.href} className="block group">
              <div className="card card-hover p-6 h-full">
                <div
                  className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                >
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-primary-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <div className="flex items-center text-primary-800 text-sm font-medium group-hover:text-accent-600 transition-colors">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-12"
      >
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-primary-800 font-medium hover:text-accent-600 transition-colors"
        >
          View all services
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </Section>
  );
}
