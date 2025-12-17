'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import NavbarSection from '@/component/navbar/NavigationSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import SubCategoryGrid from '@/component/about/SubCategoryGrid';

export default function SubCategoryPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      if (!params?.category) {
        setError('Category parameter is missing');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/categories/furniture/${params.category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItems(data.items);
        setCategoryName(data.categoryName);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [params?.category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <NavbarSection position="ms-auto" btnPosition={false} />
      <div className="pt-20 pb-10">
        <SubCategoryGrid items={items} categoryName={categoryName} />
      </div>
      <FooterSection />
      <ScrollToTopButton style="tf__scroll_btn" />
    </main>
  );
} 