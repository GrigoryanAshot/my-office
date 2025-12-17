import { Metadata } from 'next';
import HangersPageClient from './HangersPageClient';
import CollectionSchema from '@/components/seo/CollectionSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateCategoryMetadata } from '@/lib/seo/categoryMetadata';
import { fetchCategoryProducts } from '@/lib/seo/fetchCategory';
import { getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function fetchHangersData() {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return { items: [], types: [] };
    }

    const dataStr = await redis.get('metal-metal-hangers:data');
    if (!dataStr) {
      return { items: [], types: [] };
    }
    
    const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
    return {
      items: data.items || [],
      types: data.types || [],
    };
  } catch (error) {
    console.error('Error fetching hangers data:', error);
    return { items: [], types: [] };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const categoryName = getCategoryDisplayName('hangers');
  const { items } = await fetchHangersData();
  
  return generateCategoryMetadata({
    category: 'hangers',
    categoryName,
    basePath: 'other',
    itemCount: items.length,
  });
}

export default async function HangersPage() {
  const categoryName = getCategoryDisplayName('hangers');
  const { items, types } = await fetchHangersData();
  
  const breadcrumbItems = [
    { name: 'Գլխավոր', url: 'https://www.my-office.am' },
    { name: 'Այլ ապրանքներ', url: 'https://www.my-office.am/other' },
    { name: categoryName, url: 'https://www.my-office.am/other/hangers' },
  ];

  return (
    <>
      <CollectionSchema
        category="hangers"
        categoryName={categoryName}
        items={items}
        basePath="other"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <HangersPageClient initialItems={items} initialTypes={types} />
    </>
  );
}
