"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const PaintingsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Նկարների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել նկարներ"
      apiEndpoint="/api/paintings"
    />
  );
};

export default PaintingsPage; 