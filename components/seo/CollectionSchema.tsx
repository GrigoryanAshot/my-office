import { ProductData } from '@/lib/seo/productMetadata';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

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
  baseUrl,
  basePath = 'softfurniture',
}: CollectionSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  const categoryUrl = `${actualBaseUrl}/${basePath}/${category}`;
  
  // Only render schema if we have items
  if (!items || items.length === 0) {
    return null;
  }
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    description: `${categoryName} - Բարձրորակ գրասենյակային կահույք My Office-ից`,
    url: categoryUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 20).map((item, index) => {
        // Extract numeric price for offers
        const priceMatch = item.price?.match(/[\d,]+/);
        const numericPrice = priceMatch ? priceMatch[0].replace(/,/g, '') : null;
        
        const listItem: any = {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: item.name,
            description: item.description || `${item.name} - ${categoryName}`,
          image: item.imageUrl?.startsWith('http') ? item.imageUrl : `${actualBaseUrl}${item.imageUrl || ''}`,
          url: `${actualBaseUrl}/${basePath}/${category}/${item.id}`,
            sku: String(item.id),
            category: categoryName,
            brand: {
              '@type': 'Brand',
              name: 'My Office',
            },
            offers: {
              '@type': 'Offer',
            url: `${actualBaseUrl}/${basePath}/${category}/${item.id}`,
            priceCurrency: 'AMD',
            availability: item.isAvailable 
              ? 'https://schema.org/InStock' 
              : 'https://schema.org/PreOrder',
            seller: {
              '@type': 'Organization',
              name: 'My Office Armenia',
              url: actualBaseUrl,
            },
            },
          },
        };
        
        // Add price if available
        if (numericPrice) {
          listItem.item.offers.price = String(numericPrice);
        }
        
        return listItem;
      }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

