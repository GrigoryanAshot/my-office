import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    // Test Redis connection
    await redis.set('test:migration', 'test-value');
    const testValue = await redis.get('test:migration');
    
    return NextResponse.json({
      success: true,
      redisConnected: testValue === 'test-value',
      environment: process.env.NODE_ENV,
      redisUrl: process.env.UPSTASH_REDIS_REST_URL ? 'Set' : 'Not set',
      redisToken: process.env.UPSTASH_REDIS_REST_TOKEN ? 'Set' : 'Not set'
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Redis connection failed', 
      details: error instanceof Error ? error.message : String(error),
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test Redis write
    await redis.set('test:migration:post', 'test-post-value');
    const testValue = await redis.get('test:migration:post');
    
    return NextResponse.json({
      success: true,
      redisWriteTest: testValue === 'test-post-value',
      message: 'POST request to Redis successful'
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Redis write failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 