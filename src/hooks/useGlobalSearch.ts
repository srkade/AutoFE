// Simple Global Search Hook
import { useState, useEffect } from 'react';

export const useGlobalSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      // Escape to close search
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    const handleOpenSearch = () => {
      setIsSearchOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('openGlobalSearch', handleOpenSearch);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('openGlobalSearch', handleOpenSearch);
    };
  }, []);

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return {
    isSearchOpen,
    setIsSearchOpen,
    closeSearch
  };
};