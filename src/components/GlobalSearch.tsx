// Global Search Component with Facet Filtering
import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { searchService, SearchItem, SearchFacet } from '../services/searchService';
import '../Styles/GlobalSearch.css';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onItemSelected?: (item: SearchItem) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  isOpen, 
  onClose, 
  onItemSelected 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [facets, setFacets] = useState<SearchFacet[]>([]);
  const [activeFacets, setActiveFacets] = useState<string[]>([]);
  const [showFacets, setShowFacets] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Perform search when query or facets change
  useEffect(() => {
    if (!isOpen) return;

    const performSearch = async () => {
      setIsLoading(true);
      
      // Debounce search
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const searchResults = searchService.search(query, activeFacets);
      setResults(searchResults.items);
      setFacets(searchResults.facets);
      setSelectedIndex(-1);
      
      setIsLoading(false);
    };

    performSearch();
  }, [query, activeFacets, isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleItemSelect(results[selectedIndex]);
        }
        break;
    }
  };

  const handleItemSelect = (item: SearchItem) => {
    if (onItemSelected) {
      onItemSelected(item);
    }
    onClose();
  };

  const toggleFacet = (facetType: string) => {
    setActiveFacets(prev => 
      prev.includes(facetType)
        ? prev.filter(f => f !== facetType)
        : [...prev, facetType]
    );
  };

  const clearAllFacets = () => {
    setActiveFacets([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'component': return '⚙️';
      case 'dtc': return '⚠️';
      case 'connector': return '🔌';
      case 'wire': return '🔗';
      case 'harness': return '📦';
      case 'system': return '🔧';
      case 'supply': return '⚡';
      case 'user': return '👤';
      case 'navigation': return '🚀';
      default: return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'component': return '#007bff';
      case 'dtc': return '#dc3545';
      case 'connector': return '#28a745';
      case 'wire': return '#ffc107';
      case 'harness': return '#6f42c1';
      case 'system': return '#17a2b8';
      case 'supply': return '#fd7e14';
      case 'user': return '#e83e8c';
      case 'navigation': return '#20c997';
      default: return '#6c757d';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="global-search-overlay" onKeyDown={handleKeyDown}>
      <div className="global-search-modal">
        {/* Header */}
        <div className="global-search-header">
          <div className="search-input-container">
            <FiSearch className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search components, DTC codes, connectors, wires, systems..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="global-search-input"
            />
            {query && (
              <button 
                className="clear-search-btn"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
          
          <button 
            className="close-search-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            <FiX />
          </button>
        </div>

        {/* Facets Panel */}
        <div className="facets-panel">
          <div 
            className="facets-toggle"
            onClick={() => setShowFacets(!showFacets)}
          >
            <FiFilter />
            <span>Filters</span>
            <span className="facet-count">
              {activeFacets.length > 0 ? `(${activeFacets.length})` : ''}
            </span>
            {showFacets ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          
          {showFacets && (
            <div className="facets-content">
              <div className="active-filters">
                {activeFacets.length > 0 && (
                  <button 
                    className="clear-filters-btn"
                    onClick={clearAllFacets}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
              
              <div className="facet-list">
                {facets.map(facet => (
                  <div 
                    key={facet.type}
                    className={`facet-item ${facet.active ? 'active' : ''}`}
                    onClick={() => toggleFacet(facet.type)}
                  >
                    <div className="facet-checkbox">
                      {facet.active && <div className="checkmark">✓</div>}
                    </div>
                    <span className="facet-label">
                      {getTypeIcon(facet.type)} {facet.type.charAt(0).toUpperCase() + facet.type.slice(1)}
                    </span>
                    <span className="facet-count">{facet.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="global-search-results" ref={resultsRef}>
          {isLoading ? (
            <div className="search-loading">
              <div className="spinner"></div>
              <p>Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="no-results">
              <FiSearch size={48} />
              <h3>No results found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <p>{results.length} result{results.length !== 1 ? 's' : ''} found</p>
              </div>
              
              <div className="results-list">
                {results.map((item, index) => (
                  <div
                    key={item.id}
                    className={`result-item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={() => handleItemSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="result-icon" style={{ color: getTypeColor(item.type) }}>
                      {getTypeIcon(item.type)}
                    </div>
                    
                    <div className="result-content">
                      <div className="result-title">
                        <span className="result-code">{item.code}</span>
                        <span className="result-name">{item.name}</span>
                      </div>
                      
                      {item.description && (
                        <div className="result-description">
                          {item.description}
                        </div>
                      )}
                      
                      <div className="result-meta">
                        <span 
                          className="result-type"
                          style={{ 
                            backgroundColor: getTypeColor(item.type) + '20',
                            color: getTypeColor(item.type)
                          }}
                        >
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                        
                        {item.voltage && (
                          <span className="result-voltage">{item.voltage}</span>
                        )}
                        
                        {item.status && (
                          <span className={`result-status ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;