export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'web' | 'mobile' | 'enterprise' | 'saas';
  categoryLabel: string;
  url: string;
  featured: boolean;
  techStack: string[];
  features: string[];
  challenge: string;
  solution: string;
  results?: string[];
  year: string;
  client?: string;
  industry: string;
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'vatrar-fleet-tracking',
    title: 'Vatrar Fleet Tracking System',
    shortDescription: 'Fleet management dashboard designed for microfinance logbook loans with real-time vehicle tracking and monitoring.',
    fullDescription: 'A comprehensive fleet management dashboard designed specifically for microfinance logbook loans. The system tracks vehicles, monitors active/inactive status, maintenance schedules, battery health, and fuel efficiency. Built with offline-first capabilities for field operations.',
    category: 'enterprise',
    categoryLabel: 'Enterprise System',
    url: 'https://vatrar.vercel.app',
    featured: true,
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Real-time GPS'],
    features: [
      'Real-time vehicle tracking and monitoring',
      'Active/inactive status management',
      'Maintenance schedule tracking',
      'Battery health monitoring',
      'Fuel efficiency analytics',
      'Offline-first for field operations',
      'Loan tracking integration'
    ],
    challenge: 'Microfinance institutions needed a reliable way to track vehicles used as collateral for logbook loans, even in areas with limited internet connectivity.',
    solution: 'We built an offline-first fleet tracking system that syncs data when connectivity is available, providing real-time insights into vehicle status and maintenance needs.',
    results: [
      'Reduced loan default risk by 40%',
      'Improved field operations efficiency',
      '99.9% tracking accuracy'
    ],
    year: '2024',
    client: 'Advance Smart Microfinance',
    industry: 'Financial Services'
  },
  {
    id: '2',
    slug: 'abel-motors-ecommerce',
    title: 'Abel Motors E-commerce',
    shortDescription: 'Vehicle sales platform with inventory management, financing options, and multi-bank partnerships.',
    fullDescription: 'A comprehensive vehicle sales platform featuring inventory management, financing calculators, and partnerships with major banks including Stanbic, dfcu, and Centenary Bank for vehicle financing options.',
    category: 'web',
    categoryLabel: 'E-commerce Platform',
    url: 'https://abel-motors.vercel.app',
    featured: true,
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Stripe', 'PostgreSQL'],
    features: [
      'Vehicle inventory management',
      'Financing calculator integration',
      'Multi-bank partnership portal',
      'Loan application processing',
      'Vehicle comparison tools',
      'Dealer management system'
    ],
    challenge: 'Abel Motors needed a modern platform to showcase their vehicle inventory while integrating financing options from multiple banking partners.',
    solution: 'We developed an integrated e-commerce platform with real-time inventory sync, financing calculators, and direct connections to partner banks for loan applications.',
    results: [
      '150% increase in online inquiries',
      'Streamlined financing applications',
      'Reduced sales cycle time'
    ],
    year: '2024',
    client: 'Abel Motors',
    industry: 'Automotive'
  },
  {
    id: '3',
    slug: 'makonosi-car-hire',
    title: 'Makonosi Car Hire System',
    shortDescription: 'Complete car rental business website with fleet management, booking system, and mobile money integration.',
    fullDescription: 'A full-featured car rental platform with fleet management, online booking, pricing tiers, and payment integrations including M-Pesa and Equity Bank mobile money solutions.',
    category: 'web',
    categoryLabel: 'Booking Platform',
    url: 'https://makonosi.vercel.app',
    featured: true,
    techStack: ['Next.js', 'TypeScript', 'Node.js', 'M-Pesa API', 'PostgreSQL'],
    features: [
      'Online booking system',
      'Fleet availability management',
      'Dynamic pricing engine',
      'M-Pesa payment integration',
      'Equity Bank mobile money',
      'Customer portal',
      'Driver assignment system'
    ],
    challenge: 'Makonosi needed a modern booking platform that could handle local payment methods and manage their growing fleet efficiently.',
    solution: 'We built a comprehensive car hire system with mobile money integration, real-time fleet availability, and automated pricing based on demand.',
    year: '2024',
    client: 'Makonosi Car Hire',
    industry: 'Transportation'
  },
  {
    id: '4',
    slug: 'schooladmin-africa',
    title: 'SchoolAdmin Platform',
    shortDescription: 'Flagship 35-module school management system with offline-first design and mobile money payments.',
    fullDescription: 'A comprehensive 35-module school management system featuring offline-first design, mobile money payments, biometric authentication, multi-tenant architecture, and hardware integration including ATM kiosks. Built for African educational institutions.',
    category: 'enterprise',
    categoryLabel: 'Enterprise SaaS',
    url: 'https://schooladmin.africa',
    featured: true,
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Mobile Money APIs', 'Biometric SDK'],
    features: [
      '35+ integrated modules',
      'Offline-first architecture',
      'Mobile money fee collection',
      'Biometric authentication',
      'Multi-tenant support',
      'ATM kiosk integration',
      'Parent portal & notifications',
      'Academic performance tracking'
    ],
    challenge: 'African schools needed a comprehensive management solution that works in low-connectivity environments while handling local payment methods.',
    solution: 'We developed a modular, offline-first school management system with progressive sync, mobile money integration, and hardware support for various school operations.',
    results: [
      'Deployed in 50+ schools',
      '95% fee collection rate',
      '60% reduction in admin work'
    ],
    year: '2023',
    industry: 'Education'
  },
  {
    id: '5',
    slug: 'giitlive-lms',
    title: 'GiiTLive LMS',
    shortDescription: 'Live coding education platform with AI tutor, parent dashboards, and subscription management.',
    fullDescription: 'An interactive learning management system designed for coding education, featuring live sessions, AI-powered tutoring, parent dashboards, subscription tiers, and real-time collaboration features.',
    category: 'saas',
    categoryLabel: 'EdTech SaaS',
    url: 'https://giit-lms.vercel.app',
    featured: false,
    techStack: ['Next.js', 'React', 'WebRTC', 'OpenAI API', 'Stripe'],
    features: [
      'Live coding sessions',
      'AI-powered tutor assistant',
      'Parent monitoring dashboard',
      'Subscription management',
      'Progress tracking',
      'Certificate generation',
      'Real-time collaboration'
    ],
    challenge: 'Coding education needed a platform that could deliver live instruction while providing AI assistance and parental oversight.',
    solution: 'We created a comprehensive LMS with WebRTC-based live sessions, integrated AI tutoring, and detailed progress reporting for parents.',
    year: '2024',
    industry: 'Education Technology'
  },
  {
    id: '6',
    slug: 'colorsy-coatings',
    title: 'Colorsy Coatings',
    shortDescription: 'E-commerce platform with AI-powered color visualization and product catalog management.',
    fullDescription: 'An innovative e-commerce platform for paint and coatings featuring AI-powered color visualization, product catalogs, and integrated payment processing.',
    category: 'web',
    categoryLabel: 'E-commerce',
    url: 'https://colorsy-coatings.vercel.app',
    featured: false,
    techStack: ['Next.js', 'TensorFlow.js', 'Three.js', 'Stripe', 'PostgreSQL'],
    features: [
      'AI color visualization',
      'Room paint preview',
      'Product catalog management',
      'Color matching algorithm',
      'Online ordering system',
      'Dealer locator'
    ],
    challenge: 'Customers struggled to visualize paint colors in their spaces before purchase, leading to returns and dissatisfaction.',
    solution: 'We implemented AI-powered color visualization allowing customers to see how paint colors would look in their actual rooms before purchasing.',
    year: '2024',
    client: 'Colorsy Coatings',
    industry: 'Retail'
  },
  {
    id: '7',
    slug: 'ryd-mental-health',
    title: 'RYD Mental Health NGO',
    shortDescription: 'Multilingual NGO website with self-assessment tools and volunteer management system.',
    fullDescription: 'A community-focused NGO website supporting mental health awareness with multilingual support (English, Kiswahili, Luganda, French), self-assessment tools, and volunteer management.',
    category: 'web',
    categoryLabel: 'Non-Profit Website',
    url: 'https://rydmentalhealth.org',
    featured: false,
    techStack: ['Next.js', 'i18n', 'Tailwind CSS', 'Sanity CMS', 'Vercel'],
    features: [
      'Multilingual support (4 languages)',
      'Mental health self-assessment',
      'Resource library',
      'Volunteer management',
      'Event calendar',
      'Donation integration',
      'Crisis helpline integration'
    ],
    challenge: 'Mental health resources needed to be accessible across different languages and cultures in East Africa.',
    solution: 'We built a culturally-sensitive, multilingual platform with localized content and easy-to-use self-assessment tools.',
    year: '2024',
    client: 'RYD Mental Health',
    industry: 'Healthcare/Non-Profit'
  },
  {
    id: '8',
    slug: 'grow-ug-sacco',
    title: 'Grow UG SACCO App',
    shortDescription: 'Mobile application for SACCO facilitation with savings management and loan processing.',
    fullDescription: 'A mobile application designed for SACCO (Savings and Credit Cooperative) facilitation, enabling members to manage savings, apply for loans, and track their financial progress.',
    category: 'mobile',
    categoryLabel: 'Mobile App',
    url: '#',
    featured: false,
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Mobile Money API'],
    features: [
      'Savings account management',
      'Loan application & tracking',
      'Mobile money deposits',
      'Member communication',
      'Financial reports',
      'Meeting scheduling'
    ],
    challenge: 'SACCO members needed mobile access to their accounts and loan services without visiting physical branches.',
    solution: 'We developed a mobile-first SACCO management app with integrated mobile money for seamless transactions.',
    year: '2024',
    industry: 'Financial Services'
  },
  {
    id: '9',
    slug: 'supreme-digital-pool',
    title: 'Supreme Digital Pool System',
    shortDescription: 'Pool/billiards payment system with MTN and Airtel mobile money integration.',
    fullDescription: 'A specialized payment system for pool halls and billiards venues, featuring time-based billing, mobile money integration with MTN and Airtel, and venue management tools.',
    category: 'mobile',
    categoryLabel: 'Payment System',
    url: '#',
    featured: false,
    techStack: ['React Native', 'Node.js', 'MTN MoMo API', 'Airtel Money API'],
    features: [
      'Time-based table billing',
      'MTN Mobile Money integration',
      'Airtel Money integration',
      'Table availability tracking',
      'Revenue analytics',
      'Customer loyalty program'
    ],
    challenge: 'Pool halls needed an efficient way to manage table time and collect payments digitally.',
    solution: 'We created an integrated payment and management system with mobile money support for cashless operations.',
    year: '2024',
    industry: 'Entertainment'
  },
  {
    id: '10',
    slug: 'vibe-ug-dating',
    title: 'Vibe UG Dating App',
    shortDescription: 'Modern dating mobile application with matching algorithms and secure messaging.',
    fullDescription: 'A contemporary dating application designed for the Ugandan market, featuring intelligent matching algorithms, secure messaging, and verification systems.',
    category: 'mobile',
    categoryLabel: 'Mobile App',
    url: '#',
    featured: false,
    techStack: ['React Native', 'Node.js', 'MongoDB', 'Firebase', 'ML Kit'],
    features: [
      'Smart matching algorithm',
      'Secure messaging',
      'Profile verification',
      'Location-based matching',
      'Video profiles',
      'Event discovery'
    ],
    challenge: 'The local dating market needed a secure, culturally-appropriate platform for meaningful connections.',
    solution: 'We built a modern dating app with robust verification systems and matching algorithms tailored to local preferences.',
    year: '2024',
    industry: 'Social/Dating'
  }
];

export const featuredProjects = projects.filter(p => p.featured);

export const projectCategories = [
  { value: 'all', label: 'All Projects' },
  { value: 'web', label: 'Web Applications' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'enterprise', label: 'Enterprise Systems' },
  { value: 'saas', label: 'SaaS Platforms' },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getRelatedProjects(currentSlug: string, limit: number = 3): Project[] {
  const current = getProjectBySlug(currentSlug);
  if (!current) return [];

  return projects
    .filter(p => p.slug !== currentSlug && p.category === current.category)
    .slice(0, limit);
}
