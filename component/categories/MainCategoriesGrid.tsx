'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../about/FurnitureGrid.module.css';

const mainCategories = [
  {
    id: 'furniture',
    name: 'Սեղաններ և աթոռներ',
    url: '/furniture',
    imageUrl: 'https://i.postimg.cc/zfLnFdK2/gate.png'
  },
  {
    id: 'doors',
    name: 'Փափուկ կահույք',
    url: '/doors',
    imageUrl: 'https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg'
  },
  {
    id: 'windows',
    name: 'Պահարաններ և ավելին',
    url: '/windows',
    imageUrl: 'https://i.postimg.cc/FF7xrvmd/9b132849cf151713ae4672aac52a0a31.jpg'
  },
  {
    id: 'metal',
    name: 'Այլ',
    url: '/other',
    imageUrl: 'https://i.postimg.cc/zfLnFdK2/gate.png'
  }
];

const MainCategoriesGrid = () => {
  return (
    <section className={styles.mainContainer}>
      <div className={styles.mainCategoriesGrid}>
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