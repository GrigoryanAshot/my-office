"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const SofasPage: React.FC = () => {
  return (
    <AdminPanel
      title="Բազմոցների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել բազմոցներ"
      apiEndpoint="/api/sofas"
    />
  );
};

export default SofasPage; 