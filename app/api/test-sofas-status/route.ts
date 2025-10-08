import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'sofas:data:test';

export async function GET() {
  try {
    console.log('Testing sofas API status...');
    
    // Test Redis connection
    const redisConnected = await redis.set('test:sofas', 'test-value');
    const testValue = await redis.get('test:sofas');
    
    // Try to get sofas data
    const sofasData = await redis.get(DATA_KEY);
    
    return NextResponse.json({
      success: true,
      redisConnected: testValue === 'test-value',
      sofasDataExists: !!sofasData,
      sofasData: sofasData,
      environment: process.env.NODE_ENV,
      redisUrl: process.env.UPSTASH_REDIS_REST_URL ? 'Set' : 'Not set',
      redisToken: process.env.UPSTASH_REDIS_REST_TOKEN ? 'Set' : 'Not set'
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to test sofas API', 
      details: error instanceof Error ? error.message : String(error),
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
} 