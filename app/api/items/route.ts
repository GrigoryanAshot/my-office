import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'items:data';

export async function GET(request: Request) {
  try {
    const dataStr = await redis.get(DATA_KEY);
    let items: any[];
    if (typeof dataStr === 'string') {
      try {
        items = JSON.parse(dataStr);
        if (!Array.isArray(items)) {
          items = [];
        }
      } catch {
        items = [];
      }
    } else {
      items = [];
    }
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const filteredItems = type ? items.filter((item: any) => item.type === type) : items;
    return NextResponse.json(filteredItems);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read items', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    if (!items) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }
    await redis.set(DATA_KEY, JSON.stringify(items));
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save items', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 