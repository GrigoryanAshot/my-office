import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'shelving:data';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Fetch data from Redis
    const dataStr = await redis.get(DATA_KEY);
    let data: { items: any[]; types: any[] } = { items: [], types: [] };
    
    if (typeof dataStr === 'string') {
      try {
        data = JSON.parse(dataStr);
      } catch (parseError) {
        return NextResponse.json({ error: "Failed to parse data" }, { status: 500 });
      }
    } else if (typeof dataStr === 'object' && dataStr !== null && 'items' in dataStr && 'types' in dataStr) {
      data = dataStr as { items: any[]; types: any[] };
    }
    
    if (!data || !Array.isArray(data.items)) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }
    
    // Find the item by ID
    const shelving = data.items.find(item => String(item.id) === String(id));
    
    if (!shelving) {
      return NextResponse.json({ error: "Shelving item not found" }, { status: 404 });
    }
    
    return NextResponse.json(shelving);
  } catch (error) {
    console.error('Error fetching shelving item:', error);
    return NextResponse.json({ error: "Failed to fetch shelving item" }, { status: 500 });
  }
} 