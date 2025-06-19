"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const ShelvingPage: React.FC = () => {
  return (
    <AdminPanel
      title="Դարակաշարերի կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել դարակաշարեր"
      apiEndpoint="/api/shelving"
    />
  );
};

export default ShelvingPage; 