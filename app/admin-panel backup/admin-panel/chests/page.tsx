"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const ChestsPage: React.FC = () => {
  return (
    <AdminPanel
      title="Տումբաների և կոմոդների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել Տումբաներ և կոմոդներ"
      apiEndpoint="/api/chests"
    />
  );
};

export default ChestsPage; 