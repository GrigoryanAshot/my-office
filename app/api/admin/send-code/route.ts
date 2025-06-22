import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Redis } from '@upstash/redis';

const ADMIN_EMAIL = 'myofficearmenia@gmail.com';

let redis: Redis | undefined;

function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

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
    const redisClient = getRedisClient();
    const key = `admin_code:${email}`;
    await redisClient.set(key, code, { ex: 300 });
    console.log('Stored code in Redis with key:', key);

    // Check if email credentials are set
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error('Missing email credentials in environment variables.');
      throw new Error('Email credentials not configured');
    }

    console.log('Creating email transporter...');
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    console.log('Sending email...');
    await transporter.sendMail({
      from: emailUser,
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

