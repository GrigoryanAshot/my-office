import { Metadata } from 'next';
import WallDecorPageClient from './WallDecorPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('wall_decor');
  const items = await fetchCategoryProducts('wall-decor');
  
  return generateCategoryMetadata({
    category: 'wall-decor',
    categoryName,
    basePath: 'other',
    itemCount: items.length,
  });
}

export default async function WallDecorPage() {
  const categoryName = getCategoryDisplayName('wall_decor');
  const items = await fetchCategoryProducts('wall-decor');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Այլ ապրանքներ', url: 'https://www.my-office.am/other' },
    { name: categoryName, url: 'https://www.my-office.am/other/wall_decor' },
  ];

  return (
    <>
      <CollectionSchema
        category="wall-decor"
        categoryName={categoryName}
        items={items}
        basePath="other"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WallDecorPageClient initialItems={items} />
    </>
  );
}
