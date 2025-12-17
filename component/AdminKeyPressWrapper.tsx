'use client';

import { useAdminKeyPress } from '@/component/utils/useAdminKeyPress';
import AdminVerificationPopup from '@/component/AdminVerificationPopup';

export default function AdminKeyPressWrapper() {
  const { isVerificationPopupOpen, setIsVerificationPopupOpen } = useAdminKeyPress();

  return (
    <>
      <AdminVerificationPopup 
        isOpen={isVerificationPopupOpen} 
        onClose={() => setIsVerificationPopupOpen(false)} 
      />
    </>
  );
} 