"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const TilesPage: React.FC = () => {
  return (
    <AdminPanel
      title="Պատշգամբների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել պատշգամբներ"
      apiEndpoint="/api/tiles"
    />
  );
};

export default TilesPage; 