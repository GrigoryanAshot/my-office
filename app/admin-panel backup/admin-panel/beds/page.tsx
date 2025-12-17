"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const BedsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Մահճակալների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել մահճակալներ"
      apiEndpoint="/api/beds"
    />
  );
};

export default BedsPage; 