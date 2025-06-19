import { NextResponse } from 'next/server';
import { verificationStorage } from '@/lib/verificationStorage';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Remove verification from storage
    if (email) {
      verificationStorage.removeVerification(email);
    }

    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });

    // Clear verification cookie
    response.cookies.set('admin-verified', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
    });

    return response;

  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
} 