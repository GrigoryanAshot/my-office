import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin panel routes
  if (request.nextUrl.pathname.startsWith('/admin-panel')) {
    // Get the email from cookies or headers (we'll use a simple approach for now)
    // In a real implementation, you might want to use JWT tokens or session cookies
    
    // For now, we'll redirect all unverified users to the main page
    // You can enhance this by checking for a verification cookie or session
    
    // Check if there's a verification cookie
    const verificationCookie = request.cookies.get('admin-verified');
    
    if (!verificationCookie || verificationCookie.value !== 'true') {
      // User is not verified, redirect to main page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin-panel/:path*',
  ],
}; 