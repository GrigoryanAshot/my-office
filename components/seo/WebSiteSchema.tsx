import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface WebSiteSchemaProps {
  baseUrl?: string;
}

/**
 * Component that renders WebSite schema (JSON-LD) for SEO
 * Includes search action for Google search box
 */
export default function WebSiteSchema({ baseUrl }: WebSiteSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${actualBaseUrl}#website`,
    url: actualBaseUrl,
    name: 'My Office Armenia',
    alternateName: 'My Office',
    description: 'Premium office furniture store in Armenia. Modern, ergonomic, and custom office furniture solutions.',
    publisher: {
      '@id': `${actualBaseUrl}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${actualBaseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en', 'hy'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
