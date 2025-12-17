import { ProductData } from '@/lib/seo/productMetadata';
import { generateProductSchema } from '@/lib/seo/productSchema';
import { getBaseUrl } from '@/lib/seo/getBaseUrl';

interface ProductSchemaProps {
  product: ProductData;
  category: string;
  categoryName: string;
  baseUrl?: string;
  basePath?: string;
}

/**
 * Component that renders Product schema (JSON-LD) for SEO
 * This should be included in the <head> of product pages
 */
export default function ProductSchema({
  product,
  category,
  categoryName,
  baseUrl,
  basePath = 'softfurniture',
}: ProductSchemaProps) {
  const actualBaseUrl = baseUrl || getBaseUrl();
  const schema = generateProductSchema({
    product,
    category,
    categoryName,
    baseUrl: actualBaseUrl,
    basePath,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

