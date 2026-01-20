'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  Linkedin,
  Twitter,
  Github,
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'lawmwadtechug@gmail.com',
    href: 'mailto:lawmwadtechug@gmail.com',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+256 781 236 221',
    href: 'https://wa.me/+256781236221',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+256 745 033 924',
    href: 'tel:+256745033924',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Kampala, Uganda',
    href: '#',
    color: 'bg-orange-50 text-orange-600',
  },
];

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/company/lawmwad-technologies/', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
              Get in Touch
            </Badge>
            <h1 className="heading-1 mb-4">
              Let's Build Something <span className="text-gradient-accent">Amazing</span> Together
            </h1>
            <p className="body-lg">
              Have a project in mind? We'd love to hear about it. Get in touch and let's
              discuss how we can help bring your ideas to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <Section>
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="card p-8">
              <h2 className="heading-3 mb-6">Send us a Message</h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="heading-4 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
                    }}
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">Select a subject</option>
                        <option value="project">New Project Inquiry</option>
                        <option value="consultation">Free Consultation</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="support">Support Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your project or inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-5 h-5" />}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-4 flex items-center gap-4 hover:shadow-soft-lg transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{item.label}</div>
                    <div className="font-medium text-primary-900">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Response Time */}
            <div className="card p-6 bg-accent-50 border-accent-200">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-primary-900 mb-1">Quick Response</h3>
                  <p className="text-sm text-gray-600">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="card p-6">
              <h3 className="font-medium text-primary-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-gray-500 hover:text-primary-800 hover:bg-surface-200 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/+256781236221"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="card p-6 bg-green-600 text-white hover:bg-green-700 transition-colors">
                <div className="flex items-center gap-4">
                  <MessageCircle className="w-8 h-8" />
                  <div>
                    <div className="font-semibold">Prefer WhatsApp?</div>
                    <div className="text-sm text-green-100">Chat with us instantly</div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section variant="gray">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-2 text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: 'How long does a typical project take?',
                a: 'Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex enterprise systems can take 3-6 months. We\'ll provide a detailed timeline after understanding your requirements.',
              },
              {
                q: 'Do you work with international clients?',
                a: 'Yes! While we\'re based in Uganda, we work with clients globally. We use modern collaboration tools and are flexible with time zones.',
              },
              {
                q: 'What technologies do you specialize in?',
                a: 'We primarily work with Next.js, React, React Native, Node.js, PostgreSQL, and various mobile money APIs. We choose the best technology stack based on your project needs.',
              },
              {
                q: 'Do you provide ongoing support?',
                a: 'Absolutely. We offer maintenance packages and ongoing support for all projects we build. Your success is our priority.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <h3 className="font-semibold text-primary-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
