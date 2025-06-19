"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const CeilingPage: React.FC = () => {
  return (
    <AdminPanel
      title="Առաստաղի կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել առաստաղի նյութեր"
      apiEndpoint="/api/ceiling"
    />
  );
};

export default CeilingPage; 