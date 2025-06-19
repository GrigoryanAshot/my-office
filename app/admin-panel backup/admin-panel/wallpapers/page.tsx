"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const WallpapersPage: React.FC = () => {
  return (
    <AdminPanel
      title="Պաստառների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել պաստառներ"
      apiEndpoint="/api/wallpapers"
    />
  );
};

export default WallpapersPage; 