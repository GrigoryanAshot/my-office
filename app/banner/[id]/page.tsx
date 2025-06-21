import React from 'react';
import Image from 'next/image';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import BannerDetailClient from './BannerDetailClient';

interface BannerItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  link: string;
}

export default async function BannerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <BannerDetailClient id={id} />;
} 