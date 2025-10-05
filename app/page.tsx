'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import AOS from 'aos';
import { Mail, MessageCircle, Phone, Linkedin, Twitter, Github, GraduationCap, Building2, ShoppingCart, Wrench } from 'lucide-react';
import TechStats from './components/TechStats';
import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';
import GlowingBorder from './components/GlowingBorder';
import Header from './components/Header';

const features = [
  {
    name: 'School Management',
    description: 'Next-gen school administration system powered by AI for efficient management of students, staff, and resources. Features smart analytics and predictive insights.',
    icon: '🎓',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    hoverBg: 'bg-blue-500/20',
  },
  {
    name: 'Hospital Management',
    description: 'AI-driven healthcare management platform with real-time patient monitoring, automated scheduling, and intelligent resource allocation.',
    icon: '🏥',
    bgColor: 'bg-green-500',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/20',
    hoverBg: 'bg-green-500/20',
  },
  {
    name: 'E-Commerce Solutions',
    description: 'Smart e-commerce platform with AI-powered product recommendations, dynamic pricing, and advanced analytics for maximum conversion.',
    icon: '🛍️',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    hoverBg: 'bg-purple-500/20',
  },
  {
    name: 'IoT & Embedded Systems',
    description: 'Cutting-edge IoT solutions with real-time monitoring, smart automation, and seamless integration with existing infrastructure.',
    icon: '🔧',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/20',
    hoverBg: 'bg-orange-500/20',
  },
];

const solutions = [
  {
    title: 'AI-Powered Analytics',
    description: 'Leverage the power of artificial intelligence for data-driven decision making.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Smart Hardware Solutions',
    description: 'Custom hardware solutions integrated with cutting-edge software.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Enterprise Software',
    description: 'Scalable enterprise solutions for businesses and industries.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <main className="bg-gray-900">
      <Header />
      <Hero />
      
      {/* Tech Stats Section */}
      <section id="stats" className="mt-0">
        <TechStats />
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <GlowingBorder className="inline-block mb-8">
                <div className="relative">
                  <div className="absolute -inset-x-2 -inset-y-4">
                    <div className="mx-auto h-full w-full rotate-180 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
                  </div>
                  <h2 className="text-base font-semibold leading-7 text-blue-400">
                    Advanced Solutions
                  </h2>
                  <p className="mt-2 relative text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    Everything you need to digitize your business
                  </p>
                </div>
              </GlowingBorder>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Our comprehensive suite of solutions helps businesses transform their operations with cutting-edge technology.
              </p>
            </motion.div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature, index) => (
                <FeatureCard key={feature.name} {...feature} index={index} />
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Solutions Showcase */}
      <section id="solutions" className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-x-2 -inset-y-4">
                  <div className="mx-auto h-full w-full rotate-180 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
                </div>
                <h2 className="text-base font-semibold leading-7 text-blue-400">Our Solutions</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  Transforming Industries with Technology
                </p>
              </div>
            </motion.div>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {solutions.map((solution, index) => (
              <motion.article
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="flex flex-col items-start justify-between rounded-2xl bg-white/5 p-6 hover:bg-white/10 transition-colors"
              >
                <div className="relative w-full">
            <Image
                    src={solution.image}
                    alt={solution.title}
                    width={800}
                    height={400}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <h3 className="text-lg font-semibold leading-6 text-white">
                      {solution.title}
                    </h3>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-gray-300">
                    {solution.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        {/* Tech-inspired background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.blue.500/0.15),transparent_50%)]" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900/80 shadow-xl shadow-blue-600/10 ring-1 ring-white/10 md:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
          <div className="absolute h-full w-full bg-[radial-gradient(#0141ff_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-x-2 -inset-y-4">
                <div className="mx-auto h-full w-full rotate-180 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Get in Touch
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                Ready to revolutionize your business with cutting-edge technology?
              </p>
            </motion.div>

            {/* Contact Options */}
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Email Contact */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50 blur transition duration-200 group-hover:opacity-75" />
                <a
                  href="mailto:lawmwad@gmail.com"
                  className="relative flex flex-col items-center justify-center gap-4 rounded-lg bg-gray-900 p-6 transition duration-200 hover:bg-gray-800"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-blue-400"
                  >
                    <Mail className="h-8 w-8" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Us</h3>
                    <p className="mt-1 text-sm text-gray-300">lawmwad@gmail.com</p>
                  </div>
                </a>
              </motion.div>

              {/* Primary WhatsApp */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 opacity-50 blur transition duration-200 group-hover:opacity-75" />
                <a
                  href="https://wa.me/256758951822"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex flex-col items-center justify-center gap-4 rounded-lg bg-gray-900 p-6 transition duration-200 hover:bg-gray-800"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-green-400"
                  >
                    <Phone className="h-8 w-8" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">WhatsApp (Primary)</h3>
                    <p className="mt-1 text-sm text-gray-300">+256 758 951 822</p>
                  </div>
                </a>
              </motion.div>

              {/* Secondary WhatsApp */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-50 blur transition duration-200 group-hover:opacity-75" />
                <a
                  href="https://wa.me/256745033924"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex flex-col items-center justify-center gap-4 rounded-lg bg-gray-900 p-6 transition duration-200 hover:bg-gray-800"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-purple-400"
                  >
                    <MessageCircle className="h-8 w-8" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">WhatsApp (Secondary)</h3>
                    <p className="mt-1 text-sm text-gray-300">+256 745 033 924</p>
                  </div>
                </a>
              </motion.div>
            </div>

            {/* Social Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 flex justify-center gap-6"
            >
              {[
                { name: 'LinkedIn', href: 'https://www.linkedin.com/company/lawmwad-technologies/ ', icon: Linkedin, color: 'text-blue-400' },
                { name: 'Twitter', href: '#', icon: Twitter, color: 'text-sky-400' },
                { name: 'GitHub', href: '#', icon: Github, color: 'text-gray-400' },
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${social.color} hover:opacity-80 transition-opacity`}
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Animated tech lines */}
        <div className="absolute inset-x-0 -top-16 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-500 to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="absolute inset-x-0 -bottom-16 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-500 to-pink-500 opacity-20 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]" />
        </div>
      </section>
      </main>
  );
}
