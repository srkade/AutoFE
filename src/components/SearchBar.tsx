// Persistent Search Bar Component
import React from 'react';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.css';

const SearchBar: React.FC = () => {
  return (
    <div 
      className="persistent-search-bar"
      title="Search components, DTC codes, connectors... (Ctrl+K)"
      onClick={() => {
        // Dispatch event to open global search
        const event = new CustomEvent('openGlobalSearch');
        window.dispatchEvent(event);
      }}
    >
      <FiSearch style={{ color: "#6c757d", flexShrink: 0 }} />
      <span className="search-bar-text">
        Search components, DTC codes, connectors...
      </span>
      <span className="search-bar-shortcut">
        Ctrl+K
      </span>
    </div>
  );
};

export default SearchBar;