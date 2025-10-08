'use client';

import styles from './FurnitureGrid.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FurnitureGrid({ furniture }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(furniture.length / itemsPerPage);
  
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return furniture.slice(startIndex, endIndex);
  };

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.backgroundColor = '#ffffff';
        } else {
          navbar.style.backgroundColor = 'transparent';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Display section title */}
        <p className={styles.description1}>
          {furniture.length > 0 ? furniture[0].headName : 'Սեղաններ'}
        </p>

        <div className={styles.grid}>
          {furniture.length > 0 ? (
            getCurrentItems().map((item) => (
              <div key={item.id} className={styles.card}>
                <Link href={item.url}>
                  <img 
                    src={item.imageUrl || '/images/placeholder.jpg'} 
                    alt={item.name} 
                    className={styles.image}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </Link>
                <h3 className={styles.itemPrice}>{item.name}</h3>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>Ոչ մի ապրանք չի գտնվել</p>
            </div>
          )}
        </div>

        {/* Pagination */}
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
    </div>
  );
}