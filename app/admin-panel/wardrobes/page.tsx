"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const WardrobesPage: React.FC = () => {
  return (
    <AdminPanel
      title="Պահարանների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել Պահարաններ"
      apiEndpoint="/api/wardrobes"
    />
  );
};

export default WardrobesPage; 