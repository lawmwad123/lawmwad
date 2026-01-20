'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeader } from './ui/Section';
import ProjectCard from './ProjectCard';
import { Button } from './ui/Button';
import { featuredProjects } from '@/lib/projects';

export default function FeaturedProjects() {
  return (
    <Section id="projects">
      <SectionHeader
        subtitle="Our Work"
        title="Featured Projects"
        description="Explore some of our recent work across various industries - from fleet management to school administration systems."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProjects.slice(0, 3).map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-12"
      >
        <Link href="/projects">
          <Button variant="outline" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            View All Projects
          </Button>
        </Link>
      </motion.div>
    </Section>
  );
}
