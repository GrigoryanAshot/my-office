import { Metadata } from 'next';
import PoufsPageClient from './PoufsPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('poufs');
  const items = await fetchCategoryProducts('poufs');
  
  return generateCategoryMetadata({
    category: 'poufs',
    categoryName,
    basePath: 'softfurniture',
    itemCount: items.length,
  });
}

export default async function PoufsPage() {
  const categoryName = getCategoryDisplayName('poufs');
  const items = await fetchCategoryProducts('poufs');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Փափուկ կահույք', url: 'https://www.my-office.am/softfurniture' },
    { name: categoryName, url: 'https://www.my-office.am/softfurniture/poufs' },
  ];

  return (
    <>
      <CollectionSchema
        category="poufs"
        categoryName={categoryName}
        items={items}
        basePath="softfurniture"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <PoufsPageClient initialItems={items} />
    </>
  );
}
