'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './WhiteboardDetail.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import Image from 'next/image';
import { ProductData } from '@/lib/seo/productMetadata';

interface WhiteboardDetailClientProps {
  item: ProductData;
}

export default function WhiteboardDetailClient({ item }: WhiteboardDetailClientProps) {
  const router = useRouter();

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
            {item.type && (
              <div className={styles.type}>Տեսակ: {item.type}</div>
            )}
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

