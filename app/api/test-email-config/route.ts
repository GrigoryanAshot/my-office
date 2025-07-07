import { NextResponse } from 'next/server';
import { createEmailTransporter } from '@/lib/emailConfig';

export async function GET() {
  try {
    // Test if email configuration is valid
    const transporter = createEmailTransporter();
    
    // Verify the transporter configuration
    await transporter.verify();
    
    return NextResponse.json({
      success: true,
      message: 'Email configuration is valid and ready to use',
      service: process.env.EMAIL_SERVICE || 'gmail',
      user: process.env.EMAIL_USER ? 'configured' : 'not configured'
    });
  } catch (error) {
    console.error('Email configuration test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Email configuration is not valid. Please check your environment variables.'
    }, { status: 500 });
  }
} 