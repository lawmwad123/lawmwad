'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Badge } from '../components/ui/Badge';
import { blogPosts, blogCategories } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

export default function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts =
    activeCategory === 'All'
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

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
              Our Blog
            </Badge>
            <h1 className="heading-1 mb-4">Insights & Articles</h1>
            <p className="body-lg">
              Tutorials, case studies, and thoughts on building software for African markets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <Section>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {blogCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-primary-800 text-white'
                  : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <article className="card overflow-hidden h-full">
                    {/* Cover Image Placeholder */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-surface-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-20">📝</div>
                      </div>
                      {post.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="accent">Featured</Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <Badge variant="outline" size="sm" className="mb-3">
                        {post.category}
                      </Badge>

                      <h2 className="text-lg font-semibold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-surface-200">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found in this category.</p>
          </div>
        )}
      </Section>

      {/* Newsletter Section */}
      <Section variant="gray">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-2 mb-4">Stay Updated</h2>
          <p className="body-md mb-8">
            Get the latest articles, tutorials, and company news delivered to your inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="btn-primary btn-md">Subscribe</button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </Section>
    </>
  );
}
