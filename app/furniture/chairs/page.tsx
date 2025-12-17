import { Metadata } from 'next';
import ChairsPageClient from './ChairsPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('chairs');
  const items = await fetchCategoryProducts('chairs');
  
  return generateCategoryMetadata({
    category: 'chairs',
    categoryName,
    basePath: 'furniture',
    itemCount: items.length,
  });
}

// Main page component (Server Component)
export default async function ChairsPage() {
  const categoryName = getCategoryDisplayName('chairs');
  const items = await fetchCategoryProducts('chairs');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Սեղաններ և աթոռներ', url: 'https://www.my-office.am/furniture' },
    { name: categoryName, url: 'https://www.my-office.am/furniture/chairs' },
  ];

  return (
    <>
      {/* Collection Schema for structured data */}
      <CollectionSchema
        category="chairs"
        categoryName={categoryName}
        items={items}
        basePath="furniture"
      />
      
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />
      
      {/* Client component for interactive UI */}
      <ChairsPageClient initialItems={items} />
    </>
  );
}
