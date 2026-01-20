import { Metadata } from 'next';
import ServicesPageClient from './ServicesPageClient';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore our comprehensive software development services including web applications, mobile apps, enterprise solutions, school management systems, fleet tracking, and e-commerce platforms.',
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
