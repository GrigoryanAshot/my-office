import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WhiteboardDetailClient from './WhiteboardDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchProductById, getRedisKeyForCategory, getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { generateProductMetadata } from '@/lib/seo/productMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('whiteboard');
  const categoryName = getCategoryDisplayName('whiteboard');
  
  const product = await fetchProductById(id, redisKey);
  
  if (!product) {
    return {
      title: 'Product Not Found | My Office',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata({
    product,
    category: 'whiteboard',
    categoryName,
    basePath: 'other',
  });
}

export default async function WhiteboardDetailPage({ params }: PageProps) {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('whiteboard');
  const categoryName = getCategoryDisplayName('whiteboard');
  
  const product = await fetchProductById(id, redisKey);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductSchema
        product={product}
        category="whiteboard"
        categoryName={categoryName}
        basePath="other"
      />
      <WhiteboardDetailClient item={product} />
    </>
  );
}
