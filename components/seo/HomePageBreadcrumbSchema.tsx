import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface HomePageBreadcrumbSchemaProps {
  baseUrl?: string;
}

/**
 * Component that renders BreadcrumbList schema for homepage
 */
export default function HomePageBreadcrumbSchema({ baseUrl }: HomePageBreadcrumbSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${actualBaseUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: actualBaseUrl,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
