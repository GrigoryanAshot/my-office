import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/emailConfig';
import { verificationStorage } from '@/lib/verificationStorage';

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if email credentials are configured
    // In development mode, return a specific error code that client can detect
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials not configured');
      return NextResponse.json(
        { 
          error: 'Email service is not configured. Please contact administrator.',
          code: 'EMAIL_NOT_CONFIGURED',
          devMode: process.env.NODE_ENV === 'development'
        },
        { status: 500 }
      );
    }

    // Check if Redis is configured
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.error('Redis credentials not configured');
      return NextResponse.json(
        { error: 'Storage service is not configured. Please contact administrator.' },
        { status: 500 }
      );
    }

    // Clean up expired codes
    verificationStorage.cleanup();

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store the code
    try {
      await verificationStorage.set(email, code, expiresAt);
    } catch (storageError) {
      console.error('Failed to store verification code:', storageError);
      return NextResponse.json(
        { error: 'Failed to store verification code. Please try again.' },
        { status: 500 }
      );
    }
    
    // Debug logging
    console.log(`Verification code generated for ${email}: ${code}`);

    // Send email using the new email configuration
    try {
      await sendVerificationEmail(email, code);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Still return success if code was stored (user can request code again)
      return NextResponse.json(
        { error: 'Failed to send email. Please check email configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Verification code sent successfully' 
    });

  } catch (error) {
    // ==> MODIFIED FOR DEBUGGING
    console.error('[Verification Error] Failed to send email. Full error details:');
    console.error(error);
    
    // Check if it's a nodemailer-specific error for more details
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('[Nodemailer Error Code]', (error as { code: string }).code);
    }

    // Provide more specific error messages based on the error type
    let errorMessage = 'Սխալ է տեղի ունեցել: Խնդրում ենք փորձել կրկին';
    
    if (error && typeof error === 'object' && 'code' in error) {
      const errorCode = (error as { code: string }).code;
      if (errorCode === 'EAUTH') {
        errorMessage = 'Էլ․ փոստի կարգավորումները սխալ են: Խնդրում ենք կապնվել ադմինիստրատորի հետ';
      } else if (errorCode === 'ECONNECTION') {
        errorMessage = 'Կապի խնդիր: Խնդրում ենք ստուգել ինտերնետ կապը';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 