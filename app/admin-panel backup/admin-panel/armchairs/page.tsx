"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const ArmchairsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Բազկաթոռների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել բազկաթոռներ"
      apiEndpoint="/api/armchairs"
    />
  );
};

export default ArmchairsPage; 