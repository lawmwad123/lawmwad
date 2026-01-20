'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Linkedin } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { Badge } from '../../components/ui/Badge';
import { BlogPost, getRelatedPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const relatedPosts = getRelatedPosts(post.slug, 2);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-hero pt-8 pb-16">
        <div className="container-narrow">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-800 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="primary" className="mb-4">
              {post.category}
            </Badge>

            <h1 className="heading-1 mb-6">{post.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                  {post.author.name.charAt(0)}
                </div>
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <Section>
        <div className="container-narrow">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              {/* Cover Image Placeholder */}
              <div className="aspect-[2/1] bg-gradient-to-br from-primary-100 to-surface-100 rounded-2xl mb-8 flex items-center justify-center">
                <div className="text-8xl opacity-20">📝</div>
              </div>

              {/* Article Content */}
              <div className="prose-custom">
                <div
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                />
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-surface-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-surface-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Share this article</h3>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://lawmwad.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-gray-500 hover:text-primary-800 hover:bg-surface-200 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://lawmwad.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-gray-500 hover:text-primary-800 hover:bg-surface-200 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Author Card */}
                <div className="card p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">About the Author</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold text-lg">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-primary-900">{post.author.name}</div>
                      <div className="text-sm text-gray-500">Lawmwad Technologies</div>
                    </div>
                  </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="card p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((related) => (
                        <Link
                          key={related.id}
                          href={`/blog/${related.slug}`}
                          className="block group"
                        >
                          <h4 className="font-medium text-primary-900 group-hover:text-accent-600 transition-colors text-sm line-clamp-2">
                            {related.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(related.publishedAt)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="gray">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="heading-2 mb-4">Want to Discuss a Project?</h2>
          <p className="body-md mb-8">
            Let's talk about how we can help bring your ideas to life.
          </p>
          <Link href="/contact">
            <button className="btn-primary btn-lg">Get in Touch</button>
          </Link>
        </div>
      </Section>
    </>
  );
}
