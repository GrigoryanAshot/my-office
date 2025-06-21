"use client";
import { useState } from "react";
import AdminEmailLoginPopup from "@/component/admin/AdminEmailLoginPopup";

export default function GlobalAdminShortcut() {
  const [showPopup, setShowPopup] = useState(false);

  const handleAdminLogin = () => {
    setShowPopup(false);
    window.location.href = '/admin-panel';
  };

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        Admin Login
      </button>
      <AdminEmailLoginPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onLogin={handleAdminLogin}
      />
    </>
  );
} 