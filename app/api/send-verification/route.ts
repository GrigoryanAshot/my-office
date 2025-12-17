import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/emailConfig';
import { verificationStorage } from '@/lib/verificationStorage';

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  // ==> TEMPORARY DEBUGGING: Log all available environment variables
  console.log("--- VERCEL RUNTIME ENVIRONMENT VARIABLES ---");
  console.log(process.env);
  console.log("------------------------------------------");
  
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Clean up expired codes
    verificationStorage.cleanup();

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store the code
    await verificationStorage.set(email, code, expiresAt);
    
    // Debug logging
    console.log(`Verification code generated for ${email}: ${code}`);
    console.log(`Stored codes:`, verificationStorage.debug());

    // ==> ADDED FOR DEBUGGING
    console.log(`Is EMAIL_USER configured: ${!!process.env.EMAIL_USER}`);

    // Send email using the new email configuration
    await sendVerificationEmail(email, code);

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