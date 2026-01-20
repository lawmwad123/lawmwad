import { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, tutorials, and case studies from Lawmwad Technologies. Learn about software development, mobile money integration, offline-first apps, and more.',
};

export default function BlogPage() {
  return <BlogPageClient />;
}
