"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const FlooringPage: React.FC = () => {
  return (
    <AdminPanel
      title="Հատակի կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել հատակի նյութեր"
      apiEndpoint="/api/flooring"
    />
  );
};

export default FlooringPage; 