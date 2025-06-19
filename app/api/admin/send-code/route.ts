import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Redis } from '@upstash/redis';

const ADMIN_EMAIL = 'myofficearmenia@gmail.com';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log('=== Send Code Debug ===');
    console.log('Email received:', email);
    
    if (email !== ADMIN_EMAIL) {
      console.log('Email mismatch:', email, '!=', ADMIN_EMAIL);
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 401 });
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated code:', code);

    // Store the code in Redis with 5-minute expiration
    const key = `admin_code:${email}`;
    await redis.set(key, code, { ex: 300 });
    console.log('Stored code in Redis with key:', key);

    // Check if Gmail credentials are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('Missing Gmail credentials:', {
        hasUser: !!process.env.GMAIL_USER,
        hasPassword: !!process.env.GMAIL_PASS
      });
      throw new Error('Gmail credentials not configured');
    }

    console.log('Creating email transporter...');
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    console.log('Sending email...');
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Admin Login Code',
      text: `Your admin login code is: ${code}`,
    });

    console.log('Email sent successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending code:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json({ 
      error: 'Failed to send code',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

