// Trivial change: force redeploy to ensure /api/tables2 is used everywhere
'use client';

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

export default function TablesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize currentPage from URL on client-side
  const getInitialPage = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get('page');
      if (pageParam) {
        const page = parseInt(pageParam, 10);
        if (page > 0) {
          console.error('🔍 INITIAL PAGE - Setting from URL:', page);
          return page;
        }
      }
    }
    return 1;
  };
  
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [selectedType, setSelectedType] = useState<string>('Բոլորը');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  // Sync with URL parameters when they change
  useEffect(() => {
    console.error('🔍 URL SYNC EFFECT - searchParams:', searchParams?.toString());
    const pageParam = searchParams?.get('page');
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (page > 0 && page !== currentPage) {
        console.error('🔍 URL SYNC - Updating currentPage from', currentPage, 'to', page);
        setCurrentPage(page);
      }
    }
  }, [searchParams, currentPage]);

  // Function to handle page change with scroll to top
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', newPage.toString());
    router.replace(`/furniture/tables?${params.toString()}`, { scroll: false });
    
    // Scroll to top of the page with a small delay to ensure content updates first
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching tables data...');
        const response = await fetch('/api/tables2', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });
        
        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch tables: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Tables data received:', data);
        
        if (!data || !Array.isArray(data.items)) {
          console.error('Invalid data format:', data);
          throw new Error('Invalid data format received from server');
        }
        
        const items = data.items || [];
        console.log('Setting items:', items);
        setItems(items);
        
        // Calculate max price from data
        if (items.length > 0) {
          const maxPrice = Math.max(...items.map((item: FurnitureItem) => parseInt(item.price.replace(/[^0-9]/g, ''))));
          console.log('Setting max price:', maxPrice);
          setPriceRange(prev => ({ ...prev, max: maxPrice }));
          setTempPriceRange(prev => ({ ...prev, max: maxPrice }));
        }
      } catch (error) {
        console.error('Error loading tables:', error);
        setError(error instanceof Error ? error.message : 'Failed to load tables');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Get unique types from the data
  const types = useMemo(() => {
    const uniqueTypes = new Set(items.map(item => item.type));
    return ['Բոլորը', ...Array.from(uniqueTypes)];
  }, [items]);

  // Calculate max price from data
  const maxPrice = useMemo(() => {
    if (items.length === 0) return 1000000; // Default max price
    const prices = items.map(item => parseInt(item.price.replace(/[^0-9]/g, ''))).filter(price => !isNaN(price));
    return prices.length > 0 ? Math.max(...prices) : 1000000;
  }, [items]);

  // Set initial max price
  useEffect(() => {
    setPriceRange(prev => ({ ...prev, max: maxPrice }));
    setTempPriceRange(prev => ({ ...prev, max: maxPrice }));
  }, [maxPrice]);

  // Filter items based on selected type, price range, and sale filter
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const typeMatch = selectedType === 'Բոլորը' || item.type === selectedType;
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      const priceMatch = price >= priceRange.min && price <= priceRange.max;
      const saleMatch = !showSaleOnly || (item.oldPrice && item.oldPrice.trim());
      return typeMatch && priceMatch && saleMatch;
    });
  }, [items, selectedType, priceRange, showSaleOnly]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);
  
  console.error('🔍 RENDER - currentPage:', currentPage, 'totalPages:', totalPages, 'startIndex:', startIndex);
  console.error('🔍 RENDER - URL:', typeof window !== 'undefined' ? window.location.href : 'server');
  console.error('🔍 RENDER - searchParams:', searchParams?.toString());
  console.error('🔍 RENDER - currentItems length:', currentItems.length);
  

  // Reset to first page when filters change (but not on initial load)
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    console.error('🔍 FILTER RESET - hasInitialized:', hasInitialized, 'currentPage:', currentPage);
    if (hasInitialized) {
      console.error('🔍 FILTER RESET - setting currentPage to 1');
      setCurrentPage(1);
    }
  }, [selectedType, priceRange, showSaleOnly, hasInitialized]);
  
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.mainContainer} style={{ marginTop: '100px' }}>
        <h1 className={styles.description1}>Սեղաններ</h1>
        
        {/* Filters */}
        <div className={styles.filters} style={{ 
          marginBottom: '20px', 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center',
          alignItems: 'center'
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
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup} style={{ display: 'flex', alignItems: 'center', marginBottom: '0' }}>
            <label style={{ marginRight: '10px', marginBottom: '0' }}>Գին:</label>
            <input
              type="number"
              placeholder="Նվազագույն"
              value={tempPriceRange.min}
              onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
              style={{ padding: '8px', borderRadius: '4px', width: '100px', marginRight: '10px', height: '36px' }}
            />
            <input
              type="number"
              placeholder="Առավելագույն"
              value={tempPriceRange.max}
              onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              style={{ padding: '8px', borderRadius: '4px', width: '100px', height: '36px' }}
            />
          </div>
          
          <button 
            onClick={handleApplyFilters}
            className={styles.applyFilterBtn}
            style={{ height: '36px', display: 'flex', alignItems: 'center' }}
          >
            Կիրառել
          </button>
        </div>

        <div className={styles.grid}>
          {currentItems.map((item: FurnitureItem) => {
            // Preserve current page in the link
            const currentPageParam = currentPage > 1 ? `?page=${currentPage}` : '';
            return (
            <Link key={item.id} href={`/furniture/tables/${item.id}${currentPageParam}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.card} style={{ cursor: 'pointer' }}>
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

        {filteredItems.length > 0 && (
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