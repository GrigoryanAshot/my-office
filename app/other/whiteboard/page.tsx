import { Metadata } from 'next';
import WhiteboardPageClient from './WhiteboardPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';

export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('whiteboard');
  const items = await fetchCategoryProducts('whiteboard');
  
  return generateCategoryMetadata({
    category: 'whiteboard',
    categoryName,
    basePath: 'other',
    itemCount: items.length,
  });
}

export default async function WhiteboardPage() {
  const categoryName = getCategoryDisplayName('whiteboard');
  const items = await fetchCategoryProducts('whiteboard');
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Այլ ապրանքներ', url: 'https://www.my-office.am/other' },
    { name: categoryName, url: 'https://www.my-office.am/other/whiteboard' },
  ];

  return (
    <>
      <CollectionSchema
        category="whiteboard"
        categoryName={categoryName}
        items={items}
        basePath="other"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WhiteboardPageClient initialItems={items} />
    </>
  );
}
