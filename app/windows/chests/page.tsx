'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { furnitureData } from '@/component/Lists/windows/chests';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface FurnitureItem {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  price: string;
  description: string;
  type: string;
  isAvailable: boolean;
}

export default function ChestsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const itemsPerPage = 8;

  // Get unique types from the data
  const types = useMemo(() => {
    const uniqueTypes = new Set(furnitureData.map(item => item.type));
    return ['all', ...Array.from(uniqueTypes)];
  }, []);

  // Calculate max price from data
  const maxPrice = useMemo(() => {
    return Math.max(...furnitureData.map(item => parseInt(item.price.replace(/[^0-9]/g, ''))));
  }, []);

  // Set initial max price
  useEffect(() => {
    setPriceRange(prev => ({ ...prev, max: maxPrice }));
    setTempPriceRange(prev => ({ ...prev, max: maxPrice }));
  }, [maxPrice]);

  // Filter items based on selected type and price range
  const filteredItems = useMemo(() => {
    return furnitureData.filter(item => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      const typeMatch = selectedType === 'all' || item.type === selectedType;
      const priceMatch = price >= priceRange.min && price <= priceRange.max;
      return typeMatch && priceMatch;
    });
  }, [selectedType, priceRange]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
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
        <h1 className={styles.description1}>Տումբաներ և Կոմոդներ</h1>
        
        {/* Filters */}
        <div className={styles.filters} style={{ marginBottom: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <div className={styles.filterGroup}>
            <label style={{ marginRight: '10px' }}>Տեսակ:</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Բոլորը' : type}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label style={{ marginRight: '10px' }}>Գին:</label>
            <input
              type="number"
              placeholder="Նվազագույն"
              value={tempPriceRange.min}
              onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
              style={{ padding: '8px', borderRadius: '4px', width: '100px', marginRight: '10px' }}
            />
            <input
              type="number"
              placeholder="Առավելագույն"
              value={tempPriceRange.max}
              onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              style={{ padding: '8px', borderRadius: '4px', width: '100px' }}
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
          {currentItems.map((item: FurnitureItem) => (
            <Link key={item.id} href={`/windows/chests/${item.id}`} className={styles.card} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                  <div className={styles.itemPrice} style={{ color: '#000000' }}>{item.price}</div>
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

        {filteredItems.length > 0 && (
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