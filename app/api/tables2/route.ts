import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'tables:data';

export async function GET() {
  try {
    const dataStr = await redis.get(DATA_KEY);
    let data: { items: any[]; types: any[] };
    if (typeof dataStr === 'string') {
      try {
        data = JSON.parse(dataStr);
        if (!data || typeof data !== 'object' || !Array.isArray(data.items) || !Array.isArray(data.types)) {
          data = { items: [], types: [] };
        }
      } catch {
        data = { items: [], types: [] };
      }
    } else {
      data = { items: [], types: [] };
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Handle type deletion
    if (data.action === 'deleteType' && data.typeName) {
      let currentDataStr = await redis.get(DATA_KEY);
      let currentData: { items: any[]; types: any[] };
      if (typeof currentDataStr === 'string') {
        try {
          currentData = JSON.parse(currentDataStr);
          if (!currentData || typeof currentData !== 'object' || !Array.isArray(currentData.items) || !Array.isArray(currentData.types)) {
            currentData = { items: [], types: [] };
          }
        } catch {
          currentData = { items: [], types: [] };
        }
      } else {
        currentData = { items: [], types: [] };
      }

      const updatedTypes = currentData.types.filter((type: string) => type !== data.typeName);
      const updatedItems = currentData.items.map((item: any) => item.type === data.typeName ? { ...item, type: '' } : item);
      const updatedData = { items: updatedItems, types: updatedTypes };
      await redis.set(DATA_KEY, JSON.stringify(updatedData));
      return NextResponse.json({ success: true });
    }

    // Handle adding new type
    if (data.typeName && !data.name) {
      let currentDataStr = await redis.get(DATA_KEY);
      let currentData: { items: any[]; types: any[] };
      if (typeof currentDataStr === 'string') {
        try {
          currentData = JSON.parse(currentDataStr);
          if (!currentData || typeof currentData !== 'object' || !Array.isArray(currentData.items) || !Array.isArray(currentData.types)) {
            currentData = { items: [], types: [] };
          }
        } catch {
          currentData = { items: [], types: [] };
        }
      } else {
        currentData = { items: [], types: [] };
      }

      if (!currentData.types.includes(data.typeName)) {
        currentData.types.push(data.typeName);
        await redis.set(DATA_KEY, JSON.stringify(currentData));
        return NextResponse.json({ success: true, type: { name: data.typeName } });
      } else {
        return NextResponse.json({ error: 'Type already exists' }, { status: 400 });
      }
    }

    // Handle regular item operations
    if (!data || typeof data !== 'object' || !Array.isArray(data.items) || !Array.isArray(data.types)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    await redis.set(DATA_KEY, JSON.stringify(data));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 