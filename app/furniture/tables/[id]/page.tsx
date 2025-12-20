import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TableDetailClient from './TableDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchProductById, getRedisKeyForCategory, getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { generateProductMetadata } from '@/lib/seo/productMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('tables');
  const categoryName = getCategoryDisplayName('tables');
  
  const product = await fetchProductById(id, redisKey);
  
  if (!product) {
    return {
      title: 'Product Not Found | My Office',
      description: 'The requested product could not be found.',
    };
        }
        
  return generateProductMetadata({
    product,
    category: 'tables',
    categoryName,
    basePath: 'furniture',
  });
}

export default async function TableDetailPage({ params }: PageProps) {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('tables');
  const categoryName = getCategoryDisplayName('tables');
  
  const product = await fetchProductById(id, redisKey);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductSchema
        product={product}
        category="tables"
        categoryName={categoryName}
        basePath="furniture"
      />
      <TableDetailClient item={product} />
    </>
  );
} 