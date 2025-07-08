import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'poufs:data';

export async function GET() {
  try {
    const dataStr = await redis.get(DATA_KEY);
    const data = dataStr ? JSON.parse(dataStr) : { items: [], types: [] };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Validate structure
    if (!data || typeof data !== 'object' || !Array.isArray(data.items) || !Array.isArray(data.types)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    await redis.set(DATA_KEY, JSON.stringify(data));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 