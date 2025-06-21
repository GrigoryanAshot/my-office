'use client';

import { useEffect, useState } from 'react';

export const useAdminLoginKeyPress = () => {
  const [isAdminLoginPopupOpen, setIsAdminLoginPopupOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl + Alt + L
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        setIsAdminLoginPopupOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return {
    isAdminLoginPopupOpen,
    setIsAdminLoginPopupOpen
  };
}; 