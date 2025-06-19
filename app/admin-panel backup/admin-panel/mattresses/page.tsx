"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const MattressesPage: React.FC = () => {
  return (
    <AdminPanel
      title="Ներքնակների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել ներքնակներ"
      apiEndpoint="/api/mattresses"
    />
  );
};

export default MattressesPage; 