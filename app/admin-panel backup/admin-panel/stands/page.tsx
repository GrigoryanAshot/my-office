"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const StandsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Տակդիրների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել Տակդիրներ"
      apiEndpoint="/api/stands"
    />
  );
};

export default StandsPage; 