'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Section, SectionHeader } from './ui/Section';
import { testimonials } from '@/lib/testimonials';

export default function Testimonials() {
  return (
    <Section variant="gray">
      <SectionHeader
        subtitle="Testimonials"
        title="What Our Clients Say"
        description="Don't just take our word for it - hear from some of the businesses we've helped transform."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.slice(0, 3).map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card p-6 relative"
          >
            {/* Quote Icon */}
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center">
              <Quote className="w-5 h-5 text-white" />
            </div>

            {/* Rating */}
            {testimonial.rating && (
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />
                ))}
              </div>
            )}

            {/* Content */}
            <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-surface-200">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-primary-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
