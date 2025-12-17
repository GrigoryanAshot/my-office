import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'sofas:data:test';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('Sofas detail API: Looking for item with ID:', id);
    
    // Get data from Redis
    const dataStr = await redis.get(DATA_KEY);
    
    if (!dataStr) {
      console.log('Sofas detail API: No data found in Redis');
      return new NextResponse("Item not found", { status: 404 });
    }
    
    const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
    console.log('Sofas detail API: Data from Redis:', data ? 'exists' : 'not found');
    
    const sofa = (data.items || []).find((item: any) => String(item.id) === String(id));
    
    if (!sofa) {
      console.log('Sofas detail API: Item not found with ID:', id);
      return new NextResponse("Item not found", { status: 404 });
    }
    
    console.log('Sofas detail API: Found item:', sofa.name);
    return NextResponse.json(sofa);
  } catch (error) {
    console.error("Error fetching sofa item:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 