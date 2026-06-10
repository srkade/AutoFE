// Persistent Search Bar Component (Icon Only)
import React from 'react';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.css';

const SearchBar: React.FC = () => {
  return (
    <button 
      className="search-icon-button"
      title="Search components, SPN/FMIs, connectors... (Ctrl+K)"
      onClick={() => {
        // Dispatch event to open global search
        const event = new CustomEvent('openGlobalSearch');
        window.dispatchEvent(event);
      }}
    >
      <FiSearch size={20} />
    </button>
  );
};

export default SearchBar;