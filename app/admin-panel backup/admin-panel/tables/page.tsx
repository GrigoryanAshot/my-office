"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';
import { furnitureData } from '@/component/Lists/other/whiteboard';

const TablesPage: React.FC = () => {
  return (
    <AdminPanel
      title="Սեղանների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել սեղաններ"
      apiEndpoint="/api/tables2"
    />
  );
};

export default TablesPage; 