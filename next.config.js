/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Optimize image loading
    minimumCacheTTL: 60, // Cache images for 60 seconds
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    removeConsole: false, // Temporarily disable to see console logs
  },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizeCss: {
      logLevel: 'error', // Only show errors, not warnings
    },
    scrollRestoration: true,
  },
  // CSS optimization (these are default in Next.js 15+)
  // Vercel deployment optimizations
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Ensure proper handling of environment variables
  serverRuntimeConfig: {
    // Will only be available on the server side
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    NODE_ENV: process.env.NODE_ENV,
  },
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
