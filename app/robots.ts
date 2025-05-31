import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/private/',
        '/*.json$',
        '/*.xml$',
      ],
    },
    sitemap: 'https://www.my-office.am/sitemap.xml',
    host: 'https://www.my-office.am',
  };
} 