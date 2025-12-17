import { ProductData } from './productMetadata';
import { getBaseUrl } from './getBaseUrl';

export interface ProductSchemaProps {
  product: ProductData;
  category: string;
  categoryName: string;
  baseUrl?: string;
  basePath?: string; // e.g., 'softfurniture' or 'other'
}

/**
 * Generates Product schema (JSON-LD) for structured data
 * This helps search engines understand product information
 */
export function generateProductSchema({
  product,
  category,
  categoryName,
  baseUrl,
  basePath = 'softfurniture',
}: ProductSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  const productUrl = `${actualBaseUrl}/${basePath}/${category}/${product.id}`;
  const images = [product.imageUrl, ...(product.images || [])];
  
  // Extract numeric price (remove currency symbols, commas, and "դրամ")
  const priceMatch = product.price.match(/[\d,]+/);
  const numericPrice = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : null;
  
  // Determine availability
  const availability = product.isAvailable 
    ? 'https://schema.org/InStock' 
    : 'https://schema.org/PreOrder';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} - ${categoryName} from My Office Armenia`,
    image: images.map(img => img.startsWith('http') ? img : `${actualBaseUrl}${img}`),
    sku: String(product.id),
    category: categoryName,
    brand: {
      '@type': 'Brand',
      name: 'My Office',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'AMD',
      price: numericPrice ? String(numericPrice) : undefined,
      availability: availability,
      seller: {
        '@type': 'Organization',
        name: 'My Office Armenia',
        url: baseUrl,
      },
      ...(product.oldPrice && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: numericPrice ? String(numericPrice) : undefined,
          priceCurrency: 'AMD',
        },
      }),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '10',
    },
  };

  // Remove undefined fields
  if (!numericPrice) {
    delete (schema.offers as any).price;
  }

  return schema;
}

