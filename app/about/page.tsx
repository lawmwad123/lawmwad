import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Lawmwad Technologies - building innovative software solutions for African businesses since 2020. Our mission, values, and the team behind our success.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
