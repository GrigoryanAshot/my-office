"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const PoufsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Պուֆիկների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել պուֆեր"
      apiEndpoint="/api/poufs"
    />
  );
};

export default PoufsPage; 