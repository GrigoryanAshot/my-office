"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const PodiumPage: React.FC = () => {
  return (
    <AdminPanel
      title="Ամբիոնների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել Ամբիոններ"
      apiEndpoint="/api/podium"
    />
  );
};

export default PodiumPage; 