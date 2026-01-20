import {
  Globe,
  Smartphone,
  Building2,
  GraduationCap,
  Truck,
  ShoppingCart,
  Cpu,
  type LucideIcon
} from 'lucide-react';

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  features: string[];
  technologies: string[];
  benefits: string[];
}

export const services: Service[] = [
  {
    id: '1',
    slug: 'web-application-development',
    title: 'Web Application Development',
    shortDescription: 'Custom web applications built with modern frameworks for scalability and performance.',
    fullDescription: 'We build powerful, scalable web applications using cutting-edge technologies. From complex enterprise dashboards to customer-facing platforms, our solutions are designed for performance, security, and user experience.',
    icon: 'globe',
    features: [
      'Custom web application development',
      'Progressive Web Apps (PWA)',
      'API development and integration',
      'Real-time applications',
      'Cloud deployment and scaling',
      'Performance optimization',
    ],
    technologies: ['Next.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB'],
    benefits: [
      'Faster time to market',
      'Scalable architecture',
      'Modern user experience',
      'SEO-friendly applications',
    ],
  },
  {
    id: '2',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    shortDescription: 'Native and cross-platform mobile apps for iOS and Android.',
    fullDescription: 'We create mobile applications that users love. Using React Native and native technologies, we build apps that are fast, reliable, and work seamlessly across platforms.',
    icon: 'smartphone',
    features: [
      'Cross-platform development (iOS & Android)',
      'Native app development',
      'Mobile money integration',
      'Offline-first architecture',
      'Push notifications',
      'App store optimization',
    ],
    technologies: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'Mobile Money APIs'],
    benefits: [
      'Single codebase for both platforms',
      'Reduced development costs',
      'Consistent user experience',
      'Faster updates and deployment',
    ],
  },
  {
    id: '3',
    slug: 'enterprise-software-solutions',
    title: 'Enterprise Software Solutions',
    shortDescription: 'Comprehensive business systems that streamline operations and drive growth.',
    fullDescription: 'We develop enterprise-grade software solutions that transform how businesses operate. Our systems are built for reliability, security, and seamless integration with existing workflows.',
    icon: 'building',
    features: [
      'ERP systems',
      'CRM solutions',
      'Business process automation',
      'Data analytics dashboards',
      'Multi-tenant architecture',
      'Role-based access control',
    ],
    technologies: ['Next.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS/Azure'],
    benefits: [
      'Improved operational efficiency',
      'Data-driven decision making',
      'Reduced manual processes',
      'Enhanced collaboration',
    ],
  },
  {
    id: '4',
    slug: 'school-management-systems',
    title: 'School Management Systems',
    shortDescription: 'Complete educational institution management with offline-first design.',
    fullDescription: 'Our flagship SchoolAdmin platform provides comprehensive school management with 35+ modules, offline-first capabilities, and local payment integrations designed specifically for African educational institutions.',
    icon: 'graduation',
    features: [
      'Student information management',
      'Fee collection with mobile money',
      'Academic performance tracking',
      'Timetable management',
      'Parent communication portal',
      'Examination management',
      'Library management',
      'Biometric attendance',
    ],
    technologies: ['Next.js', 'PostgreSQL', 'Mobile Money APIs', 'Biometric SDKs'],
    benefits: [
      'Works offline - no internet required',
      'Automated fee reminders',
      'Real-time parent updates',
      'Comprehensive reporting',
    ],
  },
  {
    id: '5',
    slug: 'fleet-vehicle-management',
    title: 'Fleet & Vehicle Management',
    shortDescription: 'Real-time tracking and management for vehicle fleets and logistics.',
    fullDescription: 'Our fleet management solutions provide real-time vehicle tracking, maintenance scheduling, and comprehensive analytics for businesses managing vehicle assets, including microfinance logbook loan tracking.',
    icon: 'truck',
    features: [
      'Real-time GPS tracking',
      'Maintenance scheduling',
      'Fuel consumption monitoring',
      'Driver management',
      'Route optimization',
      'Logbook loan tracking',
      'Geofencing alerts',
    ],
    technologies: ['Next.js', 'Real-time GPS', 'PostgreSQL', 'WebSockets'],
    benefits: [
      'Reduced operational costs',
      'Improved fleet utilization',
      'Enhanced security',
      'Automated compliance',
    ],
  },
  {
    id: '6',
    slug: 'ecommerce-solutions',
    title: 'E-commerce Solutions',
    shortDescription: 'Online stores and marketplaces with local payment integrations.',
    fullDescription: 'We build e-commerce platforms that sell. From product catalogs to checkout flows, our solutions include local payment methods, inventory management, and tools to grow your online business.',
    icon: 'cart',
    features: [
      'Custom online stores',
      'Marketplace development',
      'Payment gateway integration',
      'Inventory management',
      'Order fulfillment systems',
      'Customer analytics',
    ],
    technologies: ['Next.js', 'Stripe', 'Mobile Money APIs', 'PostgreSQL'],
    benefits: [
      'Multiple payment options',
      'Mobile-optimized checkout',
      'Real-time inventory sync',
      'Detailed sales analytics',
    ],
  },
  {
    id: '7',
    slug: 'iot-hardware-integration',
    title: 'IoT & Hardware Integration',
    shortDescription: 'Smart device integration and embedded systems for automation.',
    fullDescription: 'We bridge the gap between software and hardware. From biometric devices to ATM kiosks and IoT sensors, we create integrated solutions that bring physical and digital worlds together.',
    icon: 'cpu',
    features: [
      'Biometric device integration',
      'ATM kiosk systems',
      'IoT sensor networks',
      'Hardware-software bridges',
      'Embedded systems',
      'Real-time data collection',
    ],
    technologies: ['Node.js', 'Python', 'MQTT', 'WebSockets', 'Raspberry Pi'],
    benefits: [
      'Automated data collection',
      'Reduced human error',
      'Real-time monitoring',
      'Scalable IoT infrastructure',
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}

export const serviceIcons: Record<string, LucideIcon> = {
  globe: Globe,
  smartphone: Smartphone,
  building: Building2,
  graduation: GraduationCap,
  truck: Truck,
  cart: ShoppingCart,
  cpu: Cpu,
};
