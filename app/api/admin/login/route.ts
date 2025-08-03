import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt:', { username, password });

    if (!username || !password) {
      console.log('Missing credentials');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log('Credentials valid, creating token');
      // Create JWT token
      const token = sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Token created:', token);
      
      // Create response with success status
      const response = NextResponse.json(
        { success: true },
        { status: 200 }
      );

      // Set secure based on environment
      const isProduction = process.env.NODE_ENV === 'production';
      
      response.cookies.set({
        name: 'adminToken',
        value: token,
        httpOnly: true,
        secure: isProduction, // Secure in production, not in development
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      console.log('Cookie set in response:', response.cookies.get('adminToken'));
      return response;
    }

    console.log('Invalid credentials');
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 