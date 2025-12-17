'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import NavbarSection from '../../../../component/navbar/NavbarSection';
import FooterSection from '../../../../component/footer/FooterSection';
import ScrollToTopButton from '../../../../component/utils/ScrollToTopButton';
import styles from './TableDetail.module.css';
import { furnitureData } from '../../../../component/Lists/doors/doors_takht';

interface Takht {
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

export default function TakhtDetailPage() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : 1;
  const takht = furnitureData.find((item) => item.id === id);

  // For now, use the same image 3 times as placeholders
  const images = takht ? [takht.imageUrl, takht.imageUrl, takht.imageUrl] : [];
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

  if (!takht) {
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
              alt={takht.name}
              className={styles.mainPhotoImg}
              onClick={openModal}
              style={{ cursor: 'pointer' }}
            />
            <button className={styles.arrow} onClick={nextImg} aria-label="Next photo">&#8594;</button>
          </div>
        </div>
        <div className={styles.right}>
          <h2 className={styles.itemName}>{takht.name}</h2>
          <p className={styles.description} style={{ whiteSpace: 'pre-line' }}>{takht.description}</p>
          <p className={styles.sizes}><strong>Տեսակ:</strong> {takht.type}</p>
          {takht.isAvailable ? (
            <p className={styles.price}><strong>Գին:</strong> {takht.price}</p>
          ) : null}
          <p className={styles.availability} style={{ color: takht.isAvailable ? '#22c55e' : '#ef4444' }}>
            <strong>Առկայություն:</strong> {takht.isAvailable ? 'Առկա է' : 'Պատվիրել'}
          </p>
          {!takht.isAvailable && (
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
            <img src={images[currentImg]} alt={takht.name} className={styles.modalImg} />
            <button className={styles.modalArrow} onClick={nextImg} aria-label="Next photo">&#8594;</button>
          </div>
        </div>
      )}
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 