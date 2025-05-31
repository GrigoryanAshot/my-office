'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './FurnitureGrid.module.css';

const FurnitureGrid = () => {
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFurniture = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to load furniture data');
        }
        const data = await response.json();
        
        // Filter and sort furniture items
        const furnitureItems = Object.entries(data)
          .filter(([key]) => key.startsWith('furniture_') || key === 'furniture')
          .map(([key, item]) => ({
            id: key,
            name: item.name,
            url: item.url,
            imageUrl: item.imageUrl,
            order: item.order
          }))
          .sort((a, b) => a.order - b.order);

        setFurniture(furnitureItems);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFurniture();

    // Listen for category updates
    const handleCategoriesUpdate = (event) => {
      const categories = event.detail.categories;
      const furnitureItems = Object.entries(categories)
        .filter(([key]) => key.startsWith('furniture_') || key === 'furniture')
        .map(([key, item]) => ({
          id: key,
          name: item.name,
          url: item.url,
          imageUrl: item.imageUrl,
          order: item.order
        }))
        .sort((a, b) => a.order - b.order);

      setFurniture(furnitureItems);
    };

    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);

    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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