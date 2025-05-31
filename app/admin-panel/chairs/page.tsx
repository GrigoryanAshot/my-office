"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const ChairsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Աթոռների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել աթոռներ"
      apiEndpoint="/api/chairs"
    />
  );
};

export default ChairsPage; 