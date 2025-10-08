"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const CandlesPage: React.FC = () => {
  return (
    <AdminPanel
      title="Մոմերի կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել մոմեր"
      apiEndpoint="/api/candles"
    />
  );
};

export default CandlesPage; 