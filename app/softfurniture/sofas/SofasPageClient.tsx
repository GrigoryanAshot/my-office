'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/optimized/OptimizedImage';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import { ProductData } from '@/lib/seo/productMetadata';

interface SofasPageClientProps {
  initialItems: ProductData[];
}

export default function SofasPageClient({ initialItems }: SofasPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('Բոլորը');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [items, setItems] = useState<ProductData[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  // Function to handle page change with scroll to top
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Refresh data if needed (optional - for real-time updates)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/sofas?t=${Date.now()}&r=${Math.random()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.items)) {
            setItems(data.items);
            if (data.items.length > 0) {
              const maxPrice = Math.max(...data.items.map((item: ProductData) => parseInt(item.price.replace(/[^0-9]/g, ''))));
              setPriceRange(prev => ({ ...prev, max: maxPrice }));
              setTempPriceRange(prev => ({ ...prev, max: maxPrice }));
            }
          }
        }
      } catch (error) {
        console.error('Error refreshing sofas:', error);
      }
    };

    // Optional: Refresh on mount to get latest data
    // fetchItems();
  }, []);

  // Get unique types from the data
  const types = useMemo(() => {
    const uniqueTypes = new Set(items.map(item => item.type));
    return ['Բոլորը', ...Array.from(uniqueTypes)];
  }, [items]);

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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, priceRange, showSaleOnly]);

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
        <h1 className={styles.description1}>Բազմոցներ</h1>
        
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
                  {type}
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
          {currentItems.map((item: ProductData) => (
            <Link key={item.id} href={`/softfurniture/sofas/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            Ապրանքներ չկան ընտրված ֆիլտրերով
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Նախորդ
            </button>
            <span>
              Էջ {currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
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

