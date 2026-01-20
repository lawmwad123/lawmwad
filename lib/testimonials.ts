export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  rating?: number;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'James Mukasa',
    role: 'Operations Director',
    company: 'Fair Money Microfinance',
    content: 'The Vatrar fleet tracking system has transformed how we manage our logbook loans. We can now monitor collateral vehicles in real-time, significantly reducing our default risk.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Sarah Nakato',
    role: 'Head Teacher',
    company: 'St. Mary\'s Secondary School',
    content: 'SchoolAdmin has simplified our entire administrative process. The offline-first approach means we never lose data, even during power outages. Fee collection has never been easier.',
    rating: 5,
  },
  {
    id: '3',
    name: 'David Ochieng',
    role: 'Managing Director',
    company: 'Abel Motors',
    content: 'Our vehicle sales have increased significantly since launching the new e-commerce platform. The financing integration with partner banks has streamlined our sales process.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Grace Achieng',
    role: 'Fleet Manager',
    company: 'Makonosi Car Hire',
    content: 'The booking system and mobile money integration have modernized our business. Customers love the convenience, and we love the improved cash flow management.',
    rating: 5,
  },
  {
    id: '5',
    name: 'Peter Wanyama',
    role: 'Program Coordinator',
    company: 'RYD Mental Health',
    content: 'Having our platform available in multiple local languages has helped us reach more communities. The self-assessment tools are making mental health resources accessible to everyone.',
    rating: 5,
  },
];

export function getFeaturedTestimonials(limit: number = 3): Testimonial[] {
  return testimonials.slice(0, limit);
}
