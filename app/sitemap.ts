import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.my-office.am';
  
  // Common routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/products',
    '/services',
    '/blog',
    '/faq',
    '/privacy-policy',
    '/terms-of-service',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Language-specific routes
  const languages = ['en', 'hy'];
  const languageRoutes = languages.flatMap(lang => 
    routes.map(route => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
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