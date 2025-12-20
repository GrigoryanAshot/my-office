import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PodiumDetailClient from './PodiumDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchProductById, getRedisKeyForCategory, getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { generateProductMetadata } from '@/lib/seo/productMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('podium');
  const categoryName = getCategoryDisplayName('podium');
  
  const product = await fetchProductById(id, redisKey);
  
  if (!product) {
    return {
      title: 'Product Not Found | My Office',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata({
    product,
    category: 'podium',
    categoryName,
    basePath: 'other',
  });
}

export default async function PodiumDetailPage({ params }: PageProps) {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('podium');
  const categoryName = getCategoryDisplayName('podium');
  
  const product = await fetchProductById(id, redisKey);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductSchema
        product={product}
        category="podium"
        categoryName={categoryName}
        basePath="other"
      />
      <PodiumDetailClient item={product} />
    </>
  );
} 