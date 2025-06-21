'use client';

import { useEffect, useState } from 'react';

export const useAdminLoginKeyPress = () => {
  const [isAdminLoginPopupOpen, setIsAdminLoginPopupOpen] = useState(false);

  useEffect(() => {
    console.log('Admin login shortcut hook INITIALIZED.');

    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(`Key pressed: ${event.key}, Ctrl: ${event.ctrlKey}, Alt: ${event.altKey}`);

      // Check for Ctrl + Alt + L
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'l') {
        console.log('Admin login shortcut DETECTED.');
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