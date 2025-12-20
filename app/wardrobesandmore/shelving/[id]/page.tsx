import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ShelvingDetailClient from './ShelvingDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchProductById, getRedisKeyForCategory, getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { generateProductMetadata } from '@/lib/seo/productMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('shelving');
  const categoryName = getCategoryDisplayName('shelving');
  
  const product = await fetchProductById(id, redisKey);
  
  if (!product) {
    return {
      title: 'Product Not Found | My Office',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata({
    product,
    category: 'shelving',
    categoryName,
    basePath: 'wardrobesandmore',
  });
}

export default async function ShelvingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('shelving');
  const categoryName = getCategoryDisplayName('shelving');
  
  const product = await fetchProductById(id, redisKey);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductSchema
        product={product}
        category="shelving"
        categoryName={categoryName}
        basePath="wardrobesandmore"
      />
      <ShelvingDetailClient item={product} />
    </>
  );
} 