"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const DoorsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Դռների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել դռներ"
      apiEndpoint="/api/doors"
    />
  );
};

export default DoorsPage; 