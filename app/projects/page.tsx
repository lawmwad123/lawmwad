'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionHeader } from '../components/ui/Section';
import ProjectCard from '../components/ProjectCard';
import { projects, projectCategories } from '@/lib/projects';

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = useMemo(
    () =>
      activeCategory === 'all'
        ? projects
        : projects.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

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
            <h1 className="heading-1 mb-4">Our Projects</h1>
            <p className="body-lg">
              Explore our portfolio of work across various industries - from fleet management
              to school administration, e-commerce to fintech solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <Section>
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {projectCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.value
                  ? 'bg-primary-800 text-white'
                  : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found in this category.</p>
          </div>
        )}
      </Section>
    </>
  );
}
