'use client';

import React from 'react';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

export default function TakhtPage() {
  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div style={{ marginTop: '100px', padding: '20px' }}>
        <h1>Թախտ</h1>
        {/* Add your takht content here */}
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 