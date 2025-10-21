"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
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
  oldPrice?: string;
  description: string;
  type: string;
  isAvailable: boolean;
  images?: string[];
}

export default function ChairsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial page from URL immediately
  const initialPage = searchParams?.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
  console.error('🔍 INITIAL PAGE from searchParams:', initialPage);
  
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const itemsPerPage = 12;

  // Sync with URL parameter changes
  useEffect(() => {
    console.error('🔍 URL SYNC EFFECT - searchParams:', searchParams?.toString());
    const pageParam = searchParams?.get('page');
    const newPage = pageParam ? parseInt(pageParam, 10) : 1;
    if (newPage > 0 && newPage !== currentPage) {
      console.error('🔍 URL SYNC - Updating currentPage from', currentPage, 'to', newPage);
      setCurrentPage(newPage);
    }
  }, [searchParams]);

  // Function to handle page change with scroll to top
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', newPage.toString());
    router.replace(`/furniture/chairs?${params.toString()}`, { scroll: false });
    
    // Scroll to top of the page with a small delay to ensure content updates first
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/chairs');
        if (!response.ok) {
          throw new Error('Failed to fetch chairs');
        }
        const data = await response.json();
        const items = data.items || [];
        setItems(items);
        
        // Calculate max price from data
        if (items.length > 0) {
          const prices = items.map((item: FurnitureItem) => parseInt(item.price.replace(/[^0-9]/g, ''))).filter((price: number) => !isNaN(price));
          const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000000;
          setPriceRange(prev => ({ ...prev, max: maxPrice }));
          setTempPriceRange(prev => ({ ...prev, max: maxPrice }));
        }
      } catch (error) {
        console.error('Error loading chairs:', error);
      }
    };

    fetchItems();
  }, []);

  // Get unique types from the data
  const types = useMemo(() => {
    const uniqueTypes = new Set(items.map(item => item.type));
    return ['all', ...Array.from(uniqueTypes)];
  }, [items]);

  // Filter items based on selected type, price range, and sale filter
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
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

  // Reset to first page when filters change (but not on initial load or price range initialization)
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isInitialPriceSetup, setIsInitialPriceSetup] = useState(true);
  
  // Mark initial price setup as complete after items are loaded
  useEffect(() => {
    if (items.length > 0 && isInitialPriceSetup) {
      console.error('🔍 INITIAL PRICE SETUP - completed');
      setIsInitialPriceSetup(false);
    }
  }, [items, isInitialPriceSetup]);
  
  useEffect(() => {
    console.error('🔍 FILTER RESET - hasInitialized:', hasInitialized, 'isInitialPriceSetup:', isInitialPriceSetup);
    // Only reset if initialized AND not during initial price setup
    if (hasInitialized && !isInitialPriceSetup) {
      console.error('🔍 FILTER RESET - setting currentPage to 1');
      setCurrentPage(1);
    }
  }, [selectedType, priceRange.min, showSaleOnly, hasInitialized, isInitialPriceSetup]);
  
  // Mark as initialized after URL parameter processing
  useEffect(() => {
    console.error('🔍 HAS INITIALIZED - searchParams:', searchParams?.toString());
    if (searchParams) {
      console.error('🔍 HAS INITIALIZED - setting to true');
      setHasInitialized(true);
    }
  }, [searchParams]);

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
  };

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.mainContainer} style={{ marginTop: '100px' }}>
        <h1 className={styles.description1}>Աթոռներ</h1>
        
        {/* Filters */}
        <div className={styles.filters} style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '15px'
        }}>
          <button 
            onClick={() => setShowSaleOnly(!showSaleOnly)}
            style={{
              padding: '8px 16px',
              backgroundColor: showSaleOnly ? '#dc3545' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: showSaleOnly ? 'bold' : 'normal',
              height: '36px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Ակցիա
          </button>
          <div className={styles.filterGroup} style={{ display: 'flex', alignItems: 'center', marginBottom: '0' }}>
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
          >
            Կիրառել
          </button>
        </div>

        <div className={styles.grid}>
          {currentItems.map((item: FurnitureItem) => {
            // Preserve current page in the link
            const currentPageParam = currentPage > 1 ? `?page=${currentPage}` : '';
            return (
            <Link key={item.id} href={`/furniture/chairs/${item.id}${currentPageParam}`} className={styles.card} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                        marginBottom: '2px'
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