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

export default function DoorsPage() {
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetch('/api/categories');
      const categories = await response.json() as Record<string, Category>;
      const doorsSubCategories = Object.entries(categories)
        .filter(([key, cat]) => key.startsWith('doors_') && key !== 'doors')
        .map(([key, cat]) => cat)
        .sort((a, b) => a.order - b.order);
      setSubCategories(doorsSubCategories);
    };
    loadCategories();
  }, []);

  return (
    <>
      <NavbarSection style="" logo="images/logo.png" />
      <div className={styles.categoryTitle}>Փափուկ կահույք</div>
      <section className={styles.mainContainer}>
        <div className={styles.mainCategoriesGrid} style={{ justifyContent: 'center' }}>
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