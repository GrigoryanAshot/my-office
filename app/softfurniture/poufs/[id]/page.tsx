"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './TableDetail.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import DataLoading from '@/component/loading/DataLoading';

interface PoufItem {
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

export default function PoufDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [item, setItem] = useState<PoufItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImg, setCurrentImg] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/poufs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch item');
        }
        const data = await response.json();
        setItem(data);
        setImages([data.imageUrl, ...(data.images || [])]);
      } catch (err) {
        setError('Ապրանքը չի գտնվել');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev + 1) % images.length);
  };
  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return <DataLoading />;
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
            <div className={styles.availability}>{item.isAvailable ? 'Առկա է' : 'Վաճառված է'}</div>
            {item.isAvailable && (
              <button className={styles.orderCallBtn}>Պատվիրել զանգ</button>
            )}
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
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 