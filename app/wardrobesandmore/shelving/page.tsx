import { Metadata } from 'next';
import ShelvingPageClient from './ShelvingPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('shelving');
  const items = await fetchCategoryProducts('shelving');
  
  return generateCategoryMetadata({
    category: 'shelving',
    categoryName,
    basePath: 'wardrobesandmore',
    itemCount: items.length,
  });
}

// Main page component (Server Component)
export default async function ShelvingPage() {
  const categoryName = getCategoryDisplayName('shelving');
  const items = await fetchCategoryProducts('shelving');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Պահարաններ և ավելին', url: 'https://www.my-office.am/wardrobesandmore' },
    { name: categoryName, url: 'https://www.my-office.am/wardrobesandmore/shelving' },
  ];

  return (
    <>
      {/* Collection Schema for structured data */}
      <CollectionSchema
        category="shelving"
        categoryName={categoryName}
        items={items}
        basePath="wardrobesandmore"
      />
      
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />
      
      {/* Client component for interactive UI */}
      <ShelvingPageClient initialItems={items} />
    </>
  );
} 