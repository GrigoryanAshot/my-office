'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface SaleItem {
  id: number;
  imageUrl: string;
  images: string[];
  title: string;
  description: string;
  price: string;
  link: string;
  source?: string;
  originalItem?: any;
  oldPrice?: string;
}

export default function SaleDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<SaleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaleItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/sale-slider');
        if (!response.ok) {
          throw new Error('Failed to fetch sale items');
        }
        
        const data = await response.json();
        const items = data.items || [];
        
        // Find the specific sale item by ID
        const saleItem = items.find((saleItem: SaleItem) => String(saleItem.id) === String(params?.id));
        
        if (!saleItem) {
          throw new Error('Sale item not found');
        }
        
        setItem(saleItem);
      } catch (error) {
        console.error('Error fetching sale item:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch sale item');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchSaleItem();
    }
  }, [params?.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!item) {
    return <div>Sale item not found</div>;
  }

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.mainContainer} style={{ marginTop: '100px', maxWidth: '1200px', margin: '100px auto 0', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Image Section */}
          <div>
            <div className={styles.imageContainer} style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={600}
                height={400}
                className={styles.image}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            
            {/* Additional Images */}
            {item.images && item.images.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a1a1a' }}>Լրացուցիչ նկարներ</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                  {item.images.map((imageUrl, index) => (
                    <div key={index} style={{ 
                      height: '150px', 
                      borderRadius: '8px', 
                      overflow: 'hidden',
                      border: '2px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'border-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${item.title} - Additional ${index + 1}`}
                        width={150}
                        height={150}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#1a1a1a' }}>
              {item.title}
            </h1>

            {/* Type Information */}
            {(item.originalItem?.type || item.source) && (
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontWeight: 'bold', color: '#6b7280' }}>Տեսակ: </span>
                <span style={{ color: '#1a1a1a' }}>{item.originalItem?.type || item.source}</span>
              </div>
            )}

            {/* Sale Badge */}
            <div style={{ 
              display: 'inline-block', 
              backgroundColor: '#22c55e', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              Ակցիա
            </div>

                         {/* Price Information */}
             <div style={{ marginBottom: '30px' }}>
               {/* Check if this item has oldPrice in originalItem or directly */}
               {(item.originalItem?.oldPrice || item.oldPrice) && (item.originalItem?.oldPrice || item.oldPrice).trim() && (
                 <div style={{ 
                   textDecoration: 'line-through', 
                   color: '#dc3545', 
                   fontSize: '1.5rem',
                   marginBottom: '10px'
                 }}>
                   Հին գին: {item.originalItem?.oldPrice || item.oldPrice} դրամ
                 </div>
               )}
               <div style={{ 
                 fontWeight: 'bold', 
                 color: '#22c55e', 
                 fontSize: '2rem'
               }}>
                 Նոր գին: {item.price} դրամ
               </div>
             </div>

            {/* Description */}
            {item.description && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '10px', color: '#1a1a1a' }}>Նկարագրություն:</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{item.description}</p>
              </div>
            )}

            {/* Original Item Details */}
            {item.originalItem && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '10px', color: '#1a1a1a' }}>Լրացուցիչ տեղեկություններ:</h3>
                <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  {item.originalItem.description && (
                    <p style={{ marginBottom: '10px' }}>{item.originalItem.description}</p>
                  )}
                                     {item.originalItem.isAvailable !== undefined && (
                     <p style={{ marginBottom: '10px' }}>
                       <span style={{ fontWeight: 'bold' }}>Առկայություն: </span>
                       {item.originalItem.isAvailable ? 'Առկա է' : 'Պատվիրել'}
                     </p>
                   )}
                </div>
              </div>
            )}

                         {/* Contact Button - Removed for testing */}
          </div>
        </div>
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 