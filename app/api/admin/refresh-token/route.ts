import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

const ADMIN_EMAIL = 'myofficearmenia@gmail.com';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json();
    console.log('Refresh token request body:', body);

    if (!body || typeof body.email !== 'string') {
      console.log('Invalid request body');
      return NextResponse.json({ 
        success: false,
        error: 'Invalid request body' 
      }, { status: 400 });
    }

    const { email } = body;
    console.log('Refresh token request for email:', email);

    if (email !== ADMIN_EMAIL) {
      console.log('Invalid email for token refresh');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized email' 
      }, { status: 401 });
    }

    // Generate new admin token
    const token = sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    console.log('Generated new token');
    
    // Create response with token cookie
    const response = NextResponse.json({ 
      success: true,
      message: 'Token refreshed successfully',
      token
    });
    
    // Set the cookie with development-friendly settings
    response.cookies.set({
      name: 'adminToken',
      value: token,
      httpOnly: false, // Allow JavaScript access in development
      secure: false, // Allow non-HTTPS in development
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    console.log('Set new adminToken cookie in response');
    console.log('Response cookies:', response.cookies.getAll());
    
    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to refresh token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 