'use client';

import React from 'react';
import Link from 'next/link';
import styles from './FurnitureGrid.module.css';

const FurnitureGrid = ({ furniture }) => {
  if (!furniture || furniture.length === 0) {
    return <div>No furniture items available</div>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div className={styles.grid}>
        {furniture.map((item) => (
          <div key={item.id} className={styles.card}>
            <Link href={`${item.url}`}>
              <img src={item.imageUrl} alt={item.name} className={styles.image} />
              <div className={styles.content}>
                <h3>{item.name}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FurnitureGrid;