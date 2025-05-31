"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const MirrorsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Հայելիների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել հայելիներ"
      apiEndpoint="/api/mirrors"
    />
  );
};

export default MirrorsPage; 