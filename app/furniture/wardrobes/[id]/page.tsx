import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WardrobeDetailClient from './WardrobeDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchProductById, getRedisKeyForCategory, getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { generateProductMetadata } from '@/lib/seo/productMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('wardrobes');
  const categoryName = getCategoryDisplayName('wardrobes');
  
  const product = await fetchProductById(id, redisKey);
  
  if (!product) {
    return {
      title: 'Product Not Found | My Office',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata({
    product,
    category: 'wardrobes',
    categoryName,
    basePath: 'furniture',
  });
}

export default async function WardrobeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('wardrobes');
  const categoryName = getCategoryDisplayName('wardrobes');
  
  const product = await fetchProductById(id, redisKey);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductSchema
        product={product}
        category="wardrobes"
        categoryName={categoryName}
        basePath="furniture"
      />
      <WardrobeDetailClient item={product} />
    </>
  );
} 