import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.my-office.am';
  
  // Common routes
  const routePaths = [
    '',
    '/about',
    '/contact',
    '/products',
    '/services',
    '/blog',
    '/faq',
    '/privacy-policy',
    '/terms-of-service',
  ];

  const routes = routePaths.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  // Language-specific routes
  const languages = ['en', 'hy'];
  const languageRoutes = languages.flatMap(lang => 
    routePaths.map(path => ({
      url: `${baseUrl}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1.0 : 0.8,
    }))
  );

  // Office furniture categories
  const categories = [
    'office-chairs',
    'office-desks',
    'meeting-tables',
    'storage-solutions',
    'reception-furniture',
    'ergonomic-furniture',
    'conference-rooms',
    'workstations',
    'office-partitions',
    'accessories',
  ].map(category => ({
    url: `${baseUrl}/products/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...routes, ...languageRoutes, ...categories];
} 