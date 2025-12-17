import { NextResponse } from 'next/server';
import { verificationStorage } from '@/lib/verificationStorage';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Verification attempt for ${email} with code: ${code}`);
      console.log(`All stored codes:`, await verificationStorage.debug());
    }

    // Get stored verification data
    const storedData = await verificationStorage.get(email);

    if (!storedData) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`No verification code found for ${email}`);
      }
      return NextResponse.json({ error: 'No verification code found for this email' }, { status: 400 });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Stored data for ${email}:`, storedData);
    }

    // Check if code matches
    if (String(storedData.code) !== String(code)) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Code mismatch for ${email}. Expected: ${storedData.code}, Received: ${code}`);
      }
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Verification successful for ${email}`);
    }

    // Code is valid - remove it from storage and mark user as verified
    await verificationStorage.delete(email);
    await verificationStorage.markVerified(email);

    // Create response with success
    const response = NextResponse.json({ 
      success: true, 
      message: 'Verification successful' 
    });

    // Set verification cookie for 24 hours
    response.cookies.set('admin-verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
} 