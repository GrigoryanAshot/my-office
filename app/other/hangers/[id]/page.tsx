import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HangerDetailClient from './HangerDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchProductById, getRedisKeyForCategory, getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { generateProductMetadata } from '@/lib/seo/productMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('hangers');
  const categoryName = getCategoryDisplayName('hangers');
  
  const product = await fetchProductById(id, redisKey);
  
  if (!product) {
    return {
      title: 'Product Not Found | My Office',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata({
    product,
    category: 'hangers',
    categoryName,
    basePath: 'other',
  });
}

export default async function HangerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('hangers');
  const categoryName = getCategoryDisplayName('hangers');
  
  const product = await fetchProductById(id, redisKey);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductSchema
        product={product}
        category="hangers"
        categoryName={categoryName}
        basePath="other"
      />
      <HangerDetailClient item={product} />
    </>
  );
} 