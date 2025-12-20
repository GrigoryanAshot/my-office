'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './TableDetail.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import { ProductData } from '@/lib/seo/productMetadata';

interface PodiumDetailClientProps {
  item: ProductData;
}

export default function PodiumDetailClient({ item }: PodiumDetailClientProps) {
  const router = useRouter();

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
            <div className={styles.description} style={{ whiteSpace: 'pre-line' }}>{item.description}</div>
            <div className={styles.type}>Տեսակ: {item.type || 'N/A'}</div>
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
