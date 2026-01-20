import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Lawmwad Technologies. We\'re ready to discuss your software development project, answer questions, or provide a free consultation.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
