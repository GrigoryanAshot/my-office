"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavbarSection from "@/component/navbar/NavbarSection";
import FooterSection from "@/component/footer/FooterSection";
import ScrollToTopButton from "@/component/utils/ScrollToTopButton";
import styles from "./TableDetail.module.css";

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

export default function ShelvingDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<FurnitureItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!params?.id) {
        setError("Missing shelving ID");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`/api/shelving/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch shelving item");
        }
        const data = await response.json();
        setItem(data);
        setImages([data.imageUrl, ...(data.images || [])]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [params]);

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
  if (error || !item) {
    return (
      <>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className={styles.wrapper}>
          <div className={styles.errorContainer}>
            <h2 className={styles.errorTitle}>Ապրանքը չի գտնվել</h2>
            <p className={styles.errorMessage}>{error || "Item not found"}</p>
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
            <button className={styles.orderCallBtn}>
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
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 