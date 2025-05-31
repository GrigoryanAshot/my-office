'use client';

import { useEffect, useState } from 'react';

export const useAdminKeyPress = () => {
  const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check for Ctrl + Alt + A
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') {
        event.preventDefault(); // Prevent default browser behavior
        setIsAdminPopupOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return {
    isAdminPopupOpen,
    setIsAdminPopupOpen
  };
}; 