// Demo Integration Component
// Shows how to integrate global search into your application

import React from 'react';
import GlobalSearch from './GlobalSearch';
import SearchButton from './SearchButton';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
import { SearchItem } from '../services/searchService';

// This is a demo component showing integration
const SearchDemo: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useGlobalSearch();

  const handleItemSelected = (item: SearchItem) => {
    console.log('Selected item:', item);
    
    // Example navigation logic based on item type
    switch (item.type) {
      case 'component':
        console.log(`Navigate to component: ${item.code}`);
        // Implement your navigation logic here
        break;
      case 'dtc':
        console.log(`Navigate to DTC: ${item.code}`);
        // Implement your navigation logic here
        break;
      case 'connector':
        console.log(`Navigate to connector: ${item.code}`);
        // Implement your navigation logic here
        break;
      case 'wire':
        console.log(`Navigate to wire: ${item.code}`);
        // Implement your navigation logic here
        break;
      case 'harness':
        console.log(`Navigate to harness: ${item.code}`);
        // Implement your navigation logic here
        break;
      case 'system':
        console.log(`Navigate to system: ${item.code}`);
        // Implement your navigation logic here
        break;
      case 'supply':
        console.log(`Navigate to supply: ${item.code}`);
        // Implement your navigation logic here
        break;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Global Search Demo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Press <kbd>Ctrl+K</kbd> or click the button below to open global search:</p>
        <SearchButton 
          onClick={() => setIsSearchOpen(true)}
          className="compact"
        />
      </div>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>🔍 Real-time search across all project entities</li>
          <li>🎯 Facet filtering by type (Components, DTC, Connectors, etc.)</li>
          <li>⌨️ Keyboard navigation (Ctrl+K, Arrow keys, Enter, Escape)</li>
          <li>📱 Responsive design for all screen sizes</li>
          <li>⚡ Fast search with debouncing</li>
        </ul>
      </div>

      <div style={{ 
        background: '#e3f2fd', 
        padding: '15px', 
        borderRadius: '8px'
      }}>
        <h3>Integration Steps:</h3>
        <ol>
          <li>Initialize search service with your data in App.tsx</li>
          <li>Add SearchButton to your navigation bar</li>
          <li>Include GlobalSearch component in your main layout</li>
          <li>Implement navigation logic in onItemSelected handler</li>
        </ol>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onItemSelected={handleItemSelected}
      />
    </div>
  );
};

export default SearchDemo;