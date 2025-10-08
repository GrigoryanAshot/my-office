"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const CushionsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Բարձերի կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել բարձեր"
      apiEndpoint="/api/cushions"
    />
  );
};

export default CushionsPage; 