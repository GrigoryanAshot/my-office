import { ProductData } from '@/lib/seo/productMetadata';

interface CollectionSchemaProps {
  category: string;
  categoryName: string;
  items: ProductData[];
  baseUrl?: string;
  basePath?: string;
}

/**
 * Generates Collection/ItemList schema (JSON-LD) for category pages
 * This helps search engines understand the collection of products
 */
export default function CollectionSchema({
  category,
  categoryName,
  items,
  baseUrl = 'https://www.my-office.am',
  basePath = 'softfurniture',
}: CollectionSchemaProps) {
  const categoryUrl = `${baseUrl}/${basePath}/${category}`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    description: `${categoryName} - Բարձրորակ գրասենյակային կահույք My Office-ից`,
    url: categoryUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 20).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: item.name,
          description: item.description || `${item.name} - ${categoryName}`,
          image: item.imageUrl.startsWith('http') ? item.imageUrl : `${baseUrl}${item.imageUrl}`,
          url: `${baseUrl}/${basePath}/${category}/${item.id}`,
          sku: String(item.id),
          category: categoryName,
          brand: {
            '@type': 'Brand',
            name: 'My Office',
          },
          offers: {
            '@type': 'Offer',
            url: `${baseUrl}/${basePath}/${category}/${item.id}`,
            priceCurrency: 'AMD',
            availability: item.isAvailable 
              ? 'https://schema.org/InStock' 
              : 'https://schema.org/PreOrder',
            seller: {
              '@type': 'Organization',
              name: 'My Office Armenia',
              url: baseUrl,
            },
          },
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

