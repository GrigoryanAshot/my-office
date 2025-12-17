import { Metadata } from 'next';
import TablesPageClient from './TablesPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('tables');
  const items = await fetchCategoryProducts('tables');
  
  return generateCategoryMetadata({
    category: 'tables',
    categoryName,
    basePath: 'furniture',
    itemCount: items.length,
  });
}

// Main page component (Server Component)
export default async function TablesPage() {
  const categoryName = getCategoryDisplayName('tables');
  const items = await fetchCategoryProducts('tables');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Սեղաններ և աթոռներ', url: 'https://www.my-office.am/furniture' },
    { name: categoryName, url: 'https://www.my-office.am/furniture/tables' },
  ];

  return (
    <>
      {/* Collection Schema for structured data */}
      <CollectionSchema
        category="tables"
        categoryName={categoryName}
        items={items}
        basePath="furniture"
      />
      
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />
      
      {/* Client component for interactive UI */}
      <TablesPageClient initialItems={items} />
    </>
  );
}
