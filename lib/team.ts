export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export const team: TeamMember[] = [
  {
    id: '1',
    name: 'Mawanda Lawrence',
    role: 'Founder & Lead Developer',
    bio: 'Full-stack developer with expertise in building enterprise-grade applications for African markets. Passionate about creating technology solutions that work offline-first and integrate with local payment systems.',
    image: '/profile/mawanda_lawrence.png',
    linkedin: 'https://www.linkedin.com/company/lawmwad-technologies/',
    github: '#',
  },
  {
    id: '2',
    name: 'Bulega Francis',
    role: 'Business Development Director',
    bio: 'Leads strategic growth, partnerships, and market expansion initiatives at Lawmwad Technologies. With a strong background in program management and stakeholder engagement, Francis focuses on building sustainable client relationships and identifying opportunities that drive long-term value.',
    image: '/profile/Bulega_Francis.png',
    linkedin: 'https://www.linkedin.com/in/bulega-francis-57a872149',
  },
  {
    id: '3',
    name: 'Waniala Alphonse Lincolne',
    role: 'Software Developer',
    bio: 'Skilled software developer dedicated to building robust and scalable applications. Passionate about clean code, modern development practices, and delivering solutions that meet real-world business needs.',
  },
];

export const companyValues = [
  {
    title: 'Innovation',
    description: 'We push boundaries to create solutions that address unique African market challenges.',
    icon: 'lightbulb',
  },
  {
    title: 'Reliability',
    description: 'Our systems are built to work even in challenging connectivity environments.',
    icon: 'shield',
  },
  {
    title: 'Impact',
    description: 'Every project we undertake aims to create meaningful change for businesses and communities.',
    icon: 'target',
  },
  {
    title: 'Partnership',
    description: 'We work closely with our clients, treating their success as our own.',
    icon: 'handshake',
  },
];

export const milestones = [
  {
    year: '2020',
    title: 'Founded',
    description: 'Lawmwad Technologies established with a vision to build impactful software solutions.',
  },
  {
    year: '2021',
    title: 'First Enterprise Client',
    description: 'Launched our first school management system deployment.',
  },
  {
    year: '2022',
    title: 'Mobile Expansion',
    description: 'Expanded into mobile app development with React Native.',
  },
  {
    year: '2023',
    title: 'SchoolAdmin Launch',
    description: 'Released SchoolAdmin platform, now serving 50+ schools.',
  },
  {
    year: '2024',
    title: 'Fleet & Fintech',
    description: 'Entered fleet management and fintech sectors with Vatrar and SACCO solutions.',
  },
];
