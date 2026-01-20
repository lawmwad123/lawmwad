'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { Badge } from './ui/Badge';
import type { Project } from '@/lib/projects';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`} className="block group">
        <div className="card overflow-hidden">
          {/* Project Preview */}
          <div className="relative aspect-[16/10] bg-gradient-to-br from-primary-100 to-surface-100 overflow-hidden">
            {project.category === 'mobile' ? (
              /* Mobile Phone Mockup */
              <div className="absolute inset-0 flex items-center justify-center py-3">
                <div className="relative w-[100px] h-[200px] bg-gray-900 rounded-[1.25rem] p-1.5 shadow-lg">
                  {/* Phone Inner Border */}
                  <div className="absolute inset-[2px] rounded-[1.15rem] border border-gray-700" />

                  {/* Screen */}
                  <div className="relative w-full h-full bg-white rounded-[0.9rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-2 py-1 bg-primary-800">
                      <span className="text-[6px] text-white font-medium">9:41</span>
                      <div className="flex items-center gap-0.5">
                        <div className="w-3 h-1.5 border border-white rounded-[1px]">
                          <div className="w-2 h-full bg-white rounded-[1px]" />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Island */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-gray-900 rounded-full" />

                    {/* App Content */}
                    <div className="p-2 space-y-1.5">
                      {/* Balance Card */}
                      <div className="bg-gradient-to-r from-primary-800 to-primary-700 rounded-lg p-2 text-white">
                        <div className="text-[5px] opacity-70">Balance</div>
                        <div className="text-[8px] font-bold">UGX 2.4M</div>
                        <div className="flex gap-1 mt-1">
                          <div className="flex-1 bg-white/20 rounded py-0.5 text-center text-[4px]">Send</div>
                          <div className="flex-1 bg-white/20 rounded py-0.5 text-center text-[4px]">Receive</div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-4 gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="text-center">
                            <div className="w-4 h-4 bg-primary-100 rounded mx-auto" />
                          </div>
                        ))}
                      </div>

                      {/* Transactions */}
                      <div className="space-y-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-1.5 p-1 bg-surface-50 rounded">
                            <div className="w-3 h-3 bg-surface-200 rounded-full" />
                            <div className="flex-1">
                              <div className="h-1 bg-surface-300 rounded w-8 mb-0.5" />
                              <div className="h-0.5 bg-surface-200 rounded w-5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center py-1.5 px-2 bg-white border-t border-surface-200">
                      <div className="w-3 h-3 bg-primary-800 rounded" />
                      <div className="w-3 h-3 bg-surface-200 rounded" />
                      <div className="w-3 h-3 bg-surface-200 rounded" />
                      <div className="w-3 h-3 bg-surface-200 rounded" />
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-900 rounded-full" />
                  </div>
                </div>
              </div>
            ) : (
              /* Browser Window Mockup */
              <div className="absolute inset-4 bg-white rounded-lg shadow-soft border border-surface-200 overflow-hidden">
                {/* Browser Header */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-50 border-b border-surface-200">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="flex-1 text-center">
                    <span className="text-[10px] text-gray-400 truncate block px-4">
                      {project.url.replace('https://', '')}
                    </span>
                  </div>
                </div>
                {/* Preview Content */}
                <div className="p-3 h-full bg-gradient-to-br from-surface-50 to-white">
                  <div className="space-y-2">
                    <div className="h-4 bg-primary-200 rounded w-2/3" />
                    <div className="h-2 bg-surface-200 rounded w-full" />
                    <div className="h-2 bg-surface-200 rounded w-4/5" />
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="h-12 bg-surface-100 rounded" />
                      <div className="h-12 bg-surface-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-primary-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-2 text-white font-medium">
                View Project
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <Badge variant="primary">{project.categoryLabel}</Badge>
              {project.url !== '#' && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-400 hover:text-primary-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <h3 className="text-lg font-semibold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">
              {project.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
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
      </Link>
    </motion.div>
  );
}
