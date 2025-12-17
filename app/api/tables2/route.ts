import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'tables:data:test';

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
    // Check if Redis is configured
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.log('Redis not configured, returning empty data');
      return NextResponse.json({
        items: [],
        types: [],
        debug: {
          redisUrl: 'not set',
          redisToken: 'not set',
          redisKey: DATA_KEY,
          message: 'Redis not configured - using fallback data'
        }
      });
    }

    console.log('GET request - fetching data from Redis with key:', DATA_KEY);
    const dataStr = await redis.get(DATA_KEY);
    console.log('Raw data from Redis:', dataStr);
    
    let data: { items: any[]; types: any[] };
    if (typeof dataStr === 'string') {
      try {
        data = JSON.parse(dataStr);
      } catch (parseError) {
        data = { items: [], types: [] };
      }
    } else if (typeof dataStr === 'object' && dataStr !== null && 'items' in dataStr && 'types' in dataStr) {
      data = dataStr as { items: any[]; types: any[] };
    } else {
      data = { items: [], types: [] };
    }
    if (!data || typeof data !== 'object' || !Array.isArray(data.items) || !Array.isArray(data.types)) {
      data = { items: [], types: [] };
    }
    
    console.log('Returning data:', data);
    return NextResponse.json({
      ...data,
      debug: {
        redisUrl: process.env.UPSTASH_REDIS_REST_URL || 'not set',
        redisToken: process.env.UPSTASH_REDIS_REST_TOKEN ? process.env.UPSTASH_REDIS_REST_TOKEN.slice(0, 8) + '...' : 'not set',
        redisKey: DATA_KEY
      }
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Failed to read data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Test Redis connection first
    const redisConnected = await testRedisConnection();
    const data = await request.json();
    console.log('POST request body:', data);

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

    // Remove special typeName handling since we're using replace logic

    // Replace logic for types (not merge)
    let updatedTypes = currentData.types;
    if (Array.isArray(data.types)) {
      // Replace all types with the new data
      updatedTypes = data.types;
    }

    // Replace logic for items (not merge)
    let updatedItems = currentData.items;
    if (Array.isArray(data.items)) {
      // Replace all items with the new data
      updatedItems = data.items;
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
    const redisConnected = await testRedisConnection();
    const { typeName, typeIndex, itemId } = await request.json();
    console.log('DELETE request body:', { typeName, typeIndex, itemId });

    // Get current data
    let currentDataStr = await redis.get(DATA_KEY);
    let currentData: any = { items: [], types: [] };
    if (typeof currentDataStr === 'string') {
      try {
        currentData = JSON.parse(currentDataStr);
      } catch {
        currentData = { items: [], types: [] };
      }
    }
    console.log('Before deletion:', JSON.stringify(currentData));

    let updatedTypes = [...(currentData.types || [])];
    let updatedItems = [...(currentData.items || [])];

    // Delete by typeName
    if (typeName) {
      updatedTypes = updatedTypes.filter((type: string) => type !== typeName);
      updatedItems = updatedItems.map((item: any) => item.type === typeName ? { ...item, type: '' } : item);
    }
    // Delete by type index
    else if (typeof typeIndex === 'number' && typeIndex >= 0 && typeIndex < updatedTypes.length) {
      const removedType = updatedTypes[typeIndex];
      updatedTypes.splice(typeIndex, 1);
      updatedItems = updatedItems.map((item: any) => item.type === removedType ? { ...item, type: '' } : item);
    }
    // Delete by item ID
    else if (itemId) {
      updatedItems = updatedItems.filter((item: any) => item.id !== itemId);
    }

    const finalData = { items: updatedItems, types: updatedTypes };
    console.log('After deletion:', JSON.stringify(finalData));
    await redis.set(DATA_KEY, JSON.stringify(finalData));

    return NextResponse.json({
      success: true,
      deletedType: typeName || (typeof typeIndex === 'number' ? currentData.types[typeIndex] : null),
      deletedItemId: itemId,
      remainingTypes: updatedTypes,
      remainingItems: updatedItems,
      debug: {
        action: 'delete',
        typeName,
        typeIndex,
        itemId,
        currentData,
        finalData,
        redisConnected
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to delete data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}