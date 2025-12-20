import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface SaleItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  link: string;
  source?: string;
  originalItem?: any;
  oldPrice?: string;
  images?: string[];
}

/**
 * Fetches all sale items from Redis
 */
export async function fetchSaleItems(): Promise<SaleItem[]> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn('Redis not configured');
      return [];
    }

    const DATA_KEY = 'sale-slider:data';
    const dataStr = await redis.get(DATA_KEY);
    
    if (!dataStr) {
      return [];
    }
    
    const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
    const items = data.items || [];
    
    // Convert to sequential IDs starting from 1
    return items.map((item: any, index: number) => ({
      ...item,
      id: index + 1,
    }));
  } catch (error) {
    console.error('Error fetching sale items:', error);
    return [];
  }
}

/**
 * Fetches a single sale item by ID
 */
export async function fetchSaleItemById(id: string): Promise<SaleItem | null> {
  try {
    const items = await fetchSaleItems();
    const item = items.find((item) => String(item.id) === String(id));
    return item || null;
  } catch (error) {
    console.error('Error fetching sale item:', error);
    return null;
  }
}
