import { Metadata } from 'next';
import ArmchairsPageClient from './ArmchairsPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('armchairs');
  const items = await fetchCategoryProducts('armchairs');
  
  return generateCategoryMetadata({
    category: 'armchairs',
    categoryName,
    basePath: 'softfurniture',
    itemCount: items.length,
  });
}

export default async function ArmchairsPage() {
  const categoryName = getCategoryDisplayName('armchairs');
  const items = await fetchCategoryProducts('armchairs');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Փափուկ կահույք', url: 'https://www.my-office.am/softfurniture' },
    { name: categoryName, url: 'https://www.my-office.am/softfurniture/armchairs' },
  ];

  return (
    <>
      <CollectionSchema
        category="armchairs"
        categoryName={categoryName}
        items={items}
        basePath="softfurniture"
            />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ArmchairsPageClient initialItems={items} />
    </>
  );
} 
