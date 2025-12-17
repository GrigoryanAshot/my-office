import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArmchairDetailClient from './ArmchairDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchProductById, getRedisKeyForCategory, getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { generateProductMetadata } from '@/lib/seo/productMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('armchairs');
  const categoryName = getCategoryDisplayName('armchairs');
  
  const product = await fetchProductById(id, redisKey);
  
  if (!product) {
    return {
      title: 'Product Not Found | My Office',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata({
    product,
    category: 'armchairs',
    categoryName,
  });
}

export default async function ArmchairDetailPage({ params }: PageProps) {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('armchairs');
  const categoryName = getCategoryDisplayName('armchairs');
  
  const product = await fetchProductById(id, redisKey);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductSchema
        product={product}
        category="armchairs"
        categoryName={categoryName}
      />
      <ArmchairDetailClient item={product} />
    </>
  );
}
