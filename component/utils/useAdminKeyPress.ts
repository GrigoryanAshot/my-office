'use client';

import { useEffect, useState } from 'react';
import AdminVerificationPopup from '@/component/AdminVerificationPopup';

export const useAdminKeyPress = () => {
  const [isVerificationPopupOpen, setIsVerificationPopupOpen] = useState(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if the clicked element or its parent contains the target text
      const hasTargetText = (element: HTMLElement): boolean => {
        if (element.textContent?.toLowerCase().includes('պատվիրել զանգ')) {
          return true;
        }
        if (element.parentElement) {
          return hasTargetText(element.parentElement);
        }
        return false;
      };

      // Support Ctrl+Alt (Windows/Linux) or Meta+Alt (Mac) + click
      if ((
            (event.ctrlKey && event.altKey) || // Windows/Linux
            (event.metaKey && event.altKey)    // Mac (Cmd+Option)
          ) && hasTargetText(target)) {
        event.preventDefault();
        console.log('Admin shortcut triggered - opening verification popup');
        setIsVerificationPopupOpen(true);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return {
    isVerificationPopupOpen,
    setIsVerificationPopupOpen
  };
}; 