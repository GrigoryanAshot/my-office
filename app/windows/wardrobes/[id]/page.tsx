'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import NavbarSection from '../../../../component/navbar/NavbarSection';
import FooterSection from '../../../../component/footer/FooterSection';
import ScrollToTopButton from '../../../../component/utils/ScrollToTopButton';
import styles from './TableDetail.module.css';
import { furnitureData } from '../../../../component/Lists/windows/wardrobes';

interface Wardrobe {
  id: number;
  headName?: string;
  name: string;
  url: string;
  imageUrl: string;
  description: string;
  price: string;
  type: string;
  isAvailable: boolean;
}

const LOGO = '/images/logo.png';

export default function WardrobeDetailPage() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : 1;
  const wardrobe = furnitureData.find((item) => item.id === id);

  // For now, use the same image 3 times as placeholders
  const images = wardrobe ? [wardrobe.imageUrl, wardrobe.imageUrl, wardrobe.imageUrl] : [];
  const [currentImg, setCurrentImg] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const prevImg = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImg = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  if (!wardrobe) {
    return (
      <>
        <NavbarSection style="" logo={LOGO} />
        <div className={styles.wrapper}>
          <div style={{ width: '100%', textAlign: 'center', padding: '60px 0' }}>
            <h2>Ապրանքը չի գտնվել</h2>
          </div>
        </div>
        <FooterSection />
        <ScrollToTopButton style="" />
      </>
    );
  }

  return (
    <>
      <NavbarSection style="" logo={LOGO} />
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.photoAlbum}>
            <button className={styles.arrow} onClick={prevImg} aria-label="Previous photo">&#8592;</button>
            <img
              src={images[currentImg]}
              alt={wardrobe.name}
              className={styles.mainPhotoImg}
              onClick={openModal}
              style={{ cursor: 'pointer' }}
            />
            <button className={styles.arrow} onClick={nextImg} aria-label="Next photo">&#8594;</button>
          </div>
        </div>
        <div className={styles.right}>
          <h2 className={styles.itemName}>{wardrobe.name}</h2>
          <p className={styles.description}>{wardrobe.description}</p>
          <p className={styles.sizes}><strong>Տեսակ:</strong> {wardrobe.type}</p>
          {wardrobe.isAvailable ? (
            <p className={styles.price}><strong>Գին:</strong> {wardrobe.price}</p>
          ) : null}
          <p className={styles.availability} style={{ color: wardrobe.isAvailable ? '#22c55e' : '#ef4444' }}>
            <strong>Առկայություն:</strong> {wardrobe.isAvailable ? 'Առկա է' : 'Պատվիրել'}
          </p>
          {!wardrobe.isAvailable && (
            <button className={styles.orderCallBtn}>
              Պատվիրել զանգ
            </button>
          )}
        </div>
      </div>
      
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>&times;</button>
            <button className={styles.modalArrow} onClick={prevImg} aria-label="Previous photo">&#8592;</button>
            <img src={images[currentImg]} alt={wardrobe.name} className={styles.modalImg} />
            <button className={styles.modalArrow} onClick={nextImg} aria-label="Next photo">&#8594;</button>
          </div>
        </div>
      )}
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 