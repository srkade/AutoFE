// Search Service for Global Search Feature
// Aggregates all searchable data across the project

export interface SearchItem {
  id: string;
  type: 'component' | 'dtc' | 'connector' | 'wire' | 'harness' | 'system' | 'supply';
  code: string;
  name: string;
  description?: string;
  category?: string;
  status?: string;
  voltage?: string;
  searchableText: string; // Combined text for searching
  metadata?: Record<string, any>;
}

export interface SearchFacet {
  type: string;
  count: number;
  active: boolean;
}

export interface SearchResults {
  items: SearchItem[];
  facets: SearchFacet[];
  total: number;
}

class SearchService {
  private searchIndex: SearchItem[] = [];
  private isInitialized = false;

  // Initialize search index with all project data
  async initializeSearchIndex(
    components: any[],
    dtcs: any[],
    connectors: any[],
    wires: any[],
    harnesses: any[],
    systems: any[],
    supplies: any[]
  ) {
    console.log('🔍 Initializing global search index...');
    
    this.searchIndex = [];
    
    // Add components
    components.forEach((comp: any) => {
      this.searchIndex.push({
        id: `comp-${comp.code}`,
        type: 'component',
        code: comp.code,
        name: comp.name,
        description: comp.description || comp.comment || '',
        category: 'Components',
        status: comp.status || 'Active',
        searchableText: `${comp.code} ${comp.name} ${comp.description || ''}`.toLowerCase(),
        metadata: {
          partNumber: comp.part_number,
          harness: comp.harness_name
        }
      });
    });

    // Add DTC codes
    dtcs.forEach((dtc: any) => {
      this.searchIndex.push({
        id: `dtc-${dtc.code}`,
        type: 'dtc',
        code: dtc.code,
        name: dtc.name,
        description: dtc.comment || '',
        category: 'Diagnostic Codes',
        status: 'Active',
        searchableText: `${dtc.code} ${dtc.name} ${dtc.comment || ''}`.toLowerCase(),
        metadata: {
          probableCauses: dtc.probable_causes || []
        }
      });
    });

    // Add connectors (from DTC_STEPS_DATA or API data)
    connectors.forEach((conn: any) => {
      this.searchIndex.push({
        id: `conn-${conn.code || conn.id}`,
        type: 'connector',
        code: conn.code || conn.id,
        name: conn.name || conn.label || 'Connector',
        description: conn.description || '',
        category: 'Connectors',
        status: 'Active',
        searchableText: `${conn.code || conn.id} ${conn.name || conn.label || ''} ${conn.description || ''}`.toLowerCase(),
        metadata: {
          gender: conn.gender,
          color: conn.color,
          type: conn.type
        }
      });
    });

    // Add wires
    wires.forEach((wire: any) => {
      this.searchIndex.push({
        id: `wire-${wire.code || wire.id}`,
        type: 'wire',
        code: wire.code || wire.id,
        name: wire.name || 'Wire',
        description: wire.description || '',
        category: 'Wires',
        status: 'Active',
        searchableText: `${wire.code || wire.id} ${wire.name || ''} ${wire.description || ''}`.toLowerCase(),
        metadata: {
          gauge: wire.gauge,
          color: wire.color
        }
      });
    });

    // Add harnesses
    harnesses.forEach((harness: any) => {
      this.searchIndex.push({
        id: `harness-${harness.code}`,
        type: 'harness',
        code: harness.code,
        name: harness.name,
        description: harness.description || '',
        category: 'Harnesses',
        status: 'Active',
        searchableText: `${harness.code} ${harness.name} ${harness.description || ''}`.toLowerCase(),
        metadata: {
          vehicle: harness.vehicle_model
        }
      });
    });

    // Add systems
    systems.forEach((system: any) => {
      this.searchIndex.push({
        id: `system-${system.code}`,
        type: 'system',
        code: system.code,
        name: system.name,
        description: system.description || system.comment || '',
        category: 'Systems',
        status: system.status || 'Active',
        searchableText: `${system.code} ${system.name} ${system.description || ''}`.toLowerCase(),
        metadata: {
          domain: system.system_domain
        }
      });
    });

    // Add voltage supplies
    supplies.forEach((supply: any) => {
      this.searchIndex.push({
        id: `supply-${supply.code}`,
        type: 'supply',
        code: supply.code,
        name: supply.name,
        description: supply.description || '',
        category: 'Voltage Supplies',
        status: 'Active',
        voltage: supply.voltage || 'N/A',
        searchableText: `${supply.code} ${supply.name} ${supply.description || ''} ${supply.voltage || ''}`.toLowerCase(),
        metadata: {
          voltage: supply.voltage,
          circuit: supply.circuit_id
        }
      });
    });

    this.isInitialized = true;
    console.log(`✅ Search index initialized with ${this.searchIndex.length} items`);
  }

  // Main search function with facet filtering
  search(query: string, activeFacets: string[] = []): SearchResults {
    if (!this.isInitialized) {
      console.warn('⚠️ Search index not initialized');
      return { items: [], facets: [], total: 0 };
    }

    const normalizedQuery = query.toLowerCase().trim();
    let results = [...this.searchIndex];

    // Apply text search if query exists
    if (normalizedQuery) {
      results = results.filter(item => 
        item.searchableText.includes(normalizedQuery)
      );
    }

    // Apply facet filters
    if (activeFacets.length > 0) {
      results = results.filter(item => 
        activeFacets.includes(item.type)
      );
    }

    // Generate facets
    const typeCounts: Record<string, number> = {};
    results.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });

    const facets: SearchFacet[] = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      active: activeFacets.includes(type)
    }));

    return {
      items: results,
      facets,
      total: results.length
    };
  }

  // Get all available facets
  getAvailableFacets(): SearchFacet[] {
    if (!this.isInitialized) return [];
    
    const typeCounts: Record<string, number> = {};
    this.searchIndex.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      active: false
    }));
  }

  // Get item by ID for detail view
  getItemById(id: string): SearchItem | null {
    return this.searchIndex.find(item => item.id === id) || null;
  }

  // Get search suggestions (for autocomplete)
  getSuggestions(query: string, limit: number = 5): SearchItem[] {
    if (!this.isInitialized || !query.trim()) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    return this.searchIndex
      .filter(item => item.searchableText.includes(normalizedQuery))
      .slice(0, limit);
  }
}

// Export singleton instance
export const searchService = new SearchService();

// Type guard functions
export const isComponentItem = (item: SearchItem): item is SearchItem & { type: 'component' } => 
  item.type === 'component';

export const isDtcItem = (item: SearchItem): item is SearchItem & { type: 'dtc' } => 
  item.type === 'dtc';

export const isConnectorItem = (item: SearchItem): item is SearchItem & { type: 'connector' } => 
  item.type === 'connector';

export const isWireItem = (item: SearchItem): item is SearchItem & { type: 'wire' } => 
  item.type === 'wire';

export const isHarnessItem = (item: SearchItem): item is SearchItem & { type: 'harness' } => 
  item.type === 'harness';

export const isSystemItem = (item: SearchItem): item is SearchItem & { type: 'system' } => 
  item.type === 'system';

export const isSupplyItem = (item: SearchItem): item is SearchItem & { type: 'supply' } => 
  item.type === 'supply';