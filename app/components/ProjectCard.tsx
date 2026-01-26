'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { Badge } from './ui/Badge';
import WebsitePreview from './WebsitePreview';
import type { Project } from '@/lib/projects';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const projectUrl = project.url !== '#' ? project.url : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      {projectUrl ? (
        <a
          href={projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group h-full"
        >
          <div className="card overflow-hidden h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-soft-xl hover:border-primary-200">
            {/* Hero Preview Section - Live Website Preview */}
            <div className="relative aspect-[16/10] overflow-hidden bg-white rounded-t-2xl">
              <WebsitePreview
                url={projectUrl}
                title={project.title}
                category={project.category}
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/60 transition-all duration-300 flex items-center justify-center z-30">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white font-medium">
                  <span>Open Live Site</span>
                  <ExternalLink className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-3">
                <Badge variant="primary">{project.categoryLabel}</Badge>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-800 transition-colors flex-shrink-0" />
              </div>

              <h3 className="text-lg font-semibold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">
                {project.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                {project.shortDescription}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2">
                {project.techStack.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" size="sm">
                    {tech}
                  </Badge>
                ))}
                {project.techStack.length > 3 && (
                  <Badge variant="outline" size="sm">
                    +{project.techStack.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </a>
      ) : (
        <div className="card overflow-hidden h-full flex flex-col">
          {/* Hero Preview Section */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary-100 to-surface-100">
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center items-center text-gray-400">
              <div className="text-center">
                <div className="h-8 bg-gray-200 rounded-lg w-48 mb-4 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-3">
              <Badge variant="primary">{project.categoryLabel}</Badge>
            </div>

            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              {project.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
              {project.shortDescription}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="outline" size="sm">
                  {tech}
                </Badge>
              ))}
              {project.techStack.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{project.techStack.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
