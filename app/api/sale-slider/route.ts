import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Check if Redis environment variables are set
const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasRedisConfig ? new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
}) : null;

const DATA_KEY = 'sale-slider:data';

// Add a simple test function to verify Redis connection
async function testRedisConnection() {
  try {
    if (!redis) {
      console.log('Redis not configured');
      return false;
    }
    
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
    console.log('Sale slider API: GET request received');
    if (!redis) {
      console.log('Sale slider API: Redis not configured');
      return NextResponse.json({ 
        items: [], 
        types: [],
        error: 'Redis not configured',
        debug: {
          redisUrl: process.env.UPSTASH_REDIS_REST_URL || 'not set',
          redisToken: process.env.UPSTASH_REDIS_REST_TOKEN ? process.env.UPSTASH_REDIS_REST_TOKEN.slice(0, 8) + '...' : 'not set',
          redisKey: DATA_KEY
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
    if (!redis) {
      return NextResponse.json({ 
        error: 'Redis not configured',
        debug: {
          redisUrl: process.env.UPSTASH_REDIS_REST_URL || 'not set',
          redisToken: process.env.UPSTASH_REDIS_REST_TOKEN ? process.env.UPSTASH_REDIS_REST_TOKEN.slice(0, 8) + '...' : 'not set'
        }
      }, { status: 500 });
    }

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

    // REPLACE logic for types and items (not merge)
    let updatedTypes = currentData.types;
    if (Array.isArray(data.types)) {
      updatedTypes = data.types;
    }
    let updatedItems = currentData.items;
    if (Array.isArray(data.items)) {
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
    if (!redis) {
      return NextResponse.json({ 
        error: 'Redis not configured',
        debug: {
          redisUrl: process.env.UPSTASH_REDIS_REST_URL || 'not set',
          redisToken: process.env.UPSTASH_REDIS_REST_TOKEN ? process.env.UPSTASH_REDIS_REST_TOKEN.slice(0, 8) + '...' : 'not set'
        }
      }, { status: 500 });
    }

    const redisConnected = await testRedisConnection();
    const { typeName, typeIndex, itemId } = await request.json();

    // Get current data
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

    let updatedTypes = [...(currentData.types || [])];
    let updatedItems = [...(currentData.items || [])];

    // Delete by typeName
    if (typeName) {
      updatedTypes = updatedTypes.filter(type => type !== typeName);
    }
    // Delete by type index
    else if (typeof typeIndex === 'number' && typeIndex >= 0 && typeIndex < updatedTypes.length) {
      updatedTypes.splice(typeIndex, 1);
    }
    // Delete by item ID
    else if (itemId) {
      updatedItems = updatedItems.filter(item => item.id !== itemId);
    }
    // Remove the delete all branch
    // else if (!typeName && typeIndex === undefined && !itemId) {
    //   updatedTypes = [];
    //   updatedItems = [];
    // }

    const finalData = { items: updatedItems, types: updatedTypes };
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