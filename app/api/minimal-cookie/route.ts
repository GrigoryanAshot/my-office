import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: 'minimalToken',
    value: 'test123',
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24
  });
  return response;
} 