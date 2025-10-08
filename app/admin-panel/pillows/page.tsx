"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const PillowsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Բարձերի կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել բարձեր"
      apiEndpoint="/api/pillows"
    />
  );
};

export default PillowsPage; 