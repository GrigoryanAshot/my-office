"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import CallOrderPopup from '@/component/banner/CallOrderPopup';

interface BannerItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  link: string;
}

interface BannerDetailClientProps {
  id: string;
}

export default function BannerDetailClient({ id }: BannerDetailClientProps) {
  const [item, setItem] = useState<BannerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/sale-slider');
        const data = await response.json();
        const found = (data.items || []).find((i: BannerItem) => String(i.id) === String(id));
        setItem(found || null);
        if (found) {
          console.log('Found item:', found);
          console.log('Image URL:', found.imageUrl);
        }
      } catch (e) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <>
        <NavbarSection style="main_menu" logo="/images/logo.png" />
        <div className="container" style={{ marginTop: '120px', textAlign: 'center' }}>
          <h1>Բեռնվում է...</h1>
        </div>
        <FooterSection />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <NavbarSection style="main_menu" logo="/images/logo.png" />
        <div className="container" style={{ marginTop: '120px', textAlign: 'center' }}>
          <h1>Նյութը չի գտնվել</h1>
        </div>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <NavbarSection style="main_menu" logo="/images/logo.png" />
      <div className="container" style={{ marginTop: '120px', width: '100%', maxWidth: '100%' }}>
        <div className="banner-detail-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '60px',
          gap: '40px',
          alignItems: 'flex-start',
          width: '100%'
        }}>
            {/* Left: Image */}
            <div className="banner-detail-image" style={{ 
              flex: '1',
              maxWidth: '600px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '500px', 
                minHeight: '400px',
                height: 'auto',
                aspectRatio: '4/3',
                borderRadius: '10px', 
                overflow: 'hidden', 
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f0f0f0'
              }}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
            </div>
            {/* Right: Info */}
            <div className="banner-detail-info" style={{ 
              flex: '1',
              maxWidth: '500px',
              width: '100%',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              background: '#f9f9f9',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 1px 8px rgba(0,0,0,0.04)'
            }}>
              <h1 className="banner-detail-title" style={{ 
                fontSize: '2.5rem', 
                marginBottom: '20px', 
                color: '#333',
                fontWeight: '600'
              }}>{item.title}</h1>
              <p className="banner-detail-description" style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.6', 
                color: '#666', 
                marginBottom: '20px',
                whiteSpace: 'pre-line'
              }}>{item.description}</p>
              <div className="banner-detail-price" style={{ 
                fontSize: '2.5rem', 
                color: '#FF7F46', 
                fontWeight: 'bold', 
                marginBottom: '20px' 
              }}>{item.price} դրամ</div>
              {item.link && (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s',
                    marginBottom: '20px'
                  }}
                >
                  Ավելին
                </a>
              )}
              <button
                className="common_btn"
                style={{ 
                  width: 'fit-content', 
                  padding: '12px 32px', 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  borderRadius: '24px', 
                  background: 'linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%)', 
                  color: '#fff', 
                  border: 'none', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)', 
                  cursor: 'pointer', 
                  marginTop: '10px' 
                }}
                onClick={() => setIsPopupOpen(true)}
              >
                պատվիրել զանգ
              </button>
            </div>
        </div>
      </div>
      <FooterSection />
      <CallOrderPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  );
} 