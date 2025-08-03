"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './TableDetail.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface Item {
  id: number;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  imageUrl: string;
  images: string[];
  type: string;
  url: string;
  isAvailable: boolean;
}

export default function PodiumDetail() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params?.id) {
      fetchItem();
    }
    // eslint-disable-next-line
  }, [params?.id]);

  const fetchItem = async () => {
    try {
      const response = await fetch('/api/podium');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      const foundItem = data.items.find((item: Item) => item.id === Number(params?.id));
      if (foundItem) {
        setItem(foundItem);
      } else {
        setError('Ապրանքը չի գտնվել');
      }
    } catch (error) {
      setError('Ապրանքը չի գտնվել');
    } finally {
      setLoading(false);
    }
  };

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
              <img src={item.imageUrl} alt={item.name} />
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
            <div className={styles.description}>{item.description}</div>
            <div className={styles.type}>Տեսակ: {item.type}</div>
            <div className={styles.availability}>{item.isAvailable ? 'Առկա է' : 'Վաճառված է'}</div>
            {item.isAvailable && (
              <button className={styles.orderCallBtn}>Պատվիրել</button>
            )}
          </div>
        </div>
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 