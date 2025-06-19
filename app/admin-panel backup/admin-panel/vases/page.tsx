"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const VasesPage: React.FC = () => {
  return (
    <AdminPanel
      title="Ծաղկամանների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել ծաղկամաններ"
      apiEndpoint="/api/vases"
    />
  );
};

export default VasesPage; 