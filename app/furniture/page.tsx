'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface Category {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  order: number;
}

export default function FurniturePage() {
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetch('/api/categories');
      const categories = await response.json() as Record<string, Category>;
      const furnitureSubCategories = Object.entries(categories)
        .filter(([key, cat]) => key.startsWith('furniture_') && key !== 'furniture')
        .map(([key, cat]) => cat)
        .sort((a, b) => a.order - b.order);
      setSubCategories(furnitureSubCategories);
    };
    loadCategories();
  }, []);

  return (
    <>
      <NavbarSection style="" logo="images/logo.png" />
      <div className={styles.categoryTitle}>Սեղաններ և աթոռներ</div>
      <section className={styles.mainContainer}>
        <div className={`${styles.furniturePageGrid} ${subCategories.length <= 2 ? styles.fewItems : ''}`} style={{ justifyContent: 'center' }}>
          {subCategories.map((category) => (
            <Link href={category.url} key={category.id} className={styles.card}>
              <img src={category.imageUrl} alt={category.name} className={styles.image} />
              <div className={styles.price}>{category.name}</div>
            </Link>
          ))}
        </div>
      </section>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 