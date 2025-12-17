import { Metadata } from 'next';
import { getKeywordsForCategory, categoryKeywords } from './keywords';
import { getCategoryDisplayName } from './fetchProduct';

export interface CategoryMetadataOptions {
  category: string;
  categoryName: string;
  baseUrl?: string;
  basePath?: string; // e.g., 'softfurniture' or 'other'
  itemCount?: number;
}

/**
 * Generates SEO metadata for category listing pages
 */
export function generateCategoryMetadata({
  category,
  categoryName,
  baseUrl = 'https://www.my-office.am',
  basePath = 'softfurniture',
  itemCount = 0,
}: CategoryMetadataOptions): Metadata {
  const categoryUrl = `${baseUrl}/${basePath}/${category}`;
  const categoryKw = categoryKeywords[category] || {};
  
  // Get optimized title with keywords
  const armenianKw = categoryKw.armenian?.[0] || categoryName;
  const translitKw = categoryKw.transliteration?.[0] || '';
  const englishKw = categoryKw.primary?.find(k => !/[ա-ֆ]/.test(k)) || categoryKw.primary?.[0] || category;
  const locationKw = categoryKw.location?.[0] || 'Armenia';
  
  // Build title: Armenian | Translit | English | Location | My Office
  const titleParts: string[] = [];
  if (armenianKw) titleParts.push(armenianKw);
  if (translitKw) titleParts.push(translitKw);
  if (englishKw) titleParts.push(englishKw);
  if (locationKw && !titleParts.includes(locationKw)) titleParts.push(locationKw);
  titleParts.push('My Office');
  
  const title = titleParts.join(' | ');
  
  // Generate description
  const itemCountText = itemCount > 0 ? ` ${itemCount}+` : '';
  const metaDescription = `Գտեք${itemCountText} ${categoryName.toLowerCase()} My Office-ից: Բարձրորակ գրասենյակային կահույք Երևանում և Հայաստանում: Անվճար առաքում, ժամանակակից դիզայն, էրգոնոմիկ լուծումներ:`;
  
  // Get keywords for this category
  const keywords = getKeywordsForCategory(category);
  
  return {
    title,
    description: metaDescription,
    keywords,
    openGraph: {
      type: 'website',
      url: categoryUrl,
      title: `${categoryName} | My Office`,
      description: metaDescription,
      siteName: 'My Office Armenia',
      images: [
        {
          url: `${baseUrl}/images/og-category.jpg`,
          width: 1200,
          height: 630,
          alt: categoryName,
        }
      ],
      locale: 'hy_AM',
      alternateLocale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | My Office`,
      description: metaDescription,
      images: [`${baseUrl}/images/og-category.jpg`],
    },
    alternates: {
      canonical: categoryUrl,
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

