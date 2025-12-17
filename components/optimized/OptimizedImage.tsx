'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

/**
 * Optimized Image component with:
 * - Automatic WebP/AVIF format conversion (via Next.js)
 * - Lazy loading (except for priority images)
 * - Proper sizing to prevent layout shift
 * - Loading placeholder
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80, // Reduced from 85 for better performance
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Ensure Cloudinary URLs are optimized with better compression
  const optimizedSrc = src.includes('cloudinary.com')
    ? src.replace(/\/upload\//, '/upload/f_auto,q_auto:best,w_auto,c_limit,dpr_auto/')
    : src;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e5e7eb',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes={sizes}
        quality={quality}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        style={{
          objectFit: 'cover',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoading ? 0 : 1,
        }}
      />
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
