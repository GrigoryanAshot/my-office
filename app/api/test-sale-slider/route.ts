import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the sale-slider API using relative URL
    const response = await fetch('/api/sale-slider');
    const data = await response.json();
    
    return NextResponse.json({
      saleSliderResponse: data,
      environment: {
        hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
        hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
        redisUrl: process.env.UPSTASH_REDIS_REST_URL || 'not set',
        redisToken: process.env.UPSTASH_REDIS_REST_TOKEN ? process.env.UPSTASH_REDIS_REST_TOKEN.slice(0, 8) + '...' : 'not set'
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 