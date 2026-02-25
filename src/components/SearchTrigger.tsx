// Global Search Trigger - Can be placed in navigation bars
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import GlobalSearch from './GlobalSearch';
import { SearchItem } from '../services/searchService';

interface SearchTriggerProps {
  className?: string;
  placeholder?: string;
  onItemSelected?: (item: SearchItem) => void;
}

const SearchTrigger: React.FC<SearchTriggerProps> = ({ 
  className = '',
  placeholder = 'Search...',
  onItemSelected 
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleItemSelected = (item: SearchItem) => {
    if (onItemSelected) {
      onItemSelected(item);
    }
    // You can add routing logic here based on item type
    console.log('Selected item:', item);
  };

  return (
    <>
      <div 
        className={`search-trigger ${className}`}
        onClick={() => setIsSearchOpen(true)}
      >
        <FiSearch className="search-trigger-icon" />
        <span className="search-trigger-text">{placeholder}</span>
        <span className="search-trigger-shortcut">Ctrl+K</span>
      </div>

      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onItemSelected={handleItemSelected}
      />
    </>
  );
};

export default SearchTrigger;