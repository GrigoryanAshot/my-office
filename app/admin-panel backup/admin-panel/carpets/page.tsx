"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const CarpetsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Գորգերի կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել գորգեր"
      apiEndpoint="/api/carpets"
    />
  );
};

export default CarpetsPage; 