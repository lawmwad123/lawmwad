'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lightbulb,
  Shield,
  Target,
  Handshake,
  Linkedin,
  Twitter,
  Github,
  ArrowRight,
} from 'lucide-react';
import { Section, SectionHeader } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { team, companyValues, milestones } from '@/lib/team';

const valueIcons: Record<string, React.ElementType> = {
  lightbulb: Lightbulb,
  shield: Shield,
  target: Target,
  handshake: Handshake,
};

export default function AboutPageClient() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-hero pt-12 pb-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="primary" className="mb-4">
                About Us
              </Badge>
              <h1 className="heading-1 mb-4">
                Growing to Serve with <span className="text-gradient-accent">Impact</span>
              </h1>
              <p className="body-lg mb-6">
                We're a software development company based in Uganda, dedicated to building
                technology solutions that address the unique challenges of African businesses.
              </p>
              <p className="body-md">
                From offline-first applications to mobile money integrations, we create software
                that works in real-world African conditions - because we understand them firsthand.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-soft-xl p-8 border border-surface-200">
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src="/1000050622.png"
                    alt="Lawmwad Technologies"
                    width={64}
                    height={64}
                    className="rounded-xl"
                  />
                  <div>
                    <h3 className="font-bold text-primary-900">Lawmwad Technologies</h3>
                    <p className="text-sm text-gray-500">Est. 2020 | Kampala, Uganda</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-primary-900">50+</div>
                    <div className="text-sm text-gray-500">Projects</div>
                  </div>
                  <div className="p-4 bg-surface-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-primary-900">10+</div>
                    <div className="text-sm text-gray-500">Industries</div>
                  </div>
                  <div className="p-4 bg-surface-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-primary-900">4+</div>
                    <div className="text-sm text-gray-500">Years</div>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-accent-600">98%</div>
                    <div className="text-sm text-gray-500">Satisfaction</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To empower African businesses with innovative, reliable, and accessible technology
              solutions that drive growth and create lasting impact in their communities.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Values Section */}
      <Section variant="gray">
        <SectionHeader
          subtitle="What We Stand For"
          title="Our Core Values"
          description="These principles guide everything we do, from how we build software to how we serve our clients."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyValues.map((value, index) => {
            const Icon = valueIcons[value.icon];
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Timeline Section */}
      <Section>
        <SectionHeader
          subtitle="Our Journey"
          title="Company Milestones"
          description="Key moments in our growth from a startup to a trusted technology partner."
        />

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-surface-200 hidden md:block" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex gap-6"
                >
                  {/* Year Badge */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-800 text-white flex items-center justify-center font-bold text-sm z-10">
                    {milestone.year}
                  </div>

                  {/* Content */}
                  <div className="flex-1 card p-6">
                    <h3 className="font-semibold text-primary-900 mb-1">{milestone.title}</h3>
                    <p className="text-gray-600 text-sm">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section variant="gray">
        <SectionHeader
          subtitle="Our Team"
          title="Meet the People Behind Lawmwad"
          description="A dedicated team passionate about building technology that makes a difference."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-soft-xl overflow-hidden border border-surface-200 hover:shadow-2xl hover:border-primary-200 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-72 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-5xl font-bold text-primary-800 shadow-lg">
                      {member.name.split(' ').map(n => n.charAt(0)).join('')}
                    </div>
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-900 mb-1">{member.name}</h3>
                <p className="text-sm font-medium text-accent-600 mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">{member.bio}</p>

                {/* Social Links */}
                <div className="flex gap-3 pt-4 border-t border-surface-200">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#0077b5] transition-all duration-200"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#1da1f2] transition-all duration-200"
                      aria-label={`${member.name} on Twitter`}
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#333] transition-all duration-200"
                      aria-label={`${member.name} on GitHub`}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Interested in joining our team?</p>
          <Link href="/contact">
            <Button variant="outline">Get in Touch</Button>
          </Link>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Let's Build Something Great Together
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Ready to discuss your project? We'd love to hear about your challenges and how we can help.
          </p>
          <Link href="/contact">
            <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start a Conversation
            </Button>
          </Link>
        </div>
      </Section>
    </>
  );
}
