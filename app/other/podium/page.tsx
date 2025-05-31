"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface Item {
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

export default function PodiumPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [types, setTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/podium');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data.items || []);
      
      // Extract unique types
      const uniqueTypes = Array.from(new Set((data.items || []).map((item: Item) => item.type))) as string[];
      setTypes(['all', ...uniqueTypes]);

      // Set max price
      const maxPrice = Math.max(...(data.items || []).map((item: Item) => 
        parseInt(item.price.replace(/[^0-9]/g, '')) || 0
      ));
      setPriceRange(prev => ({ ...prev, max: maxPrice }));
      setTempPriceRange(prev => ({ ...prev, max: maxPrice }));
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const price = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    const priceMatch = price >= priceRange.min && price <= priceRange.max;
    return typeMatch && priceMatch;
  });

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
        <h1 className={styles.description1}>Ամբիոն</h1>
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