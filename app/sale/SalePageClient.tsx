'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface SaleItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  link: string;
  source?: string;
  originalItem?: any;
}

interface SalePageClientProps {
  initialItems: SaleItem[];
}

export default function SalePageClient({ initialItems }: SalePageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('Բոլորը');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [items] = useState<SaleItem[]>(initialItems);
  const itemsPerPage = 8;

  useEffect(() => {
    if (initialItems.length > 0) {
      const maxPrice = Math.max(...initialItems.map((item) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return isNaN(price) ? 0 : price;
      }));
      if (maxPrice > 0) {
        setPriceRange(prev => ({ ...prev, max: maxPrice }));
        setTempPriceRange(prev => ({ ...prev, max: maxPrice }));
      }
    }
  }, [initialItems]);

  const types = useMemo(() => {
    const uniqueTypes = new Set(items.map(item => item.originalItem?.type || item.source).filter(Boolean));
    return ['Բոլորը', ...Array.from(uniqueTypes)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const itemType = item.originalItem?.type || item.source;
      const typeMatch = selectedType === 'Բոլորը' || itemType === selectedType;
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      const priceMatch = !isNaN(price) && price >= priceRange.min && price <= priceRange.max;
      return typeMatch && priceMatch;
    });
  }, [items, selectedType, priceRange]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, priceRange]);

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
  };

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.mainContainer} style={{ marginTop: '100px' }}>
        <h1 className={styles.description1}>Ակցիա</h1>
        
        <div className={styles.filters} style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '15px'
        }}>
          <div className={styles.filterGroup} style={{ display: 'flex', alignItems: 'center', marginBottom: '0' }}>
            <label style={{ marginRight: '10px', marginBottom: '0' }}>Տեսակ:</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', height: '36px' }}
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'Բոլորը' ? 'Բոլորը' : type}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup} style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '10px', marginBottom: '0' }}>Գին:</label>
            <input
              type="number"
              placeholder="Նվազագույն"
              value={tempPriceRange.min}
              onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
              style={{ padding: '8px', borderRadius: '4px', width: '100px', marginRight: '10px', height: '36px', boxSizing: 'border-box' }}
            />
            <input
              type="number"
              placeholder="Առավելագույն"
              value={tempPriceRange.max}
              onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              style={{ padding: '8px', borderRadius: '4px', width: '100px', height: '36px', boxSizing: 'border-box' }}
            />
          </div>
          <button 
            onClick={handleApplyFilters}
            className={styles.applyFilterBtn}
          >
            Կիրառել
          </button>
        </div>

        <div className={styles.grid}>
          {currentItems.map((item: SaleItem) => (
            <Link key={item.id} href={`/sale/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.card} style={{ cursor: 'pointer' }}>
                <div className={styles.imageContainer}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={400}
                    height={300}
                    className={styles.image}
                  />
                </div>
                <div className={styles.cardContent} style={{ textAlign: 'center' }}>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <div className={styles.cardDetails}>
                    {(item.originalItem?.type || item.source) && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Տեսակ:</span>
                        <span className={styles.detailValue}>{item.originalItem?.type || item.source}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.itemPrice} style={{ color: '#000000' }}>
                    {item.originalItem?.oldPrice && item.originalItem.oldPrice.trim() && (
                      <div style={{ 
                        textDecoration: 'line-through', 
                        color: '#dc3545', 
                        fontSize: '0.9em',
                        marginBottom: '2px'
                      }}>
                        Հին գին: {item.originalItem.oldPrice}
                      </div>
                    )}
                    <div style={{ fontWeight: 'bold', color: '#22c55e' }}>
                      Նոր գին: {item.price}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            Ակցիայի ապրանքներ չկան ընտրված ֆիլտրերով
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Նախորդ
            </button>
            <span>
              Էջ {currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Հաջորդ
            </button>
          </div>
        )}
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
}
