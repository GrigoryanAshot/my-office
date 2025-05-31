"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const RugsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Կարպետների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել կարպետներ"
      apiEndpoint="/api/rugs"
    />
  );
};

export default RugsPage; 