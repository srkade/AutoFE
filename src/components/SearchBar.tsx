// Persistent Search Bar Component
import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar: React.FC = () => {
  return (
    <div 
      className="persistent-search-bar"
      onClick={() => {
        // Dispatch event to open global search
        const event = new CustomEvent('openGlobalSearch');
        window.dispatchEvent(event);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        background: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "6px",
        cursor: "text",
        transition: "all 0.2s ease",
        width: "100%",
        maxWidth: "400px",
        minWidth: "200px"
      }}
    >
      <FiSearch style={{ color: "#6c757d" }} />
      <span style={{ 
        color: "#6c757d", 
        fontSize: "14px",
        flex: "1"
      }}>
        Search components, DTC codes, connectors...
      </span>
      <span style={{
        background: "#e9ecef",
        color: "#6c757d",
        padding: "2px 6px",
        borderRadius: "4px",
        fontSize: "11px",
        fontFamily: "monospace"
      }}>
        Ctrl+K
      </span>
    </div>
  );
};

export default SearchBar;