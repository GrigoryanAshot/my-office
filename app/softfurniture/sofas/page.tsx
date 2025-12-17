import { Metadata } from 'next';
import SofasPageClient from './SofasPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('sofas');
  const items = await fetchCategoryProducts('sofas');
  
  return generateCategoryMetadata({
    category: 'sofas',
    categoryName,
    basePath: 'softfurniture',
    itemCount: items.length,
  });
}

// Main page component (Server Component)
export default async function SofasPage() {
  const categoryName = getCategoryDisplayName('sofas');
  const items = await fetchCategoryProducts('sofas');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Փափուկ կահույք', url: 'https://www.my-office.am/softfurniture' },
    { name: categoryName, url: 'https://www.my-office.am/softfurniture/sofas' },
  ];

  return (
    <>
      {/* Collection Schema for structured data */}
      <CollectionSchema
        category="sofas"
        categoryName={categoryName}
        items={items}
        basePath="softfurniture"
      />
      
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />
      
      {/* Client component for interactive UI */}
      <SofasPageClient initialItems={items} />
    </>
  );
}
