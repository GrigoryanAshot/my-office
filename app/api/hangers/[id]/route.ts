import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'metal-metal-hangers:data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Hangers detail API: Looking for item with ID:', id);
    
    // Get data from Redis
    const dataStr = await redis.get(DATA_KEY);
    
    if (!dataStr) {
      console.log('Hangers detail API: No data found in Redis');
      return NextResponse.json({ error: 'Hangers data not found' }, { status: 404 });
    }
    
    const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
    console.log('Hangers detail API: Data from Redis:', data ? 'exists' : 'not found');
    
    const item = (data.items || []).find((item: any) => String(item.id) === String(id));
    
    if (!item) {
      console.log('Hangers detail API: Item not found with ID:', id);
      return NextResponse.json({ error: 'Hanger not found' }, { status: 404 });
    }
    
    console.log('Hangers detail API: Found item:', item.name);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching hanger item:', error);
    return NextResponse.json({ error: 'Failed to fetch hanger' }, { status: 500 });
  }
} 