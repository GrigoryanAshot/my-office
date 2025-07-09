import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'tables:data';

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
    console.log('GET request - fetching data from Redis with key:', DATA_KEY);
    const dataStr = await redis.get(DATA_KEY);
    console.log('Raw data from Redis:', dataStr);
    
    let data: { items: any[]; types: any[] };
    if (typeof dataStr === 'string') {
      try {
        data = JSON.parse(dataStr);
        if (!data || typeof data !== 'object' || !Array.isArray(data.items) || !Array.isArray(data.types)) {
          console.log('Invalid data structure, using defaults');
          data = { items: [], types: [] };
        }
      } catch (parseError) {
        console.error('Error parsing data from Redis:', parseError);
        data = { items: [], types: [] };
      }
    } else {
      console.log('No data found in Redis, using defaults');
      data = { items: [], types: [] };
    }
    
    console.log('Returning data:', data);
    return NextResponse.json(data);
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

    // Always get the current data first
    let currentDataStr = await redis.get(DATA_KEY);
    let currentData: { items: any[]; types: any[] } = { items: [], types: [] };
    let parseError = null;
    if (typeof currentDataStr === 'string') {
      try {
        currentData = JSON.parse(currentDataStr);
        if (!currentData || typeof currentData !== 'object' || !Array.isArray(currentData.items) || !Array.isArray(currentData.types)) {
          currentData = { items: [], types: [] };
        }
      } catch (err) {
        parseError = err instanceof Error ? err.message : String(err);
        currentData = { items: [], types: [] };
      }
    }

    // Handle type deletion
    if (data.action === 'deleteType' && data.typeName) {
      const updatedTypes = currentData.types.filter((type: string) => type !== data.typeName);
      const updatedItems = currentData.items.map((item: any) => item.type === data.typeName ? { ...item, type: '' } : item);
      const updatedData = { items: updatedItems, types: updatedTypes };
      await redis.set(DATA_KEY, JSON.stringify(updatedData));
      const afterSet = await redis.get(DATA_KEY);
      return NextResponse.json({
        debug: {
          action: 'deleteType',
          dataReceived: data,
          currentData,
          updatedData,
          afterSet,
          redisConnected,
          parseError
        },
        success: true
      });
    }

    // Handle adding new type
    if (data.typeName && !data.name) {
      let typeAdded = false;
      if (!currentData.types.includes(data.typeName)) {
        currentData.types.push(data.typeName);
        await redis.set(DATA_KEY, JSON.stringify(currentData));
        typeAdded = true;
      }
      const afterSet = await redis.get(DATA_KEY);
      return NextResponse.json({
        debug: {
          action: 'addType',
          dataReceived: data,
          currentData,
          afterSet,
          typeAdded,
          redisConnected,
          parseError
        },
        success: typeAdded,
        type: { name: data.typeName }
      });
    }

    // Handle adding/updating items or types
    let updatedItems = currentData.items;
    let updatedTypes = currentData.types;
    if (Array.isArray(data.items)) {
      updatedItems = data.items;
    }
    if (Array.isArray(data.types)) {
      updatedTypes = data.types;
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
        redisConnected,
        parseError
      },
      success: true
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}