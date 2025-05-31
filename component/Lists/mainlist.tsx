'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../about/FurnitureGrid.module.css';

interface Category {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  order: number;
}

interface GroupedCategories {
  furniture: Category[];
  doors: Category[];
  windows: Category[];
  metal: Category[];
}

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

export const furnitureData = [
  {
    id: 1,
    name: "Սեղան 1",
    url: "/furniture/table/1",
    imageUrl: "/images/furniture/table1.jpg",
    price: "150000 դրամ",
    description: "Փայտյա սեղան",
    type: "սեղան",
    isAvailable: true
  },
  {
    id: 2,
    name: "Աթոռ 1",
    url: "/furniture/chair/1",
    imageUrl: "/images/furniture/chair1.jpg",
    price: "50000 դրամ",
    description: "Փայտյա աթոռ",
    type: "աթոռ",
    isAvailable: true
  }
];

const MainList = () => {
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategories>({
    furniture: [],
    doors: [],
    windows: [],
    metal: []
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        const categories = await response.json() as Record<string, Category>;

        // Group categories by type
        const grouped: GroupedCategories = {
          furniture: Object.entries(categories)
            .filter(([key]) => key.startsWith('furniture_'))
            .map(([key, category]) => ({
              id: key,
              name: category.name,
              url: category.url,
              imageUrl: category.imageUrl,
              order: category.order
            }))
            .sort((a, b) => a.order - b.order),
          doors: Object.entries(categories)
            .filter(([key]) => key.startsWith('doors_'))
            .map(([key, category]) => ({
              id: key,
              name: category.name,
              url: category.url,
              imageUrl: category.imageUrl,
              order: category.order
            }))
            .sort((a, b) => a.order - b.order),
          windows: Object.entries(categories)
            .filter(([key]) => key.startsWith('windows_'))
            .map(([key, category]) => ({
              id: key,
              name: category.name,
              url: category.url,
              imageUrl: category.imageUrl,
              order: category.order
            }))
            .sort((a, b) => a.order - b.order),
          metal: Object.entries(categories)
            .filter(([key]) => key.startsWith('metal_'))
            .map(([key, category]) => ({
              id: key,
              name: category.name,
              url: category.url,
              imageUrl: category.imageUrl,
              order: category.order
            }))
            .sort((a, b) => a.order - b.order)
        };

        setGroupedCategories(grouped);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();

    // Listen for category updates
    const handleCategoriesUpdate = (event: CustomEvent) => {
      const categories = event.detail.categories as Record<string, Category>;
      
      // Group categories by type
      const grouped: GroupedCategories = {
        furniture: Object.entries(categories)
          .filter(([key]) => key.startsWith('furniture_'))
          .map(([key, category]) => ({
            id: key,
            name: category.name,
            url: category.url,
            imageUrl: category.imageUrl,
            order: category.order
          }))
          .sort((a, b) => a.order - b.order),
        doors: Object.entries(categories)
          .filter(([key]) => key.startsWith('doors_'))
          .map(([key, category]) => ({
            id: key,
            name: category.name,
            url: category.url,
            imageUrl: category.imageUrl,
            order: category.order
          }))
          .sort((a, b) => a.order - b.order),
        windows: Object.entries(categories)
          .filter(([key]) => key.startsWith('windows_'))
          .map(([key, category]) => ({
            id: key,
            name: category.name,
            url: category.url,
            imageUrl: category.imageUrl,
            order: category.order
          }))
          .sort((a, b) => a.order - b.order),
        metal: Object.entries(categories)
          .filter(([key]) => key.startsWith('metal_'))
          .map(([key, category]) => ({
            id: key,
            name: category.name,
            url: category.url,
            imageUrl: category.imageUrl,
            order: category.order
          }))
          .sort((a, b) => a.order - b.order)
      };

      setGroupedCategories(grouped);
    };

    window.addEventListener('categoriesUpdated', handleCategoriesUpdate as EventListener);

    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate as EventListener);
    };
  }, []);

  return (
    <div className={styles.mainContainer}>
      {/* Main Categories Grid */}
      <div className={styles.mainCategoriesGrid}>
        {mainCategories.map((category) => (
          <div key={category.id} className={styles.card}>
            <img src={category.imageUrl} alt={category.name} className={styles.image} />
            <Link href={category.url}>
              <div className={styles.price}>{category.name}</div>
            </Link>
          </div>
        ))}
      </div>

      {/* Furniture Section */}
      <p className={styles.description1}>Սեղաններ և Աթոռներ</p>
      <div className={styles.grid}>
        {groupedCategories.furniture.map((item) => (
          <div key={item.id} className={styles.card}>
            <img src={item.imageUrl} alt={item.name} className={styles.image} />
            <Link href={item.url}>
              <div className={styles.price}>{item.name}</div>
            </Link>
          </div>
        ))}
      </div>

      {/* Soft Furniture Section */}
      <p className={styles.description1}>Փափուկ կահույք</p>
      <div className={styles.grid}>
        {groupedCategories.doors.map((item) => (
          <div key={item.id} className={styles.card}>
            <img src={item.imageUrl} alt={item.name} className={styles.image} />
            <Link href={item.url}>
              <div className={styles.price}>{item.name}</div>
            </Link>
          </div>
        ))}
      </div>

      {/* Cabinets Section */}
      <p className={styles.description1}>Պահարաններ և ավելին</p>
      <div className={styles.grid}>
        {groupedCategories.windows.map((item) => (
          <div key={item.id} className={styles.card}>
            <img src={item.imageUrl} alt={item.name} className={styles.image} />
            <Link href={item.url}>
              <div className={styles.price}>{item.name}</div>
            </Link>
          </div>
        ))}
      </div>

      {/* Other Section */}
      <p className={styles.description1}>Այլ</p>
      <div className={styles.grid}>
        {groupedCategories.metal.map((item) => (
          <div key={item.id} className={styles.card}>
            <img src={item.imageUrl} alt={item.name} className={styles.image} />
            <Link href={item.url}>
              <div className={styles.price}>{item.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainList;