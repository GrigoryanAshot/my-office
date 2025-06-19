'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { furnitureData } from '@/component/Lists/metal/metal_podium';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface FurnitureItem {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  price: string;
  description: string;
  type: string;
  isAvailable: boolean;
}

export default function MetalPodiumDetailPage() {
  const params = useParams();
  
  if (!params?.id) {
    return (
      <>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className={styles.mainContainer} style={{ marginTop: '100px', textAlign: 'center' }}>
          <h1>Ապրանքը չի գտնվել</h1>
        </div>
        <FooterSection />
        <ScrollToTopButton style="" />
      </>
    );
  }

  const id = Number(params.id);
  const item = furnitureData.find(item => item.id === id) as FurnitureItem | undefined;

  if (!item) {
    return (
      <>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className={styles.mainContainer} style={{ marginTop: '100px', textAlign: 'center' }}>
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
      <div className={styles.mainContainer} style={{ marginTop: '100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <h1 className={styles.description1}>{item.name}</h1>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px', height: '600px' }}>
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>

          <div style={{ textAlign: 'center', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '10px' }}>Նկարագրություն</h2>
            <p style={{ marginBottom: '20px' }}>{item.description}</p>
            
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Տեսակ: </span>
              <span>{item.type}</span>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>Վիճակ: </span>
              <span style={{ color: item.isAvailable ? '#22c55e' : '#ef4444' }}>
                {item.isAvailable ? 'Առկա է' : 'Պատվիրել'}
              </span>
            </div>
            
            {item.isAvailable && (
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' }}>
                {item.price}
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 