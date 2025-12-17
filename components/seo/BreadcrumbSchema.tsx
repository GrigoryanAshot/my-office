interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * Generates BreadcrumbList schema (JSON-LD) for navigation
 * Helps search engines understand page hierarchy
 */
export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  // Only render if we have items
  if (!items || items.length === 0) {
    return null;
  }
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

