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
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Section, SectionHeader } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { services } from '@/lib/services';

const iconMap: Record<string, React.ElementType> = {
  globe: Globe,
  smartphone: Smartphone,
  building: Building2,
  graduation: GraduationCap,
  truck: Truck,
  cart: ShoppingCart,
  cpu: Cpu,
};

const colorMap: Record<string, { bg: string; text: string; light: string }> = {
  globe: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
  smartphone: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
  building: { bg: 'bg-primary-800', text: 'text-primary-800', light: 'bg-primary-50' },
  graduation: { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50' },
  truck: { bg: 'bg-orange-600', text: 'text-orange-600', light: 'bg-orange-50' },
  cart: { bg: 'bg-pink-600', text: 'text-pink-600', light: 'bg-pink-50' },
  cpu: { bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50' },
};

export default function ServicesPageClient() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-hero pt-12 pb-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="primary" className="mb-4">
              Our Services
            </Badge>
            <h1 className="heading-1 mb-4">
              Software Solutions Built for <span className="text-gradient-accent">African Markets</span>
            </h1>
            <p className="body-lg">
              We specialize in creating technology that works in challenging environments -
              offline-first, mobile money ready, and designed for local needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <Section>
        <div className="space-y-24">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            const colors = colorMap[service.icon];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={service.id}
                id={service.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  !isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={!isEven ? 'lg:order-2' : ''}>
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${colors.light} ${colors.text} mb-6`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <h2 className="heading-2 mb-4">{service.title}</h2>
                  <p className="body-md mb-6">{service.fullDescription}</p>

                  {/* Features */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {service.features.slice(0, 6).map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <span className="text-sm font-medium text-gray-500 mb-2 block">
                      Technologies:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" size="sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link href="/contact">
                    <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Discuss Your Project
                    </Button>
                  </Link>
                </div>

                {/* Visual */}
                <div className={!isEven ? 'lg:order-1' : ''}>
                  <div className="relative">
                    <div className={`absolute inset-0 ${colors.bg} opacity-5 rounded-3xl blur-2xl`} />
                    <div className="relative bg-white rounded-2xl shadow-soft-lg border border-surface-200 p-8">
                      {/* Benefits */}
                      <h3 className="font-semibold text-primary-900 mb-4">Key Benefits</h3>
                      <div className="space-y-4">
                        {service.benefits.map((benefit, i) => (
                          <motion.div
                            key={benefit}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl"
                          >
                            <div
                              className={`w-8 h-8 rounded-lg ${colors.light} ${colors.text} flex items-center justify-center text-sm font-bold`}
                            >
                              {i + 1}
                            </div>
                            <span className="text-gray-700">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Let's discuss your requirements and find the perfect solution for your business.
          </p>
          <Link href="/contact">
            <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Get Free Consultation
            </Button>
          </Link>
        </div>
      </Section>
    </>
  );
}
