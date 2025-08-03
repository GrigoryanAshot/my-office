import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Deployment test successful',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'POST test successful',
    timestamp: new Date().toISOString()
  });
} 