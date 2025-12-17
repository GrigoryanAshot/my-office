"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const TakhtPage: React.FC = () => {
  return (
    <AdminPanel
      title="Թախտերի կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել թախտեր"
      apiEndpoint="/api/takht"
    />
  );
};

export default TakhtPage; 