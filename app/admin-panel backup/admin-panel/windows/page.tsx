"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const WindowsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Պատուհանների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել պատուհաններ"
      apiEndpoint="/api/windows"
    />
  );
};

export default WindowsPage; 