import { Metadata } from 'next';
import PodiumPageClient from './PodiumPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('podium');
  const items = await fetchCategoryProducts('podium');
  
  return generateCategoryMetadata({
    category: 'podium',
    categoryName,
    basePath: 'other',
    itemCount: items.length,
  });
}

export default async function PodiumPage() {
  const categoryName = getCategoryDisplayName('podium');
  const items = await fetchCategoryProducts('podium');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Այլ ապրանքներ', url: 'https://www.my-office.am/other' },
    { name: categoryName, url: 'https://www.my-office.am/other/podium' },
  ];

  return (
    <>
      <CollectionSchema
        category="podium"
        categoryName={categoryName}
        items={items}
        basePath="other"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <PodiumPageClient initialItems={items} />
    </>
  );
}
