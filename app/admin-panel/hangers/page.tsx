"use client";
import React from "react";
import AdminPanel from "@/components/admin/AdminPanel";

export default function HangersAdminPage() {
  return (
    <AdminPanel
      title="Կախիչների կառավարում"
      description="Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել կախիչներ"
      apiEndpoint="/api/hangers"
    />
  );
} 