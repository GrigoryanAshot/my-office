"use client";
import { useParams, useRouter } from "next/navigation";
import { furnitureData } from '@/component/Lists/furniture/tables';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import Image from 'next/image';
import React from 'react';

export default function TableDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? parseInt(params.id as string) : null;
  const item = furnitureData.find((item) => item.id === id) as (typeof furnitureData)[number] & { sizes?: string; extraImages?: string[] };

  if (!item) {
    return (
      <>
        <NavbarSection style="" logo="/images/logo.png" />
        <div style={{ marginTop: 120, textAlign: 'center' }}>
          <h1>Ապրանքը չի գտնվել</h1>
        </div>
        <FooterSection />
        <ScrollToTopButton style="" />
      </>
    );
  }

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div style={{ maxWidth: 1200, margin: '120px auto 40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 5px 15px rgba(0,0,0,0.08)', padding: 32 }}>
        <button onClick={() => router.back()} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', fontSize: 18 }}>&larr; Վերադառնալ</button>
        
        <div style={{ display: 'flex', flexDirection: 'row', gap: 40 }}>
          {/* Left side: Photos */}
          <div style={{ width: '50%' }}>
            {/* Main photo */}
            <div style={{ width: '100%', height: 400, position: 'relative', marginBottom: 20, borderRadius: 8, overflow: 'hidden' }}>
              <Image 
                src={item.imageUrl} 
                alt={item.name} 
                fill 
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            
            {/* Small photos */}
            {item.extraImages && item.extraImages.length > 0 && (
              <div style={{ display: 'flex', gap: 16 }}>
                {item.extraImages.slice(0, 3).map((img: string, idx: number) => (
                  <div key={idx} style={{ width: 120, height: 90, position: 'relative', borderRadius: 6, overflow: 'hidden', cursor: 'pointer' }}>
                    <Image 
                      src={img} 
                      alt={`${item.name} - photo ${idx + 1}`} 
                      fill 
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Details */}
          <div style={{ width: '50%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h1 style={{ fontSize: 32, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>{item.name}</h1>
              
              {typeof (item as any).code !== 'undefined' && (
                <div style={{ fontSize: 16, color: '#666' }}>
                  <span style={{ fontWeight: 500 }}>Կոդ:</span> {(item as any).code}
                </div>
              )}

              <div style={{ fontSize: 24, color: '#1a1a1a', fontWeight: 600 }}>
                <span style={{ fontWeight: 500 }}>Գին:</span> {item.price}
              </div>

              {item.sizes && (
                <div style={{ fontSize: 16, color: '#666' }}>
                  <span style={{ fontWeight: 500 }}>Չափսեր:</span> {item.sizes}
                </div>
              )}

              <div style={{ fontSize: 16, color: '#666', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                <span style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Նկարագրություն:</span>
                {item.description}
              </div>

              <div style={{ marginTop: 8 }}>
                <span style={{ 
                  color: item.isAvailable ? '#22c55e' : '#ef4444', 
                  fontWeight: 500,
                  fontSize: 18,
                  padding: '8px 16px',
                  borderRadius: 6,
                  backgroundColor: item.isAvailable ? '#dcfce7' : '#fee2e2'
                }}>
                  {item.isAvailable ? 'Առկա է' : 'Պատվիրել'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 