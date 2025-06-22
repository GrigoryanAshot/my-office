import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Ադմին մուտքի ստուգման կոդ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Ադմին մուտքի ստուգման կոդ</h2>
          <p style="color: #666; font-size: 16px;">
            Ձեր 6-նիշանոց ստուգման կոդը՝
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #4a90e2; letter-spacing: 4px;">${code}</span>
          </div>
          <p style="color: #666; font-size: 14px;">
            Այս կոդը վավեր է 10 րոպե: Եթե դուք չեք փորձել մուտք գործել ադմին պանել, ապա անտեսեք այս նամակը:
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Այս նամակը ուղարկվել է ավտոմատ կերպով, խնդրում ենք չպատասխանել:
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

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

    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
} 