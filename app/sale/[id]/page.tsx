'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import styles from './SaleDetail.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface SaleItem {
  id: number;
  imageUrl: string;
  images: string[];
  title: string;
  description: string;
  price: string;
  link: string;
  source?: string;
  originalItem?: any;
  oldPrice?: string;
}

export default function SaleDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<SaleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaleItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/sale-slider');
        if (!response.ok) {
          throw new Error('Failed to fetch sale items');
        }
        
        const data = await response.json();
        const items = data.items || [];
        
        // Convert items to sequential IDs and find the specific sale item
        const itemsWithSequentialIds = items.map((item: SaleItem, index: number) => ({
          ...item,
          id: index + 1
        }));
        
        // Find the specific sale item by sequential ID
        const saleItem = itemsWithSequentialIds.find((saleItem: SaleItem) => String(saleItem.id) === String(params?.id));
        
        if (!saleItem) {
          throw new Error('Sale item not found');
        }
        
        setItem(saleItem);
      } catch (error) {
        console.error('Error fetching sale item:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch sale item');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchSaleItem();
    }
  }, [params?.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!item) {
    return <div>Sale item not found</div>;
  }

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.mainContainer}>
        <div className={styles.gridContainer}>
          {/* Image Section */}
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
            
            {/* Additional Images */}
            {item.images && item.images.length > 0 && (
              <div className={styles.additionalImages}>
                <h3 className={styles.additionalImagesTitle}>Լրացուցիչ նկարներ</h3>
                <div className={styles.additionalImagesGrid}>
                  {item.images.map((imageUrl, index) => (
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

          {/* Details Section */}
          <div className={styles.detailsSection}>
            <h1 className={styles.title}>
              {item.title}
            </h1>

            {/* Type Information */}
            {(item.originalItem?.type || item.source) && (
              <div className={styles.typeInfo}>
                <span className={styles.typeLabel}>Տեսակ: </span>
                <span className={styles.typeValue}>{item.originalItem?.type || item.source}</span>
              </div>
            )}

            {/* Sale Badge */}
            <div className={styles.saleBadge}>
              Ակցիա
            </div>

            {/* Price Information */}
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

            {/* Description */}
            {item.description && (
              <div className={styles.descriptionSection}>
                <h3 className={styles.descriptionTitle}>Նկարագրություն:</h3>
                <p className={styles.descriptionText} style={{ whiteSpace: 'pre-line' }}>{item.description}</p>
              </div>
            )}

            {/* Original Item Details */}
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