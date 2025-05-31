"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const CurtainsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Վարագույրների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել վարագույրներ"
      apiEndpoint="/api/curtains"
    />
  );
};

export default CurtainsPage; 