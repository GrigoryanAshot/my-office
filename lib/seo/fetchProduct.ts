import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface ProductData {
  id: number | string;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  imageUrl: string;
  images?: string[];
  type?: string;
  url?: string;
  isAvailable: boolean;
}

/**
 * Fetches a single product from Redis by ID
 * This is a server-side function for use in server components
 */
export async function fetchProductById(
  productId: string,
  redisKey: string
): Promise<ProductData | null> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn('Redis not configured');
      return null;
    }

    const dataStr = await redis.get(redisKey);
    
    if (!dataStr) {
      return null;
    }
    
    const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
    const product = (data.items || []).find(
      (item: any) => String(item.id) === String(productId)
    );
    
    return product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Maps category to Redis key
 */
export function getRedisKeyForCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    sofas: 'sofas:data:test',
    armchairs: 'armchairs:data:test',
    poufs: 'poufs:data',
    chairs: 'chairs:data',
    tables: 'tables:data:test',
    wardrobes: 'wardrobes:data:test',
    chests: 'chests:data',
    takht: 'takht:data:test',
    stands: 'stands:data',
    shelving: 'shelving:data',
    hangers: 'metal-metal-hangers:data',
    'wall-decor': 'wall-decor:data',
    'wall_decor': 'wall-decor:data',
    whiteboard: 'whiteboard:data',
    podium: 'podium:data',
  };
  
  return categoryMap[category] || `${category}:data:test`;
}

/**
 * Maps category to display name
 */
export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    sofas: 'Բազմոցներ',
    armchairs: 'Բազկաթոռներ',
    poufs: 'Պուֆեր',
    chairs: 'Աթոռներ',
    tables: 'Սեղաններ',
    wardrobes: 'Զգեստապահարաններ',
    chests: 'Պահարաններ',
    takht: 'Տախտ',
    stands: 'Դարակներ',
    shelving: 'Դարակաշարեր',
    hangers: 'Կախիչներ',
    'wall-decor': 'Պատերի դեկոր',
    'wall_decor': 'Պատերի դեկոր',
    whiteboard: 'Սպիտակ գրատախտակ',
    podium: 'Ավագանիստ',
    'doors_takht': 'Դռներ տախտ',
  };
  
  return categoryNames[category] || category;
}

