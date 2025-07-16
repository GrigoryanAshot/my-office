import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'chests:data';

// Add a simple test function to verify Redis connection
async function testRedisConnection() {
  try {
    console.log('Testing Redis connection...');
    console.log('Redis URL:', process.env.UPSTASH_REDIS_REST_URL ? 'Set' : 'Not set');
    console.log('Redis Token:', process.env.UPSTASH_REDIS_REST_TOKEN ? 'Set' : 'Not set');
    
    await redis.set('test:connection', 'test-value');
    const testValue = await redis.get('test:connection');
    console.log('Redis test value:', testValue);
    return testValue === 'test-value';
  } catch (error) {
    console.error('Redis connection test failed:', error);
    return false;
  }
}

export async function GET() {
  try {
    const dataStr = await redis.get(DATA_KEY);
    let data = { items: [], types: [] };
    if (typeof dataStr === 'string') {
      try { data = JSON.parse(dataStr); } catch { }
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Test Redis connection first
    const redisConnected = await testRedisConnection();
    const data = await request.json();

    // Always get the current data first
    let currentDataStr = await redis.get(DATA_KEY);
    let currentData: { items: any[]; types: any[] } = { items: [], types: [] };
    if (typeof currentDataStr === 'string') {
      try {
        currentData = JSON.parse(currentDataStr);
      } catch {
        currentData = { items: [], types: [] };
      }
    } else if (typeof currentDataStr === 'object' && currentDataStr !== null && 'items' in currentDataStr && 'types' in currentDataStr) {
      currentData = currentDataStr as { items: any[]; types: any[] };
    }

    // If typeName is present, always merge with existing types
    if (data.typeName && !data.name) {
      data.types = Array.from(new Set([...(currentData.types || []), data.typeName]));
    }

    // Merge logic for types
    let updatedTypes = currentData.types;
    if (Array.isArray(data.types) && data.types.length > 0) {
      updatedTypes = Array.from(new Set([...(currentData.types || []), ...data.types]));
    }

    // Merge logic for items
    let updatedItems = currentData.items;
    if (Array.isArray(data.items) && data.items.length > 0) {
      // Merge unique items by id (or by value if no id)
      const existingItems = currentData.items || [];
      const newItems = data.items;
      const mergedItems = [...existingItems];
      newItems.forEach((item: any) => {
        if (item && item.id !== undefined) {
          if (!mergedItems.some((i: any) => i.id === item.id)) {
            mergedItems.push(item);
          }
        } else {
          if (!mergedItems.some((i: any) => JSON.stringify(i) === JSON.stringify(item))) {
            mergedItems.push(item);
          }
        }
      });
      updatedItems = mergedItems;
    }

    const finalData = { items: updatedItems, types: updatedTypes };
    await redis.set(DATA_KEY, JSON.stringify(finalData));
    const afterSet = await redis.get(DATA_KEY);
    
    return NextResponse.json({
      debug: {
        action: 'updateItemsOrTypes',
        dataReceived: data,
        currentData,
        finalData,
        afterSet,
        redisConnected
      },
      success: true
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { typeName } = await request.json();
    let dataStr = await redis.get(DATA_KEY);
    let data: any = { items: [], types: [] };
    if (typeof dataStr === 'string') {
      try { data = JSON.parse(dataStr); } catch { }
    }
    data.types = (data.types || []).filter((type: string) => type !== typeName);
    data.items = (data.items || []).map((item: any) => item.type === typeName ? { ...item, type: '' } : item);
    await redis.set(DATA_KEY, JSON.stringify(data));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete type', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 