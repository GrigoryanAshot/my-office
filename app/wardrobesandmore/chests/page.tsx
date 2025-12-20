import { Metadata } from 'next';
import ChestsPageClient from './ChestsPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('chests');
  const items = await fetchCategoryProducts('chests');
  
  return generateCategoryMetadata({
    category: 'chests',
    categoryName,
    basePath: 'wardrobesandmore',
    itemCount: items.length,
  });
}

export default async function ChestsPage() {
  const categoryName = getCategoryDisplayName('chests');
  const items = await fetchCategoryProducts('chests');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Պահարաններ և ավելին', url: 'https://www.my-office.am/wardrobesandmore' },
    { name: categoryName, url: 'https://www.my-office.am/wardrobesandmore/chests' },
  ];

  return (
    <>
      <CollectionSchema
        category="chests"
        categoryName={categoryName}
        items={items}
        basePath="wardrobesandmore"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ChestsPageClient initialItems={items} />
    </>
  );
} 