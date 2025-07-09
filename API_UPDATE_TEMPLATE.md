# API Update Template for Admin Panel Subcategories

## Overview
All admin panel subcategory APIs need to be updated to use the improved merge logic instead of the old overwrite logic.

## APIs That Need Updating
Based on the grep search, these APIs are still using the old overwrite logic:

1. `app/api/stands/route.ts`
2. `app/api/takht/route.ts` 
3. `app/api/shelving/route.ts`
4. `app/api/poufs/route.ts`
5. `app/api/podium/route.ts`
6. `app/api/armchairs/route.ts`
7. `app/api/chests/route.ts`

## Template for Each API Update

Replace the entire content of each `route.ts` file with this template (replace `{CATEGORY}` with the category name):

```typescript
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = '{CATEGORY}:data';

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
    // Delete all if no specific deletion criteria
    else if (!typeName && typeIndex === undefined && !itemId) {
      updatedTypes = [];
      updatedItems = [];
    }

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
```

## Category Names to Use
- `stands` → `stands:data`
- `takht` → `takht:data`
- `shelving` → `shelving:data`
- `poufs` → `poufs:data`
- `podium` → `podium:data`
- `armchairs` → `armchairs:data`
- `chests` → `chests:data`

## What This Fixes
✅ **Merging instead of overwriting**: New types/items are merged with existing ones
✅ **DELETE functionality**: Can delete types and items by name, index, or ID
✅ **Better error handling**: More robust error handling and debugging
✅ **Redis connection testing**: Verifies Redis connection before operations
✅ **Debug information**: Returns detailed debug info for troubleshooting

## Testing
After updating each API, test with:
1. POST a new type: `{"typeName": "test"}`
2. POST another type: `{"typeName": "test2"}`
3. GET to verify both types are present
4. DELETE a type: `{"typeName": "test"}`
5. GET to verify deletion worked 