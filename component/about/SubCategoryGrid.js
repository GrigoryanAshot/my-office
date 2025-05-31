'use client';

import styles from './FurnitureGrid.module.css';
import Link from 'next/link';
import { useState } from 'react';

export default function SubCategoryGrid({ items, categoryName }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const itemsPerRow = 5;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  return (
    <div className={styles.mainContainer}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        {/* Display category title */}
        <p className={styles.description1}>
          {categoryName}
        </p>

        <div className={styles.itemsGrid}>
          {items.length > 0 ? (
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
                <div className={styles.itemDetails}>
                  <h3 className={styles.price}>{item.name}</h3>
                  <p className={styles.itemCode}>Կոդ: {item.code || 'N/A'}</p>
                  <p className={styles.itemPrice}>Արժեք: {item.price || 'N/A'}</p>
                  <p className={styles.itemAvailability}>
                    {item.available ? 'Առկա է' : 'Առկա չէ'}
                  </p>
                </div>
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
            <span className={styles.pageInfo}>
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