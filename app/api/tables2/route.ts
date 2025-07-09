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
    console.log('Redis connection test result:', redisConnected);
    
    const data = await request.json();
    console.log('POST request data:', data);

    // Always get the current data first
    let currentDataStr = await redis.get(DATA_KEY);
    console.log('Current data from Redis:', currentDataStr);
    
    let currentData: { items: any[]; types: any[] } = { items: [], types: [] };
    if (typeof currentDataStr === 'string') {
      try {
        currentData = JSON.parse(currentDataStr);
        if (!currentData || typeof currentData !== 'object' || !Array.isArray(currentData.items) || !Array.isArray(currentData.types)) {
          currentData = { items: [], types: [] };
        }
      } catch (parseError) {
        console.error('Error parsing current data:', parseError);
        currentData = { items: [], types: [] };
      }
    }
    console.log('Parsed current data:', currentData);

    // Handle type deletion
    if (data.action === 'deleteType' && data.typeName) {
      const updatedTypes = currentData.types.filter((type: string) => type !== data.typeName);
      const updatedItems = currentData.items.map((item: any) => item.type === data.typeName ? { ...item, type: '' } : item);
      const updatedData = { items: updatedItems, types: updatedTypes };
      console.log('Saving updated data after deletion:', updatedData);
      await redis.set(DATA_KEY, JSON.stringify(updatedData));
      return NextResponse.json({ success: true });
    }

    // Handle adding new type
    if (data.typeName && !data.name) {
      if (!currentData.types.includes(data.typeName)) {
        currentData.types.push(data.typeName);
        console.log('Saving data with new type:', currentData);
        await redis.set(DATA_KEY, JSON.stringify(currentData));
        console.log('Data saved successfully');
        return NextResponse.json({ success: true, type: { name: data.typeName } });
      } else {
        return NextResponse.json({ error: 'Type already exists' }, { status: 400 });
      }
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
    console.log('Saving final data:', finalData);
    await redis.set(DATA_KEY, JSON.stringify(finalData));
    console.log('Data saved successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Failed to save data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}