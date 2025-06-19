"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const LampsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Լուսատուների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել լուսատուներ"
      apiEndpoint="/api/lamps"
    />
  );
};

export default LampsPage; 