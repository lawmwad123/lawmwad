'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, MessageCircle } from 'lucide-react';

const footerNavigation = {
  services: [
    { name: 'Web Development', href: '/services#web-application-development' },
    { name: 'Mobile Apps', href: '/services#mobile-app-development' },
    { name: 'Enterprise Solutions', href: '/services#enterprise-software-solutions' },
    { name: 'School Management', href: '/services#school-management-systems' },
    { name: 'Fleet Management', href: '/services#fleet-vehicle-management' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  projects: [
    { name: 'SchoolAdmin', href: '/projects/schooladmin-africa' },
    { name: 'Vatrar Fleet', href: '/projects/vatrar-fleet-tracking' },
    { name: 'Abel Motors', href: '/projects/abel-motors-ecommerce' },
    { name: 'View All', href: '/projects' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/lawmwad-technologies/',
    icon: Linkedin,
  },
  {
    name: 'Twitter',
    href: '#',
    icon: Twitter,
  },
  {
    name: 'GitHub',
    href: '#',
    icon: Github,
  },
];

const contactInfo = {
  email: 'lawmwadtechug@gmail.com',
  phones: ['+256 781 236 221', '+256 745 033 924'],
  location: 'Kampala, Uganda',
};

export default function Footer() {
  return (
    <footer className="bg-primary-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/1000050622.png"
                alt="Lawmwad Technologies"
                width={48}
                height={48}
                className="h-12 w-auto bg-white rounded-lg p-1"
              />
              <div>
                <span className="text-xl font-bold text-white">Lawmwad</span>
                <span className="text-xl font-bold text-accent-500">Tech</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Building innovative software solutions for African businesses. From school management
              to fleet tracking, we create technology that works offline-first and integrates with
              local payment systems.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4 text-accent-500" />
                {contactInfo.email}
              </a>
              <a
                href={`https://wa.me/${contactInfo.phones[0].replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4 text-accent-500" />
                {contactInfo.phones[0]}
              </a>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-accent-500" />
                {contactInfo.location}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-3">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Featured Projects</h3>
            <ul className="space-y-3">
              {footerNavigation.projects.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Lawmwad Technologies & Industries. All rights reserved.
            </p>
            <div className="flex gap-6">
              {footerNavigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
