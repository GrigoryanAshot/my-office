'use client';

import { useEffect, useState } from 'react';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import SubCategoryGrid from '@/component/about/SubCategoryGrid';

export default function SubCategoryPage({ params }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetch(`/api/categories/${params.category}/${params.subcategory}`);
        if (!response.ok) {
          throw new Error('Failed to load items');
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [params.category, params.subcategory]);

  if (loading) {
    return (
      <>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className="loading">Loading...</div>
        <FooterSection />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarSection style="" logo="/images/logo.png" />
        <div className="error">Error: {error}</div>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <main style={{ 
        paddingTop: '90px',
        minHeight: '100vh',
        backgroundColor: '#fff'
      }}>
        <SubCategoryGrid 
          items={items} 
          categoryName={params.subcategory} 
        />
      </main>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 