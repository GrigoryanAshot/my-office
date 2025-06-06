"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface FurnitureItem {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  price: string | number;
  description: string;
  type: string;
  isAvailable: boolean;
}

export default function WhiteboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [types, setTypes] = useState<string[]>(['all']);
  const itemsPerPage = 8;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/whiteboard');
        if (!response.ok) throw new Error('Failed to fetch whiteboard data');
        const data = await response.json();
        setItems(data.items || []);
        const uniqueTypes = Array.from(new Set((data.items || []).map((item: FurnitureItem) => item.type)))
          .filter((type): type is string => typeof type === 'string');
        setTypes(['all', ...uniqueTypes.filter(Boolean)]);
      } catch (error) {
        setItems([]);
        setTypes(['all']);
      }
    };
    fetchData();
  }, []);

  // Helper function to get numeric price
  const getNumericPrice = (price: string | number): number => {
    if (typeof price === 'string') {
      const numericPrice = price.replace(/[^0-9]/g, '');
      return numericPrice ? parseInt(numericPrice) : 0;
    }
    return typeof price === 'number' ? price : 0;
  };

  // Filter items based on selected type and price range
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const price = getNumericPrice(item.price);
      const typeMatch = selectedType === 'all' || item.type === selectedType;
      const priceMatch = price >= priceRange.min && price <= priceRange.max;
      return typeMatch && priceMatch;
    });
  }, [items, selectedType, priceRange]);

  // Calculate max price from data
  const maxPrice = useMemo(() => {
    if (items.length === 0) return 1000000;
    return Math.max(...items.map(item => getNumericPrice(item.price)));
  }, [items]);

  // Set initial max price
  useEffect(() => {
    setPriceRange(prev => ({ ...prev, max: maxPrice }));
    setTempPriceRange(prev => ({ ...prev, max: maxPrice }));
  }, [maxPrice]);

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
        <h1 className={styles.description1}>Գրատախտակներ</h1>
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
            <Link key={item.id} href={`/other/whiteboard/${item.id}`} className={styles.card} style={{ textDecoration: 'none', color: 'inherit' }}>
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