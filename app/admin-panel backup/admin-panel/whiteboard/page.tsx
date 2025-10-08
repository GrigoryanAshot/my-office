"use client";
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const WhiteboardPage: React.FC = () => {
  return (
    <AdminPanel
      title="Գրատախտակների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել Գրատախտակներ"
      apiEndpoint="/api/whiteboard"
    />
  );
};

export default WhiteboardPage; 