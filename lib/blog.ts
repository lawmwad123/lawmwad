export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'building-offline-first-apps-africa',
    title: 'Building Offline-First Applications for African Markets',
    excerpt: 'Learn how we design and build applications that work seamlessly in low-connectivity environments, ensuring reliability for users across Africa.',
    content: `
# Building Offline-First Applications for African Markets

In many parts of Africa, internet connectivity remains inconsistent. This presents unique challenges for software developers building applications for these markets.

## The Challenge

Users in rural and peri-urban areas often experience:
- Intermittent internet connectivity
- High data costs
- Power outages affecting network infrastructure

## Our Approach

At Lawmwad Technologies, we've developed a comprehensive offline-first strategy:

1. **Local-First Data Storage**: All critical data is stored locally first
2. **Background Sync**: Data syncs automatically when connectivity is available
3. **Conflict Resolution**: Smart algorithms handle data conflicts
4. **Progressive Enhancement**: Core features work offline, enhanced features require connectivity

## Results

Our offline-first approach has enabled:
- 99.9% data reliability
- Improved user satisfaction
- Reduced support tickets

Building for Africa means building for resilience.
    `,
    author: {
      name: 'Lawrence Mwadulo',
    },
    category: 'Engineering',
    tags: ['Offline-First', 'Africa', 'Mobile Development', 'PWA'],
    publishedAt: '2024-12-15',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: '2',
    slug: 'mobile-money-integration-guide',
    title: 'Complete Guide to Mobile Money Integration in East Africa',
    excerpt: 'A comprehensive guide to integrating M-Pesa, MTN MoMo, and Airtel Money into your applications for seamless payment processing.',
    content: `
# Complete Guide to Mobile Money Integration in East Africa

Mobile money has revolutionized financial transactions in East Africa. Here's how to integrate these payment methods into your applications.

## Supported Providers

- **M-Pesa (Safaricom)**: Dominant in Kenya
- **MTN Mobile Money**: Popular in Uganda and across Africa
- **Airtel Money**: Growing presence in multiple markets

## Integration Best Practices

1. Always implement callback verification
2. Handle timeout scenarios gracefully
3. Provide clear transaction feedback to users
4. Implement robust error handling

## Security Considerations

- Use HTTPS for all API calls
- Store API credentials securely
- Implement transaction logging
- Regular security audits
    `,
    author: {
      name: 'Lawrence Mwadulo',
    },
    category: 'Tutorials',
    tags: ['Mobile Money', 'M-Pesa', 'MTN MoMo', 'Payments'],
    publishedAt: '2024-11-20',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: '3',
    slug: 'school-management-digital-transformation',
    title: 'Digital Transformation in African Schools: Lessons Learned',
    excerpt: 'Insights from deploying school management systems across 50+ schools and the key factors that drive successful adoption.',
    content: `
# Digital Transformation in African Schools: Lessons Learned

After deploying SchoolAdmin across 50+ schools, we've gathered valuable insights on what drives successful digital transformation in education.

## Key Success Factors

1. **Teacher Training**: Comprehensive training programs are essential
2. **Offline Capability**: Systems must work without constant internet
3. **Local Payment Integration**: Mobile money support is crucial
4. **Parent Engagement**: Mobile-friendly parent portals increase adoption

## Common Challenges

- Resistance to change from staff
- Infrastructure limitations
- Budget constraints
- Data migration from paper records

## Our Solutions

We've developed strategies to address each challenge, resulting in high adoption rates and positive outcomes for schools.
    `,
    author: {
      name: 'Lawrence Mwadulo',
    },
    category: 'Case Studies',
    tags: ['Education', 'Digital Transformation', 'SchoolAdmin'],
    publishedAt: '2024-10-05',
    readTime: '6 min read',
    featured: false,
  },
];

export const blogCategories = [
  'All',
  'Engineering',
  'Tutorials',
  'Case Studies',
  'Company News',
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

export function getFeaturedPosts(limit: number = 2): BlogPost[] {
  return blogPosts.filter(p => p.featured).slice(0, limit);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const current = getBlogPostBySlug(currentSlug);
  if (!current) return [];

  return blogPosts
    .filter(p => p.slug !== currentSlug && p.category === current.category)
    .slice(0, limit);
}
