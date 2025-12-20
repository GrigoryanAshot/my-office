import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChairDetailClient from './ChairDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchProductById, getRedisKeyForCategory, getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { generateProductMetadata } from '@/lib/seo/productMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('chairs');
  const categoryName = getCategoryDisplayName('chairs');
  
  const product = await fetchProductById(id, redisKey);
  
  if (!product) {
    return {
      title: 'Product Not Found | My Office',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata({
    product,
    category: 'chairs',
    categoryName,
    basePath: 'furniture',
  });
}

export default async function ChairDetailPage({ params }: PageProps) {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('chairs');
  const categoryName = getCategoryDisplayName('chairs');
  
  const product = await fetchProductById(id, redisKey);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductSchema
        product={product}
        category="chairs"
        categoryName={categoryName}
        basePath="furniture"
      />
      <ChairDetailClient item={product} />
    </>
  );
} 