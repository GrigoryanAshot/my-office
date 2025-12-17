/**
 * Gets the base URL for the application
 * Uses environment variable or defaults to production URL
 */
export function getBaseUrl(): string {
  // Check for custom base URL in environment
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // In production, use the canonical domain
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Default to production domain
  return 'https://www.my-office.am';
}

