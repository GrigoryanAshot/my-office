import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'armchairs:data:test';

async function testRedisConnection() {
  try {
    await redis.set('test:armchairs', 'test-value');
    const testValue = await redis.get('test:armchairs');
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

    const redisConnected = await testRedisConnection();
    console.log('Armchairs API: Redis connected:', redisConnected);
    
    const dataStr = await redis.get(DATA_KEY);
    console.log('Armchairs API: Data from Redis:', dataStr ? 'exists' : 'not found');
    
    if (!dataStr) {
      return NextResponse.json({ 
        items: [], 
        types: [],
        message: 'No data found in Redis',
        redisConnected 
      });
    }
    
    const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
    return NextResponse.json({
      ...data,
      redisConnected,
      debug: {
        dataType: typeof dataStr,
        hasItems: !!data.items,
        itemsCount: data.items?.length || 0,
        hasTypes: !!data.types,
        typesCount: data.types?.length || 0
      }
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ 
      error: 'Failed to read data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const redisConnected = await testRedisConnection();
    const data = await request.json();
    console.log('POST request body:', data);
    
    // Get current data from Redis
    let currentDataStr = await redis.get(DATA_KEY);
    let currentData = { items: [], types: [] };
    
    if (currentDataStr) {
      currentData = typeof currentDataStr === 'string' ? JSON.parse(currentDataStr) : currentDataStr;
    }
    
    // Update data
    let updatedTypes = currentData.types;
    if (Array.isArray(data.types)) {
      updatedTypes = data.types;
    }
    let updatedItems = currentData.items;
    if (Array.isArray(data.items)) {
      updatedItems = data.items;
    }
    
    const finalData = { items: updatedItems, types: updatedTypes };
    
    // Save to Redis
    await redis.set(DATA_KEY, JSON.stringify(finalData));
    
    return NextResponse.json({
      success: true,
      message: 'Data updated successfully',
      redisConnected,
      debug: {
        itemsCount: updatedItems.length,
        typesCount: updatedTypes.length
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to save data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const redisConnected = await testRedisConnection();
    const { typeName, typeIndex, itemId } = await request.json();
    console.log('DELETE request body:', { typeName, typeIndex, itemId });
    
    // Get current data from Redis
    let currentDataStr = await redis.get(DATA_KEY);
    let currentData = { items: [], types: [] };
    
    if (currentDataStr) {
      currentData = typeof currentDataStr === 'string' ? JSON.parse(currentDataStr) : currentDataStr;
    }
    
    let updatedTypes = [...(currentData.types || [])] as string[];
    let updatedItems = [...(currentData.items || [])] as any[];
    
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
      updatedItems = updatedItems.filter((item: any) => String(item.id) !== String(itemId));
    }
    
    const finalData = { items: updatedItems, types: updatedTypes };
    
    // Save to Redis
    await redis.set(DATA_KEY, JSON.stringify(finalData));
    
    return NextResponse.json({
      success: true,
      deletedType: typeName || (typeof typeIndex === 'number' ? currentData.types[typeIndex] : null),
      deletedItemId: itemId,
      remainingTypes: updatedTypes,
      remainingItems: updatedItems,
      redisConnected,
      debug: {
        originalItemsCount: currentData.items?.length || 0,
        newItemsCount: updatedItems.length,
        originalTypesCount: currentData.types?.length || 0,
        newTypesCount: updatedTypes.length
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to delete data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 