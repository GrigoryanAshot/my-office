'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/optimized/OptimizedImage';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { ProductData } from '@/lib/seo/productMetadata';

interface TablesPageClientProps {
  initialItems: ProductData[];
}

export default function TablesPageClient({ initialItems }: TablesPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial values from URL immediately
  const initialPage = searchParams?.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
  const initialType = searchParams?.get('type') || 'Բոլորը';
  const initialMinPrice = searchParams?.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : 0;
  const initialMaxPrice = searchParams?.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : 1000000;
  const initialShowSale = searchParams?.get('sale') === 'true';
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: initialMinPrice, max: initialMaxPrice });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: initialMinPrice, max: initialMaxPrice });
  const [showSaleOnly, setShowSaleOnly] = useState(initialShowSale);
  const [items, setItems] = useState<ProductData[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  // Use scroll restoration hook
  const { saveScrollPosition, clearScrollRestoration } = useScrollRestoration({
    items,
    storageKey: 'tables',
  });

  // Sync with URL parameter changes
  useEffect(() => {
    const pageParam = searchParams?.get('page');
    const newPage = pageParam ? parseInt(pageParam, 10) : 1;
    if (newPage > 0 && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [searchParams, currentPage]);

  // Helper function to build URL with all current filter parameters
  const buildFilterUrl = (page: number, type: string, minPrice: number, maxPrice: number, saleOnly: boolean) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (type !== 'Բոլորը') params.set('type', type);
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice < 1000000) params.set('maxPrice', maxPrice.toString());
    if (saleOnly) params.set('sale', 'true');
    return params.toString() ? `?${params.toString()}` : '';
  };

  // Update URL with current filters
  const updateUrlWithFilters = (page: number, type: string, minPrice: number, maxPrice: number, saleOnly: boolean) => {
    const url = `/furniture/tables${buildFilterUrl(page, type, minPrice, maxPrice, saleOnly)}`;
    router.replace(url, { scroll: false });
  };

  // Handle type change
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    updateUrlWithFilters(1, newType, priceRange.min, priceRange.max, showSaleOnly);
    clearScrollRestoration();
  };

  // Handle sale toggle
  const handleSaleToggle = () => {
    const newShowSale = !showSaleOnly;
    setShowSaleOnly(newShowSale);
    updateUrlWithFilters(1, selectedType, priceRange.min, priceRange.max, newShowSale);
    clearScrollRestoration();
  };

  // Function to handle page change with scroll to top
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const url = `/furniture/tables${buildFilterUrl(newPage, selectedType, priceRange.min, priceRange.max, showSaleOnly)}`;
    router.replace(url, { scroll: false });
    clearScrollRestoration();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Calculate max price from initial items
  useEffect(() => {
    if (initialItems.length > 0) {
      const maxPrice = Math.max(...initialItems.map((item) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return isNaN(price) ? 0 : price;
      }));
      if (maxPrice > 0 && maxPrice !== 1000000) {
        setPriceRange(prev => ({ ...prev, max: maxPrice }));
        setTempPriceRange(prev => ({ ...prev, max: maxPrice }));
      }
    }
  }, [initialItems]);

  // Get unique types from the data
  const types = useMemo(() => {
    const uniqueTypes = new Set(items.map(item => item.type || ''));
    return ['Բոլորը', ...Array.from(uniqueTypes).filter(Boolean)];
  }, [items]);

  // Filter items based on selected type, price range, and sale filter
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const typeMatch = selectedType === 'Բոլորը' || item.type === selectedType;
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      const priceMatch = !isNaN(price) && price >= priceRange.min && price <= priceRange.max;
      const saleMatch = !showSaleOnly || (item.oldPrice && item.oldPrice.trim());
      return typeMatch && priceMatch && saleMatch;
    });
  }, [items, selectedType, priceRange, showSaleOnly]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isInitialPriceSetup, setIsInitialPriceSetup] = useState(true);
  
  useEffect(() => {
    if (items.length > 0 && isInitialPriceSetup) {
      setIsInitialPriceSetup(false);
    }
  }, [items, isInitialPriceSetup]);
  
  useEffect(() => {
    if (hasInitialized && !isInitialPriceSetup) {
      setCurrentPage(1);
    }
  }, [selectedType, priceRange.min, showSaleOnly, hasInitialized, isInitialPriceSetup]);
  
  useEffect(() => {
    if (searchParams) {
      setHasInitialized(true);
    }
  }, [searchParams]);

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
    updateUrlWithFilters(1, selectedType, tempPriceRange.min, tempPriceRange.max, showSaleOnly);
    clearScrollRestoration();
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
            onClick={handleSaleToggle}
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
              onChange={(e) => handleTypeChange(e.target.value)}
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
          {currentItems.map((item) => {
            const filterParams = buildFilterUrl(currentPage, selectedType, priceRange.min, priceRange.max, showSaleOnly);
            
            return (
            <Link 
              key={item.id} 
              href={`/furniture/tables/${item.id}${filterParams}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={saveScrollPosition}
            >
              <div className={styles.card} style={{ cursor: 'pointer' }}>
                <div className={styles.imageContainer}>
                  <OptimizedImage
                    src={item.imageUrl}
                    alt={item.name}
                    width={400}
                    height={300}
                    className={styles.image}
                    priority={currentPage === 1 && currentItems.indexOf(item) < 4}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.cardContent} style={{ textAlign: 'center' }}>
                  <h2 className={styles.cardTitle}>{item.name}</h2>
                  <div className={styles.cardDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Տեսակ:</span>
                      <span className={styles.detailValue}>{item.type || 'N/A'}</span>
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

