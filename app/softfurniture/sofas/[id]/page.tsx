import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SofaDetailClient from './SofaDetailClient';
import ProductSchema from '@/components/seo/ProductSchema';
import { fetchProductById, getRedisKeyForCategory, getCategoryDisplayName } from '@/lib/seo/fetchProduct';
import { generateProductMetadata } from '@/lib/seo/productMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('sofas');
  const categoryName = getCategoryDisplayName('sofas');
  
  const product = await fetchProductById(id, redisKey);
  
  if (!product) {
    return {
      title: 'Product Not Found | My Office',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata({
    product,
    category: 'sofas',
    categoryName,
  });
}

// Main page component (Server Component)
export default async function SofaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const redisKey = getRedisKeyForCategory('sofas');
  const categoryName = getCategoryDisplayName('sofas');
  
  const product = await fetchProductById(id, redisKey);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* Product Schema for structured data (JSON-LD) */}
      <ProductSchema
        product={product}
        category="sofas"
        categoryName={categoryName}
      />
      
      {/* Client component for interactive UI */}
      <SofaDetailClient item={product} />
    </>
  );
}
