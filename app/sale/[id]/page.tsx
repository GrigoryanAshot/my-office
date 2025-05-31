"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface SaleSliderItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  link: string;
}

export default function SaleDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<SaleSliderItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/sale-slider');
        const data = await response.json();
        const found = (data.items || []).find((i: SaleSliderItem) => String(i.id) === String(params?.id));
        setItem(found || null);
      } catch (e) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [params?.id]);

  if (loading) return <div>Բեռնվում է...</div>;
  if (!item) return <div>Ակցիայի ապրանքը չի գտնվել</div>;

  return (
    <div>
      <NavbarSection style="" logo="/images/logo.png" />
      <div style={{ maxWidth: 600, margin: '120px auto 40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', borderRadius: 8, marginBottom: 24 }} />
        <h1 style={{ marginBottom: 16 }}>{item.title}</h1>
        <div style={{ color: '#666', marginBottom: 16 }}>{item.description}</div>
        <div style={{ color: '#2196F3', fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>{item.price}</div>
        {item.link && (
          <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#ff914d', textDecoration: 'underline', fontWeight: 'bold' }}>Ավելին</a>
        )}
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </div>
  );
} 