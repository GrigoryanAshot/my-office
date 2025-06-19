import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { sign } from 'jsonwebtoken';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ADMIN_EMAIL = 'myofficearmenia@gmail.com';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    
    console.log('=== Code Verification Debug ===');
    console.log('Email received:', email);
    console.log('Code received:', code);
    
    // Get the stored code from Redis
    const storedCode = await redis.get<string>(`admin_code:${email}`);
    console.log('Stored code from Redis:', storedCode);
    
    if (!storedCode) {
      console.log('No code found in Redis for this email');
      return NextResponse.json({ error: 'Code expired or not found' }, { status: 400 });
    }

    // Convert both codes to strings and trim any whitespace
    const receivedCode = String(code).trim();
    const expectedCode = String(storedCode).trim();
    
    console.log('Comparing codes:');
    console.log('Received (trimmed):', receivedCode);
    console.log('Stored (trimmed):', expectedCode);
    console.log('Match:', receivedCode === expectedCode);
    
    if (receivedCode !== expectedCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    // Code is valid, delete it from Redis
    await redis.del(`admin_code:${email}`);
    console.log('Code verified successfully, deleted from Redis');

    // Generate admin token
    const token = sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    console.log('Generated token:', token);
    
    // Create response with token cookie
    const response = NextResponse.json({ success: true });
    
    // Set the cookie with all necessary options
    response.cookies.set({
      name: 'adminToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    console.log('Set adminToken cookie in response');
    return response;
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 });
  }
}