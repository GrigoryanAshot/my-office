import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function GET() {
  try {
    // Check if environment variables are set
    const hasUrl = !!process.env.UPSTASH_REDIS_REST_URL;
    const hasToken = !!process.env.UPSTASH_REDIS_REST_TOKEN;
    
    console.log('Environment check:');
    console.log('- UPSTASH_REDIS_REST_URL:', hasUrl ? 'Set' : 'Not set');
    console.log('- UPSTASH_REDIS_REST_TOKEN:', hasToken ? 'Set' : 'Not set');
    
    if (!hasUrl || !hasToken) {
      return NextResponse.json({
        error: 'Missing environment variables',
        hasUrl,
        hasToken,
        message: 'Please check your Vercel environment variables'
      });
    }
    
    // Test Redis connection
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    
    // Try to set and get a test value
    await redis.set('test:connection', 'hello-world');
    const testValue = await redis.get('test:connection');
    
    return NextResponse.json({
      success: true,
      redisConnected: testValue === 'hello-world',
      testValue,
      message: 'Redis connection test completed'
    });
    
  } catch (error) {
    console.error('Redis test error:', error);
    return NextResponse.json({
      error: 'Redis connection failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 