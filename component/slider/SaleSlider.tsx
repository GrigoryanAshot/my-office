"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface SaleSliderItem {
  id: number;
  imageUrl: string;
}

export default function SaleSlider() {
  const [items, setItems] = useState<SaleSliderItem[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/sale-slider');
        const data = await response.json();
        setItems(data.items || []);
      } catch (e) {
        setItems([]);
      }
    };
    fetchItems();
  }, []);

  if (items.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  return (
    <div style={{ position: 'relative', width: 480, height: 340, margin: '0 auto', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <button onClick={prev} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 24, cursor: 'pointer' }}>&lt;</button>
      <Link href={`/sale/${items[current].id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
        <img src={items[current].imageUrl} alt="Sale" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
      </Link>
      <button onClick={next} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 24, cursor: 'pointer' }}>&gt;</button>
    </div>
  );
} 