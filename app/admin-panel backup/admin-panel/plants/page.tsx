"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const PlantsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Բույսերի կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել բույսեր"
      apiEndpoint="/api/plants"
    />
  );
};

export default PlantsPage; 