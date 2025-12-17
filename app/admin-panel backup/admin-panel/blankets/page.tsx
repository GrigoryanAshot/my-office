"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const BlanketsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Վերմակների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել վերմակներ"
      apiEndpoint="/api/blankets"
    />
  );
};

export default BlanketsPage; 