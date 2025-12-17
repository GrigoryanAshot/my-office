'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../about/FurnitureGrid.module.css';

const mainCategories = [
  {
    id: 'furniture',
    name: 'Սեղաններ և աթոռներ',
    url: '/furniture',
    imageUrl: '/images/grid1.png',
    width: 600,
    height: 400,
  },
  {
    id: 'softfurniture',
    name: 'Փափուկ կահույք',
    url: '/softfurniture',
    imageUrl: '/images/grid2.png',
    width: 600,
    height: 400,
  },
  {
    id: 'windows',
    name: 'Պահարաններ և ավելին',
    url: '/windows',
    imageUrl: '/images/grid3.png',
    width: 600,
    height: 400,
  },
  {
    id: 'metal',
    name: 'Այլ',
    url: '/other',
    imageUrl: '/images/grid4.png',
    width: 600,
    height: 400,
  }
];

const MainCategoriesGrid = () => {
  return (
    <section className={styles.mainContainer}>
      <div className={`${styles.mainCategoriesGrid} ${mainCategories.length <= 2 ? styles.fewItems : ''}`}>
        {mainCategories.map((category) => (
          <Link href={category.url} key={category.id} className={styles.card}>
            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px' }}>
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={category.width}
                height={category.height}
                className={styles.image}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.price}>{category.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MainCategoriesGrid; 