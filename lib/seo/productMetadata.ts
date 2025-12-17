import { Metadata } from 'next';
import { getKeywordsForCategory, categoryKeywords } from './keywords';

export interface ProductData {
  id: number | string;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  imageUrl: string;
  images?: string[];
  type?: string;
  url?: string;
  isAvailable: boolean;
}

export interface ProductMetadataOptions {
  product: ProductData;
  category: string;
  categoryName: string;
  baseUrl?: string;
  basePath?: string; // e.g., 'softfurniture' or 'other'
}

/**
 * Generates SEO metadata for product pages
 */
export function generateProductMetadata({
  product,
  category,
  categoryName,
  baseUrl = 'https://www.my-office.am',
  basePath = 'softfurniture',
}: ProductMetadataOptions): Metadata {
  const productUrl = `${baseUrl}/${basePath}/${category}/${product.id}`;
  const images = [product.imageUrl, ...(product.images || [])];
  const primaryImage = images[0];
  
  // Extract numeric price for schema (remove currency symbols and commas)
  const priceMatch = product.price.match(/[\d,]+/);
  const numericPrice = priceMatch ? priceMatch[0].replace(/,/g, '') : null;
  
  // Generate description (limit to 160 chars for SEO)
  const metaDescription = product.description
    ? product.description.substring(0, 157).trim() + (product.description.length > 157 ? '...' : '')
    : `Պատվիրեք ${product.name} - ${categoryName} My Office-ից: Բարձրորակ գրասենյակային կահույք Երևանում և Հայաստանում`;

  // Generate optimized title with keywords
  // Format: Product Name | Armenian | Translit | English | Location
  const categoryKw = categoryKeywords[category] || {};
  const armenianKw = categoryKw.armenian?.[0] || categoryName;
  const translitKw = categoryKw.transliteration?.[0] || '';
  const englishKw = categoryKw.primary?.find(k => !/[ա-ֆ]/.test(k)) || categoryKw.primary?.[0] || category;
  const locationKw = categoryKw.location?.[0] || 'Armenia';
  
  // Build title: Product Name | Armenian | Translit | English | My Office
  const titleParts = [product.name];
  if (armenianKw && armenianKw !== categoryName) titleParts.push(armenianKw);
  if (translitKw) titleParts.push(translitKw);
  if (englishKw) titleParts.push(englishKw);
  titleParts.push('My Office');
  
  const title = titleParts.join(' | ');

  // Get comprehensive keywords for this category
  const keywords = getKeywordsForCategory(
    category,
    product.name,
    product.type
  );

  return {
    title,
    description: metaDescription,
    keywords,
    openGraph: {
      type: 'website',
      url: productUrl,
      title: `${product.name} | My Office`,
      description: metaDescription,
      siteName: 'My Office Armenia',
      images: images.slice(0, 4).map((img) => ({
        url: img.startsWith('http') ? img : `${baseUrl}${img}`,
        width: 1200,
        height: 630,
        alt: product.name,
      })),
      locale: 'hy_AM',
      alternateLocale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | My Office`,
      description: metaDescription,
      images: [primaryImage.startsWith('http') ? primaryImage : `${baseUrl}${primaryImage}`],
    },
    alternates: {
      canonical: productUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

