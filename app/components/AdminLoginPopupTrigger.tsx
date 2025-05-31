"use client";
import { useState } from "react";
import AdminLoginPopup from "@/component/admin/AdminLoginPopup";

export default function AdminLoginPopupTrigger() {
  const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false);

  const handleAdminLogin = () => {
    window.location.href = '/admin-panel';
  };

  return (
    <>
      <button
        onClick={() => setIsAdminPopupOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        Admin Login
      </button>
      <AdminLoginPopup
        isOpen={isAdminPopupOpen}
        onClose={() => setIsAdminPopupOpen(false)}
        onLogin={handleAdminLogin}
      />
    </>
  );
} 