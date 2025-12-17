"use client";

import { useEffect } from 'react';

interface UseScrollRestorationProps {
  items: any[];
  storageKey: string; // Unique key for each page (e.g., 'tables', 'chairs', etc.)
}

/**
 * Custom hook to handle scroll position restoration when navigating back from item detail pages
 * 
 * @param items - The list of items currently displayed (used to trigger restoration after items load)
 * @param storageKey - Unique identifier for the page (e.g., 'tables', 'sofas', 'chairs')
 */
export function useScrollRestoration({ items, storageKey }: UseScrollRestorationProps) {
  
  // Restore scroll position when coming back from item detail page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldRestore = sessionStorage.getItem(`${storageKey}_restore_scroll`);
      const scrollPosition = sessionStorage.getItem(`${storageKey}_scroll_position`);
      
      if (shouldRestore === 'true' && scrollPosition && items.length > 0) {
        console.log(`🔍 RESTORING SCROLL POSITION for ${storageKey}:`, scrollPosition);
        // Wait for images to load before restoring scroll
        setTimeout(() => {
          window.scrollTo({ top: parseInt(scrollPosition, 10), behavior: 'instant' });
          // Clear the flags after restoring
          sessionStorage.removeItem(`${storageKey}_scroll_position`);
          sessionStorage.removeItem(`${storageKey}_restore_scroll`);
        }, 100);
      }
    }
  }, [items, storageKey]);

  // Function to save scroll position when navigating to an item
  const saveScrollPosition = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`${storageKey}_scroll_position`, window.scrollY.toString());
      sessionStorage.setItem(`${storageKey}_restore_scroll`, 'true');
      console.log(`🔍 SAVING SCROLL POSITION for ${storageKey}:`, window.scrollY);
    }
  };

  // Function to clear scroll restoration (call when pagination or filters change)
  const clearScrollRestoration = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`${storageKey}_scroll_position`);
      sessionStorage.removeItem(`${storageKey}_restore_scroll`);
    }
  };

  return {
    saveScrollPosition,
    clearScrollRestoration,
  };
}

