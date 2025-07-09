'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../about/FurnitureGrid.module.css';

const mainCategories = [
  {
    id: 'furniture',
    name: 'Սեղաններ և աթոռներ',
    url: '/furniture',
    imageUrl: '/images/grid1.png'
  },
  {
    id: 'softfurniture',
    name: 'Փափուկ կահույք',
    url: '/softfurniture',
    imageUrl: '/images/grid2.png'
  },
  {
    id: 'windows',
    name: 'Պահարաններ և ավելին',
    url: '/windows',
    imageUrl: '/images/grid3.png'
  },
  {
    id: 'metal',
    name: 'Այլ',
    url: '/other',
    imageUrl: '/images/grid4.png'
  }
];

const MainCategoriesGrid = () => {
  return (
    <section className={styles.mainContainer}>
      <div className={`${styles.mainCategoriesGrid} ${mainCategories.length <= 2 ? styles.fewItems : ''}`}>
        {mainCategories.map((category) => (
          <Link href={category.url} key={category.id} className={styles.card}>
            <img src={category.imageUrl} alt={category.name} className={styles.image} />
            <div className={styles.price}>{category.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MainCategoriesGrid; 