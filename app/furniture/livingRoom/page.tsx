'use client';

import { useState } from 'react';
import FooterSection from '@/component/footer/FooterSection';
import NavbarSection from '@/component/navbar/NavbarSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import FurnitureGrid from "@/component/about/furnitureMain"; 
import { furnitureData } from '@/component/Lists/furniture/livingRoom';
import FurnitureFilters from '@/component/furniture/FurnitureFilters';

export default function LivingRoomPage() {
  const [filteredFurniture, setFilteredFurniture] = useState(furnitureData);

  const handleFilterChange = (filters: { style: string; minPrice: number; maxPrice: number }) => {
    const filtered = furnitureData.filter((item) => {
      const price = parseFloat(item.price.replace('$', ''));
      const matchesStyle = !filters.style || item.description === filters.style;
      const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
      return matchesStyle && matchesPrice;
    });
    setFilteredFurniture(filtered);
  };

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <main style={{ 
        paddingTop: '90px',
        minHeight: '100vh',
        backgroundColor: '#fff'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <FurnitureFilters onFilterChange={handleFilterChange} />
          <FurnitureGrid furniture={filteredFurniture} />
        </div>
      </main>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
}
