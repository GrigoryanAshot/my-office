'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './SaleDetail.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import { SaleItem } from '@/lib/seo/fetchSale';

interface SaleDetailClientProps {
  item: SaleItem;
}

export default function SaleDetailClient({ item }: SaleDetailClientProps) {
  const router = useRouter();
  const images = item.images || [];

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.mainContainer}>
        <div className={styles.gridContainer}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={600}
                height={400}
                className={styles.image}
              />
            </div>
            
            {images.length > 0 && (
              <div className={styles.additionalImages}>
                <h3 className={styles.additionalImagesTitle}>Լրացուցիչ նկարներ</h3>
                <div className={styles.additionalImagesGrid}>
                  {images.map((imageUrl, index) => (
                    <div key={index} className={styles.additionalImageItem}>
                      <Image
                        src={imageUrl}
                        alt={`${item.title} - Additional ${index + 1}`}
                        width={150}
                        height={150}
                        className={styles.additionalImage}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.detailsSection}>
            <h1 className={styles.title}>{item.title}</h1>

            {(item.originalItem?.type || item.source) && (
              <div className={styles.typeInfo}>
                <span className={styles.typeLabel}>Տեսակ: </span>
                <span className={styles.typeValue}>{item.originalItem?.type || item.source}</span>
              </div>
            )}

            <div className={styles.saleBadge}>Ակցիա</div>

            <div className={styles.priceSection}>
              {(item.originalItem?.oldPrice || item.oldPrice) && (item.originalItem?.oldPrice || item.oldPrice).trim() && (
                <div className={styles.oldPrice}>
                  Հին գին: {item.originalItem?.oldPrice || item.oldPrice} դրամ
                </div>
              )}
              <div className={styles.newPrice}>
                Նոր գին: {item.price} դրամ
              </div>
            </div>

            {item.description && (
              <div className={styles.descriptionSection}>
                <h3 className={styles.descriptionTitle}>Նկարագրություն:</h3>
                <p className={styles.descriptionText} style={{ whiteSpace: 'pre-line' }}>{item.description}</p>
              </div>
            )}

            {item.originalItem && (
              <div className={styles.originalItemSection}>
                <h3 className={styles.originalItemTitle}>Լրացուցիչ տեղեկություններ:</h3>
                <div className={styles.originalItemContent}>
                  {item.originalItem.description && (
                    <p className={styles.originalItemDescription} style={{ whiteSpace: 'pre-line' }}>{item.originalItem.description}</p>
                  )}
                  {item.originalItem.isAvailable !== undefined && (
                    <p className={styles.availability}>
                      <span className={styles.availabilityLabel}>Առկայություն: </span>
                      {item.originalItem.isAvailable ? 'Առկա է' : 'Պատվիրել'}
                    </p>
                  )}
                </div>
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
