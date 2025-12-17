import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'myofficearmenia@gmail.com',
      subject: 'Test Email from My Office Website',
      text: 'This is a test email to verify the email configuration is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>This is a test email to verify the email configuration is working correctly.</p>
          <p>If you're receiving this email, your configuration is working!</p>
          <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
            <p><strong>Configuration Details:</strong></p>
            <ul>
              <li>From: ${process.env.EMAIL_USER}</li>
              <li>To: myofficearmenia@gmail.com</li>
              <li>Time: ${new Date().toLocaleString()}</li>
            </ul>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Test email sent successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Test email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to send test email', details: errorMessage },
      { status: 500 }
    );
  }
} 