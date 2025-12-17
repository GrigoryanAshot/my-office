"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import { ProductData } from '@/lib/seo/productMetadata';

interface PodiumPageClientProps {
  initialItems: ProductData[];
}

export default function PodiumPageClient({ initialItems }: PodiumPageClientProps) {
  const [items, setItems] = useState<ProductData[]>(initialItems);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [types, setTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const uniqueTypes = Array.from(new Set(items.map(item => item.type))) as string[];
    setTypes(['all', ...uniqueTypes]);

    if (items.length > 0) {
      const maxPrice = Math.max(...items.map(item => 
        parseInt(item.price.replace(/[^0-9]/g, '')) || 0
      ));
      setPriceRange(prev => ({ ...prev, max: maxPrice }));
      setTempPriceRange(prev => ({ ...prev, max: maxPrice }));
    }
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const price = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
      const typeMatch = selectedType === 'all' || item.type === selectedType;
      const priceMatch = price >= priceRange.min && price <= priceRange.max;
      const saleMatch = !showSaleOnly || (item.oldPrice && item.oldPrice.trim());
      return typeMatch && priceMatch && saleMatch;
    });
  }, [items, selectedType, priceRange, showSaleOnly]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, priceRange, showSaleOnly]);

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
  };

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.mainContainer} style={{ marginTop: '100px' }}>
        <h1 className={styles.description1}>Ամբիոն</h1>
        <div className={styles.filters} style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
          <button
            onClick={() => setShowSaleOnly(!showSaleOnly)}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: showSaleOnly ? '#dc3545' : '#fff',
              color: showSaleOnly ? '#fff' : '#000',
              cursor: 'pointer',
              fontSize: '14px',
              height: '36px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Ակցիա
          </button>
          
          <div className={styles.filterGroup} style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '10px', marginBottom: '0' }}>Տեսակ:</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', height: '36px' }}
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Բոլորը' : type}
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
            style={{ height: '36px' }}
          >
            Կիրառել
          </button>
        </div>

        <div className={styles.grid}>
          {currentItems.map((item) => (
            <Link 
              key={item.id} 
              href={`/other/podium/${item.id}`} 
              className={styles.card}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={400}
                  height={300}
                  className={styles.image}
                />
              </div>
              <div className={styles.cardContent} style={{ textAlign: 'center' }}>
                <h2 className={styles.cardTitle}>{item.name}</h2>
                <div className={styles.cardDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Տեսակ:</span>
                    <span className={styles.detailValue}>{item.type}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailValue} style={{ color: item.isAvailable ? '#22c55e' : '#ef4444' }}>
                      {item.isAvailable ? 'Առկա է' : 'Պատվիրել'}
                    </span>
                  </div>
                </div>
                {item.isAvailable && (
                  <div className={styles.itemPrice} style={{ color: '#000000' }}>
                    {item.oldPrice && item.oldPrice.trim() && (
                      <div style={{ 
                        textDecoration: 'line-through', 
                        color: '#dc3545', 
                        fontSize: '0.9em',
                        marginBottom: '4px'
                      }}>
                        {item.oldPrice}
                      </div>
                    )}
                    <div style={{ fontWeight: 'bold' }}>
                      {item.price}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            Ապրանքներ չկան ընտրված ֆիլտրերով
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Նախորդ
            </button>
            <span>Էջ {currentPage} / {totalPages}-ից</span>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
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

