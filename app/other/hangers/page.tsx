'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

interface FurnitureItem {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  price: string;
  oldPrice?: string;
  description: string;
  type: string;
  isAvailable: boolean;
}

export default function HangersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial values from URL
  const initialPage = searchParams?.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
  const initialType = searchParams?.get('type') || 'all';
  const initialMinPrice = searchParams?.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : 0;
  const initialMaxPrice = searchParams?.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : Infinity;
  const initialShowSale = searchParams?.get('sale') === 'true';
  
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedType, setSelectedType] = useState(initialType);
  const [priceRange, setPriceRange] = useState({ min: initialMinPrice, max: initialMaxPrice });
  const [tempPriceRange, setTempPriceRange] = useState({ min: '', max: '' });
  const [showSaleOnly, setShowSaleOnly] = useState(initialShowSale);
  
  // Track initialization
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isInitialPriceSetup, setIsInitialPriceSetup] = useState(true);

  // Use scroll restoration hook
  const { saveScrollPosition, clearScrollRestoration } = useScrollRestoration({
    items,
    storageKey: 'hangers',
  });

  // Helper function to build URL with all current filter parameters
  const buildFilterUrl = (page: number, type: string, minPrice: number, maxPrice: number, saleOnly: boolean) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (type !== 'all') params.set('type', type);
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice < Infinity) params.set('maxPrice', maxPrice.toString());
    if (saleOnly) params.set('sale', 'true');
    return params.toString() ? `?${params.toString()}` : '';
  };

  // Update URL with current filters
  const updateUrlWithFilters = (page: number, type: string, minPrice: number, maxPrice: number, saleOnly: boolean) => {
    const url = `/other/hangers${buildFilterUrl(page, type, minPrice, maxPrice, saleOnly)}`;
    router.replace(url, { scroll: false });
  };

  // Handle type change
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    setCurrentPage(1);
    updateUrlWithFilters(1, newType, priceRange.min, priceRange.max, showSaleOnly);
    clearScrollRestoration();
  };

  // Handle sale toggle
  const handleSaleToggle = () => {
    const newShowSale = !showSaleOnly;
    setShowSaleOnly(newShowSale);
    setCurrentPage(1);
    updateUrlWithFilters(1, selectedType, priceRange.min, priceRange.max, newShowSale);
    clearScrollRestoration();
  };

  // Handle page change with scroll to top
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrlWithFilters(newPage, selectedType, priceRange.min, priceRange.max, showSaleOnly);
    clearScrollRestoration();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    const min = tempPriceRange.min ? parseInt(tempPriceRange.min) : 0;
    const max = tempPriceRange.max ? parseInt(tempPriceRange.max) : Infinity;
    setPriceRange({ min, max });
    setCurrentPage(1);
    updateUrlWithFilters(1, selectedType, min, max, showSaleOnly);
    clearScrollRestoration();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/metal_metal_hangers');
        const data = await res.json();
        setItems(data.items || []);
        setTypes(data.types || []);
      } catch (e) {
        setItems([]);
        setTypes([]);
      }
    };
    fetchData();
  }, []);

  const typesWithAll = useMemo(() => ['all', ...types], [types]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const typeMatch = selectedType === 'all' || item.type === selectedType;
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      const priceMatch = price >= priceRange.min && price <= priceRange.max;
      const saleMatch = !showSaleOnly || (item.oldPrice && item.oldPrice.trim());
      return typeMatch && priceMatch && saleMatch;
    });
  }, [items, selectedType, priceRange, showSaleOnly]);

  // Reset to first page when filters change (but not on initial load or price range initialization)
  useEffect(() => {
    if (hasInitialized && !isInitialPriceSetup) {
      setCurrentPage(1);
    }
  }, [selectedType, priceRange.min, showSaleOnly, hasInitialized]);
  
  // Mark initial price setup as complete after items are loaded
  useEffect(() => {
    if (items.length > 0 && isInitialPriceSetup) {
      setIsInitialPriceSetup(false);
    }
  }, [items, isInitialPriceSetup]);
  
  // Mark as initialized after URL parameter processing
  useEffect(() => {
    if (searchParams) {
      setHasInitialized(true);
    }
  }, [searchParams]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.mainContainer} style={{ marginTop: '100px' }}>
        <h1 className={styles.description1}>Կախիչներ</h1>
        <div className={styles.filters} style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
          <button
            onClick={handleSaleToggle}
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
              onChange={(e) => handleTypeChange(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', height: '36px' }}
            >
              {typesWithAll.map(type => (
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
              onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: e.target.value }))}
              style={{ padding: '8px', borderRadius: '4px', width: '100px', marginRight: '10px', height: '36px', boxSizing: 'border-box' }}
            />
            <input
              type="number"
              placeholder="Առավելագույն"
              value={tempPriceRange.max}
              onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: e.target.value }))}
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
          {currentItems.map((item: FurnitureItem) => {
            const filterParams = buildFilterUrl(currentPage, selectedType, priceRange.min, priceRange.max, showSaleOnly);
            return (
            <Link 
              key={item.id} 
              href={`/other/hangers/${item.id}${filterParams}`} 
              className={styles.card} 
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={saveScrollPosition}
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
            );
          })}
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
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Նախորդ
            </button>
            <span>Էջ {currentPage} / {totalPages}-ից</span>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
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