import { Redis } from '@upstash/redis';
import { getRedisKeyForCategory } from './fetchProduct';
import { ProductData } from './productMetadata';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Fetches all products for a category from Redis
 * This is a server-side function for use in server components
 */
export async function fetchCategoryProducts(
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

