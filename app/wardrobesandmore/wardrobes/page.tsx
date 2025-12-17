import { Metadata } from 'next';
import WardrobesPageClient from './WardrobesPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('wardrobes');
  const items = await fetchCategoryProducts('wardrobes');
  
  return generateCategoryMetadata({
    category: 'wardrobes',
    categoryName,
    basePath: 'wardrobesandmore',
    itemCount: items.length,
  });
}

// Main page component (Server Component)
export default async function WardrobesPage() {
  const categoryName = getCategoryDisplayName('wardrobes');
  const items = await fetchCategoryProducts('wardrobes');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Պահարաններ և ավելին', url: 'https://www.my-office.am/wardrobesandmore' },
    { name: categoryName, url: 'https://www.my-office.am/wardrobesandmore/wardrobes' },
  ];

  return (
    <>
      {/* Collection Schema for structured data */}
      <CollectionSchema
        category="wardrobes"
        categoryName={categoryName}
        items={items}
        basePath="wardrobesandmore"
      />
      
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />
      
      {/* Client component for interactive UI */}
      <WardrobesPageClient initialItems={items} />
    </>
  );
} 