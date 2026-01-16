import { Redis } from '@upstash/redis';
import { getRedisKeyForCategory } from './fetchProduct';
import { ProductData } from './productMetadata';
import { unstable_cache } from 'next/cache';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Internal function to fetch products from Redis
 * This is wrapped with Next.js cache for better performance
 */
async function fetchCategoryProductsFromRedis(
  category: string
): Promise<ProductData[]> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn('Redis not configured');
      return [];
    }

    const redisKey = getRedisKeyForCategory(category);
    const dataStr = await redis.get(redisKey);
    
    if (!dataStr) {
      return [];
    }
    
    const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
    const items = data.items || [];
    
    return items.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price || '',
      oldPrice: item.oldPrice,
      imageUrl: item.imageUrl || '',
      images: item.images || [],
      type: item.type || '',
      url: item.url || '',
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
    }));
  } catch (error) {
    console.error('Error fetching category products:', error);
    return [];
  }
}

/**
 * Fetches all products for a category from Redis with caching
 * This is a server-side function for use in server components
 * 
 * Cache duration: 60 seconds (revalidate every minute)
 * This balances freshness with performance
 */
export async function fetchCategoryProducts(
  category: string
): Promise<ProductData[]> {
  // Use Next.js unstable_cache for server-side caching
  // This reduces Redis calls and improves response time
  const cachedFetch = unstable_cache(
    async (cat: string) => fetchCategoryProductsFromRedis(cat),
    [`category-products-${category}`],
    {
      revalidate: 10, // Revalidate every 10 seconds (reduced from 60 for better freshness)
      tags: [`category-${category}`], // Allow manual revalidation via tag
    }
  );

  return cachedFetch(category);
}

