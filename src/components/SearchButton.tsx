// Simple Search Button Component
import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
}

const SearchButton: React.FC<SearchButtonProps> = ({ 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`search-button ${className}`}
      title="Global Search (Ctrl+K)"
    >
      <FiSearch />
      <span className="search-text">Search</span>
      <span className="search-shortcut">Ctrl+K</span>
    </button>
  );
};

export default SearchButton;