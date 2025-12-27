import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin panel routes
  if (request.nextUrl.pathname.startsWith('/admin-panel')) {
    // In development mode, allow access if email is not configured (for local testing)
    const isDevelopment = process.env.NODE_ENV === 'development';
    const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    // Check if there's a verification cookie
    const verificationCookie = request.cookies.get('admin-verified');
    
    console.log('Middleware: Checking admin panel access');
    console.log('Middleware: admin-verified cookie:', verificationCookie);
    console.log('Middleware: isDevelopment:', isDevelopment, 'emailConfigured:', emailConfigured);
    
    // Allow access in development if email is not configured (for testing without email setup)
    if (isDevelopment && !emailConfigured) {
      console.log('Middleware: Development mode - allowing access without verification');
      return NextResponse.next();
    }
    
    if (!verificationCookie || verificationCookie.value !== 'true') {
      console.log('Middleware: User not verified, redirecting to home');
      // User is not verified, redirect to main page
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    console.log('Middleware: User verified, allowing access to admin panel');
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin-panel/:path*',
  ],
}; 