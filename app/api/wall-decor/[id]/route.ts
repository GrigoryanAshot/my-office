import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'wall-decor:data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Wall decor detail API: Looking for item with ID:', id);
    
    // Get data from Redis
    const dataStr = await redis.get(DATA_KEY);
    
    if (!dataStr) {
      console.log('Wall decor detail API: No data found in Redis');
      return new NextResponse('Item not found', { status: 404 });
    }
    
    const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
    console.log('Wall decor detail API: Data from Redis:', data ? 'exists' : 'not found');
    
    const item = (data.items || []).find((item: any) => String(item.id) === String(id));
    
    if (!item) {
      console.log('Wall decor detail API: Item not found with ID:', id);
      return new NextResponse('Item not found', { status: 404 });
    }
    
    console.log('Wall decor detail API: Found item:', item.name);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching wall decor item:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 