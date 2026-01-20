'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Building2,
  CheckCircle2,
  Lightbulb,
  Target,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Section } from '../../components/ui/Section';
import ProjectCard from '../../components/ProjectCard';
import { Project, getRelatedProjects } from '@/lib/projects';

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const relatedProjects = getRelatedProjects(project.slug, 2);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-hero pt-8 pb-16">
        <div className="container-custom">
          {/* Back Link */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-800 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="primary" className="mb-4">
                {project.categoryLabel}
              </Badge>

              <h1 className="heading-1 mb-4">{project.title}</h1>

              <p className="body-lg mb-6">{project.fullDescription}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-8">
                {project.client && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>{project.client}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{project.year}</span>
                </div>
              </div>

              {/* CTA */}
              {project.url !== '#' && (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ExternalLink className="w-5 h-5" />}
                  >
                    View Live Project
                  </Button>
                </a>
              )}
            </motion.div>

            {/* Project Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center"
            >
              {project.category === 'mobile' ? (
                /* Mobile Phone Mockup */
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="relative w-[280px] h-[580px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                    {/* Phone Inner Border */}
                    <div className="absolute inset-[3px] rounded-[2.75rem] border border-gray-700" />

                    {/* Side Buttons */}
                    <div className="absolute -left-[3px] top-28 w-[3px] h-8 bg-gray-700 rounded-l-sm" />
                    <div className="absolute -left-[3px] top-44 w-[3px] h-16 bg-gray-700 rounded-l-sm" />
                    <div className="absolute -right-[3px] top-36 w-[3px] h-12 bg-gray-700 rounded-r-sm" />

                    {/* Screen */}
                    <div className="relative w-full h-full bg-white rounded-[2.25rem] overflow-hidden">
                      {/* Status Bar */}
                      <div className="flex items-center justify-between px-6 py-2 bg-primary-800">
                        <span className="text-[10px] text-white font-medium">9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="flex gap-[2px]">
                            <div className="w-[3px] h-[6px] bg-white rounded-[1px]" />
                            <div className="w-[3px] h-[8px] bg-white rounded-[1px]" />
                            <div className="w-[3px] h-[10px] bg-white rounded-[1px]" />
                            <div className="w-[3px] h-[12px] bg-white rounded-[1px]" />
                          </div>
                          <div className="w-6 h-3 border border-white rounded-sm ml-1">
                            <div className="w-4 h-full bg-white rounded-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Island / Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full" />

                      {/* App Header */}
                      <div className="bg-primary-800 px-4 py-4">
                        <div className="h-5 bg-white/20 rounded w-32 mb-2" />
                        <div className="h-3 bg-white/10 rounded w-24" />
                      </div>

                      {/* App Content */}
                      <div className="p-4 space-y-4">
                        {/* Balance Card */}
                        <div className="bg-gradient-to-r from-primary-800 to-primary-700 rounded-2xl p-4 text-white">
                          <div className="text-[10px] opacity-70 mb-1">Available Balance</div>
                          <div className="text-xl font-bold">UGX 2,450,000</div>
                          <div className="flex gap-2 mt-3">
                            <div className="flex-1 bg-white/20 rounded-lg py-2 text-center text-[10px]">Send</div>
                            <div className="flex-1 bg-white/20 rounded-lg py-2 text-center text-[10px]">Receive</div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-4 gap-2">
                          {['Transfer', 'Deposit', 'Bills', 'More'].map((action) => (
                            <div key={action} className="text-center">
                              <div className="w-10 h-10 bg-primary-100 rounded-xl mx-auto mb-1" />
                              <span className="text-[9px] text-gray-600">{action}</span>
                            </div>
                          ))}
                        </div>

                        {/* Transactions */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-800">Recent</span>
                            <span className="text-[10px] text-primary-600">See all</span>
                          </div>
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center gap-3 p-2 bg-surface-50 rounded-xl">
                                <div className="w-8 h-8 bg-surface-200 rounded-full" />
                                <div className="flex-1">
                                  <div className="h-2.5 bg-surface-300 rounded w-20 mb-1" />
                                  <div className="h-2 bg-surface-200 rounded w-14" />
                                </div>
                                <div className="text-right">
                                  <div className="h-2.5 bg-green-200 rounded w-12 mb-1" />
                                  <div className="h-2 bg-surface-200 rounded w-8" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center py-3 px-4 bg-white border-t border-surface-200">
                        <div className="w-6 h-6 bg-primary-800 rounded-lg" />
                        <div className="w-6 h-6 bg-surface-200 rounded-lg" />
                        <div className="w-6 h-6 bg-surface-200 rounded-lg" />
                        <div className="w-6 h-6 bg-surface-200 rounded-lg" />
                      </div>

                      {/* Home Indicator */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-900 rounded-full" />
                    </div>
                  </div>

                  {/* Reflection/Shadow */}
                  <div className="absolute -inset-4 bg-gradient-to-b from-primary-500/5 to-transparent rounded-[4rem] -z-10 blur-2xl" />
                </div>
              ) : (
                /* Browser Mockup */
                <div className="bg-white rounded-2xl shadow-soft-xl border border-surface-200 overflow-hidden w-full">
                  {/* Browser Header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-surface-100 border-b border-surface-200">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 bg-white rounded-lg text-xs text-gray-400 border border-surface-200">
                        {project.url.replace('https://', '')}
                      </div>
                    </div>
                  </div>
                  {/* Content Placeholder */}
                  <div className="p-8 bg-gradient-to-br from-primary-50 to-surface-100 aspect-[4/3]">
                    <div className="space-y-4">
                      <div className="h-8 bg-primary-800 rounded-lg w-3/4" />
                      <div className="h-4 bg-surface-300 rounded w-full" />
                      <div className="h-4 bg-surface-300 rounded w-5/6" />
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="h-24 bg-white rounded-xl shadow-soft border border-surface-200" />
                        <div className="h-24 bg-white rounded-xl shadow-soft border border-surface-200" />
                        <div className="h-24 bg-white rounded-xl shadow-soft border border-surface-200" />
                        <div className="h-24 bg-accent-100 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h2 className="heading-4 mb-4">The Challenge</h2>
            <p className="text-gray-600">{project.challenge}</p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="heading-4 mb-4">Our Solution</h2>
            <p className="text-gray-600">{project.solution}</p>
          </motion.div>
        </div>
      </Section>

      {/* Features */}
      <Section variant="gray">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-2 text-center mb-12">Key Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {project.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-surface-200"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Tech Stack */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="heading-2 mb-8">Technologies Used</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="primary" size="lg">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </Section>

      {/* Results */}
      {project.results && project.results.length > 0 && (
        <Section variant="dark">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-12">Results & Impact</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {project.results.map((result, index) => (
                <motion.div
                  key={result}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-accent-400 mb-2">{result}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <Section>
          <h2 className="heading-2 text-center mb-12">Related Projects</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {relatedProjects.map((related, index) => (
              <ProjectCard key={related.id} project={related} index={index} />
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section variant="gray">
        <div className="text-center">
          <h2 className="heading-2 mb-4">Interested in a Similar Project?</h2>
          <p className="body-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how we can build something amazing for your business.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Start a Conversation
            </Button>
          </Link>
        </div>
      </Section>
    </>
  );
}
