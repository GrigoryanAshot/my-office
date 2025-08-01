"use client";

import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import styles from './TableDetail.module.css';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import CallOrderPopup from '@/component/banner/CallOrderPopup';

interface FurnitureItem {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  images: string[];
  type: string;
  url: string;
  isAvailable: boolean;
}

interface PageParams {
  id: string;
}

export default function TableDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const [item, setItem] = useState<FurnitureItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [callOrderOpen, setCallOrderOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        // First try to get all tables data from the new Redis-based API
        const response = await fetch('/api/tables2');
        if (!response.ok) {
          throw new Error('Failed to fetch tables data');
        }
        const data = await response.json();
        
        // Find the specific item by ID
        const item = data.items.find((item: any) => String(item.id) === id);
        
        if (!item) {
          throw new Error('Item not found');
        }
        
        setItem(item);
        setImages([item.imageUrl, ...(item.images || [])]);
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

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

  if (loading) {
    return (
      <>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className={styles.wrapper}>
          <div className={styles.errorContainer}>
            <h2 className={styles.errorTitle}>Բեռնվում է...</h2>
          </div>
        </div>
        <FooterSection />
        <ScrollToTopButton style="" />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className={styles.wrapper}>
          <div className={styles.errorContainer}>
            <h2 className={styles.errorTitle}>Ապրանքը չի գտնվել</h2>
            <p className={styles.errorMessage}>
              Ցավոք, մենք չենք կարող գտնել այս ապրանքը: Խնդրում ենք ստուգել URL-ը կամ վերադառնալ գլխավոր էջ:
            </p>
            <button className={styles.backButton} onClick={() => router.back()}>
              Վերադառնալ
            </button>
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
              <div className={styles.price}>{item.price} դրամ</div>
            )}
            <div className={styles.description}>{item.description}</div>
            <div className={styles.type}>Տեսակ: {item.type}</div>
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