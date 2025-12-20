'use client';

import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import styles from './TableDetail.module.css';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import CallOrderPopup from '@/component/banner/CallOrderPopup';
import { ProductData } from '@/lib/seo/productMetadata';

interface TableDetailClientProps {
  item: ProductData;
}

export default function TableDetailClient({ item }: TableDetailClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentImg, setCurrentImg] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [callOrderOpen, setCallOrderOpen] = useState(false);
  const images = [item.imageUrl, ...(item.images || [])];

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBackNavigation = () => {
    const pageParam = searchParams?.get('page');
    if (pageParam && parseInt(pageParam, 10) > 1) {
      router.push(`/furniture/tables?page=${pageParam}`);
    } else {
      router.push('/furniture/tables');
    }
  };

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage} onClick={openModal}>
              <img src={images[currentImg]} alt={item.name} />
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnailContainer}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`${styles.thumbnail} ${currentImg === idx ? styles.active : ''}`}
                    onClick={() => setCurrentImg(idx)}
                  >
                    <img src={img} alt={`${item.name} - ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.detailsSection}>
            <h1 className={styles.title}>{item.name}</h1>
            {item.isAvailable && (
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
            )}
            <div className={styles.description} style={{ whiteSpace: 'pre-line' }}>{item.description}</div>
            <div className={styles.type}>Տեսակ: {item.type || 'N/A'}</div>
            <div className={styles.availability}>
              {item.isAvailable ? 'Առկա է' : 'Պատվիրել'}
            </div>
            <button className={styles.orderCallBtn} onClick={() => setCallOrderOpen(true)}>
              Պատվիրել զանգ
            </button>
          </div>
        </div>
      </div>
      
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>&times;</button>
            <button className={styles.modalArrow} onClick={prevImg} aria-label="Previous photo">&#8592;</button>
            <img src={images[currentImg]} alt={item.name} className={styles.modalImg} />
            <button className={styles.modalArrow} onClick={nextImg} aria-label="Next photo">&#8594;</button>
          </div>
        </div>
      )}
      <CallOrderPopup isOpen={callOrderOpen} onClose={() => setCallOrderOpen(false)} />
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
}
