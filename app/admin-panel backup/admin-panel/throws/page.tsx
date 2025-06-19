"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const ThrowsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Վերմակների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել վերմակներ"
      apiEndpoint="/api/throws"
    />
  );
};

export default ThrowsPage; 