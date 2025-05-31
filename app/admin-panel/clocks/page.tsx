"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const ClocksPage: React.FC = () => {
  return (
    <AdminPanel
      title="Ժամացույցների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել ժամացույցներ"
      apiEndpoint="/api/clocks"
    />
  );
};

export default ClocksPage; 