"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const WallDecorPage: React.FC = () => {
  return (
    <AdminPanel
      title="Պատի դեկորների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել պատի դեկորներ"
      apiEndpoint="/api/wall-decor"
    />
  );
};

export default WallDecorPage; 