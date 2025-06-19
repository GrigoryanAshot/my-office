import { NextResponse } from 'next/server';
import { verificationStorage } from '@/lib/verificationStorage';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    // Debug logging
    console.log(`Verification attempt for ${email} with code: ${code}`);
    console.log(`All stored codes:`, verificationStorage.debug());

    // Get stored verification data
    const storedData = verificationStorage.get(email);

    if (!storedData) {
      console.log(`No verification code found for ${email}`);
      return NextResponse.json({ error: 'No verification code found for this email' }, { status: 400 });
    }

    console.log(`Stored data for ${email}:`, storedData);

    // Check if code has expired
    if (Date.now() > storedData.expiresAt) {
      console.log(`Code expired for ${email}`);
      verificationStorage.delete(email);
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // Check if code matches
    if (storedData.code !== code) {
      console.log(`Code mismatch for ${email}. Expected: ${storedData.code}, Received: ${code}`);
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    console.log(`Verification successful for ${email}`);

    // Code is valid - remove it from storage and mark user as verified
    verificationStorage.delete(email);
    verificationStorage.markVerified(email);

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