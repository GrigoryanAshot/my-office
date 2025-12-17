import { useEffect } from 'react';

export function useKeyPress(key: string, callback: () => void) {
  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === key) {
        callback();
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [key, callback]);
} 