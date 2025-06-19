"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import CallOrderPopup from '@/component/banner/CallOrderPopup';
import styles from './MetalWallDecorDetail.module.css';

interface MetalWallDecorItem {
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

export default function MetalWallDecorDetailPage() {
  const params = useParams();
  const router = useRouter();

  if (!params?.id) {
    return (
      <div>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2>Ապրանքը չի գտնվել</h2>
              <p>Խնդրում ենք ստուգել URL-ը կամ վերադառնալ գլխավոր էջ</p>
              <button onClick={() => router.push('/')} className={styles.backButton}>
                Վերադառնալ գլխավոր էջ
              </button>
            </div>
          </div>
        </div>
        <FooterSection />
      </div>
    );
  }

  const id = params.id;
  const [item, setItem] = useState<MetalWallDecorItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showCallOrderPopup, setShowCallOrderPopup] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/metal-wall-decor/${id}`);
        if (!response.ok) {
          throw new Error('Item not found');
        }
        const data = await response.json();
        setItem(data);
        setImages([data.imageUrl, ...data.images]);
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.loading}>Բեռնվում է...</div>
          </div>
        </div>
        <FooterSection />
      </div>
    );
  }

  if (!item) {
    return (
      <div>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2>Ապրանքը չի գտնվել</h2>
              <p>Խնդրում ենք ստուգել URL-ը կամ վերադառնալ գլխավոր էջ</p>
              <button onClick={() => router.push('/')} className={styles.backButton}>
                Վերադառնալ գլխավոր էջ
              </button>
            </div>
          </div>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage} onClick={() => openModal(0)}>
              <img src={images[currentImageIndex]} alt={item.name} />
            </div>
            <div className={styles.thumbnailContainer}>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`${styles.thumbnail} ${currentImageIndex === index ? styles.active : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={image} alt={`${item.name} - ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.detailsSection}>
            <h1 className={styles.title}>{item.name}</h1>
            <p className={styles.price}>{item.price}</p>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.type}>Տեսակ: {item.type}</p>
            <p className={styles.availability}>
              {item.isAvailable ? 'Առկա է' : 'Պատվիրել'}
            </p>
            <button
              className={styles.orderCallBtn}
              onClick={() => setShowCallOrderPopup(true)}
            >
              Զանգահարել պատվիրելու համար
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>×</button>
            <button className={styles.modalPrev} onClick={prevImage}>‹</button>
            <img src={images[currentImageIndex]} alt={item.name} />
            <button className={styles.modalNext} onClick={nextImage}>›</button>
          </div>
        </div>
      )}

      {showCallOrderPopup && (
        <CallOrderPopup 
          isOpen={showCallOrderPopup} 
          onClose={() => setShowCallOrderPopup(false)} 
        />
      )}

      <FooterSection />
      <ScrollToTopButton style="" />
    </div>
  );
} 