"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface SaleSliderItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  link: string;
}

export default function SaleDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<SaleSliderItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/sale-slider');
        const data = await response.json();
        const found = (data.items || []).find((i: SaleSliderItem) => String(i.id) === String(params?.id));
        setItem(found || null);
      } catch (e) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [params?.id]);

  if (loading) return <div>Բեռնվում է...</div>;
  if (!item) return <div>Ակցիայի ապրանքը չի գտնվել</div>;

  return (
    <div>
      <NavbarSection style="" logo="/images/logo.png" />
      <div style={{ 
        maxWidth: 1200, 
        margin: '120px auto 40px auto', 
        padding: '20px',
        background: '#fff', 
        borderRadius: 12, 
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)' 
      }}>
        <div className="sale-detail-container" style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '40px',
          alignItems: 'flex-start'
        }}>
          {/* Left: Image */}
          <div className="sale-detail-image" style={{ 
            flex: '1',
            maxWidth: '600px'
          }}>
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              style={{ 
                width: '100%', 
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: 8, 
                marginBottom: 24 
              }} 
            />
          </div>
          
          {/* Right: Details */}
          <div className="sale-detail-info" style={{ 
            flex: '1',
            maxWidth: '500px',
            background: '#f9f9f9',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 8px rgba(0,0,0,0.04)'
          }}>
            <h1 className="sale-detail-title" style={{ 
              fontSize: '32px',
              fontWeight: '600',
              margin: '0 0 20px',
              color: '#333'
            }}>{item.title}</h1>
            
            <div style={{ 
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#666',
              marginBottom: '20px',
              whiteSpace: 'pre-line'
            }}>{item.description}</div>
            
            <div className="sale-detail-price" style={{ 
              fontSize: '24px',
              color: '#2196F3',
              fontWeight: '500',
              marginBottom: '20px'
            }}>{item.price} դրամ</div>
            
            {item.link && (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  color: '#ff914d', 
                  textDecoration: 'underline', 
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Ավելին
              </a>
            )}
          </div>
        </div>
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </div>
  );
} 