"use client";
import AdminEmailLoginPopup from "@/component/admin/AdminEmailLoginPopup";
import { useAdminLoginKeyPress } from "./utils/useAdminLoginKeyPress";

export default function GlobalAdminShortcut() {
  const { isAdminLoginPopupOpen, setIsAdminLoginPopupOpen } = useAdminLoginKeyPress();

  const handleAdminLogin = () => {
    setIsAdminLoginPopupOpen(false);
    window.location.href = '/admin-panel';
  };

  return (
    <>
      <AdminEmailLoginPopup
        isOpen={isAdminLoginPopupOpen}
        onClose={() => setIsAdminLoginPopupOpen(false)}
        onLogin={handleAdminLogin}
      />
    </>
  );
} 