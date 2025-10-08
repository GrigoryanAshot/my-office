import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS,
    hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
    hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    // Don't expose actual values, just check if they exist
    emailUserConfigured: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
    redisConfigured: process.env.UPSTASH_REDIS_REST_URL ? 'Configured' : 'Not configured',
  });
} 