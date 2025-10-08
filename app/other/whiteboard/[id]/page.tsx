'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './WhiteboardDetail.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import Image from 'next/image';

interface WhiteboardItem {
  id: number;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  imageUrl: string;
  images?: string[];
  type: string;
  isAvailable: boolean;
}

export default function WhiteboardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [item, setItem] = useState<WhiteboardItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/whiteboard/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch item');
        }
        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError('Ապրանքը չի գտնվել');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  if (loading) {
    return (
      <>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className={styles.wrapper}>
          <div style={{ marginTop: '100px', textAlign: 'center' }}>
            <h1>Բեռնվում է...</h1>
          </div>
        </div>
        <FooterSection />
        <ScrollToTopButton style="" />
      </>
    );
  }

  if (error || !item) {
    return (
      <>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className={styles.wrapper}>
          <div style={{ marginTop: '100px', textAlign: 'center' }}>
            <h1>{error || 'Ապրանքը չի գտնվել'}</h1>
            <button onClick={() => router.back()} style={{marginTop: 24, padding: '10px 24px', borderRadius: 8, background: '#2196F3', color: '#fff', border: 'none', cursor: 'pointer'}}>Վերադառնալ</button>
          </div>
        </div>
        <FooterSection />
        <ScrollToTopButton style="" />
      </>
    );
  }

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <div className={styles.detailsSection}>
            <h1 className={styles.title}>{item.name}</h1>
            <div className={styles.price}>
              {item.oldPrice && item.oldPrice.trim() && (
                <div style={{ 
                  textDecoration: 'line-through', 
                  color: '#dc3545', 
                  fontSize: '0.9em',
                  marginBottom: '4px'
                }}>
                  {item.oldPrice} դրամ
                </div>
              )}
              <div style={{ fontWeight: 'bold' }}>
                {item.price} դրամ
              </div>
            </div>
            <div className={styles.description} style={{ whiteSpace: 'pre-line' }}>{item.description}</div>
            <div className={styles.type}>Տեսակ: {item.type}</div>
            <div className={styles.availability}>{item.isAvailable ? 'Առկա է' : 'Պատվիրել'}</div>
            {item.isAvailable && (
              <button className={styles.orderCallBtn}>Պատվիրել զանգ</button>
            )}
          </div>
        </div>
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 