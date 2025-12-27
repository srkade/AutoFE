import { SchematicData } from "../components/Schematic/SchematicTypes";

interface Connector {
  id: string;
  label: string;
}

interface Component {
  id: string;
  label: string;
  category: string;
  shape: string;
  connectors: Connector[];
}

interface Connection {
  color: string;
  from: {
    componentId: string;
    connectorId: string;
    cavity: string;
  };
  to: {
    componentId: string;
    connectorId: string;
    cavity: string;
  };
  label: string;
}

interface SchematicConfig {
  masterComponents: string[];
  components: Component[];
  connections: Connection[];
  name: string;
}


export function mergeSchematicConfigs(
  configs: SchematicConfig[],
  mode?: "COMPONENT" | "SUPPLY",
  activeTab?: string
): SchematicData {

  //  STEP 1: FILTER BY MODE (FIRST)
  const filteredConfigs = configs.map(config => {
    let filteredComponents = config.components;

    // Only filter if mode is provided
    if (mode !== undefined) {
      filteredComponents = config.components.filter(c =>
        mode === "COMPONENT"
          ? c.category !== "Supply"
          : c.category === "Supply"
      );
    }

    const validIds = new Set(filteredComponents.map(c => c.id));

    const filteredConnections = config.connections.filter(conn =>
      validIds.has(conn.from.componentId) &&
      validIds.has(conn.to.componentId)
    );

    return {
      ...config,
      components: filteredComponents,
      connections: filteredConnections
    };
  });

  //  STEP 2: MERGE COMPONENTS
  const allComponents = filteredConfigs.flatMap(c => c.components);
  const mergedMasterComponents = filteredConfigs.flatMap(c => c.masterComponents);

  // First, group components by ID to handle potential conflicts between supply and non-supply versions
  const componentsById = new Map<string, Component[]>();
  
  for (const component of allComponents) {
    const id = component.id;
    if (!componentsById.has(id)) {
      componentsById.set(id, []);
    }
    componentsById.get(id)!.push(component);
  }
  
  // For each component ID, if there are both supply and non-supply versions,
  // prioritize based on the active tab
  const componentMap = new Map<string, Component>();
  const getKey = (c: Component) => `${c.category}:${c.id}`;
  
  componentsById.forEach((components: Component[], id: string) => {
    let primaryComponent: Component;
    
    // Check if there are both supply and non-supply components with the same ID
    const supplyComponents = components.filter((c: Component) => c.category === "Supply");
    const nonSupplyComponents = components.filter((c: Component) => c.category !== "Supply");
    
    // Determine priority based on active tab
    // If in supply tab ("voltage"), prioritize supply components
    // If in component tab or other tabs, prioritize non-supply components
    const inSupplyTab = activeTab === "voltage";
    
    if (supplyComponents.length > 0 && nonSupplyComponents.length > 0) {
      // Both supply and non-supply versions exist - prioritize based on active tab
      if (inSupplyTab) {
        // In supply tab - use supply version
        primaryComponent = supplyComponents[0];
      } else {
        // In component tab or other - use non-supply version (first one)
        primaryComponent = nonSupplyComponents[0];
      }
      
      // Combine connectors from all versions
      const allConnectors = new Map<string, Connector>();
      
      // Add connectors from primary component first
      for (const connector of primaryComponent.connectors) {
        allConnectors.set(connector.id, connector);
      }
      
      // Add connectors from other versions if not already present
      const allOtherComponents = [...supplyComponents, ...nonSupplyComponents].filter(
        comp => comp.id !== primaryComponent.id || comp.category !== primaryComponent.category
      );
      
      for (const comp of allOtherComponents) {
        for (const connector of comp.connectors) {
          if (!allConnectors.has(connector.id)) {
            allConnectors.set(connector.id, connector);
          }
        }
      }
      
      primaryComponent.connectors = Array.from(allConnectors.values());
    } else if (supplyComponents.length > 0) {
      // Only supply version exists
      primaryComponent = supplyComponents[0];
      
      // Combine connectors from all supply versions of this component
      const allConnectors = new Map<string, Connector>();
      
      for (const comp of supplyComponents) {
        for (const connector of comp.connectors) {
          if (!allConnectors.has(connector.id)) {
            allConnectors.set(connector.id, connector);
          }
        }
      }
      
      primaryComponent.connectors = Array.from(allConnectors.values());
    } else {
      // Only non-supply versions exist
      primaryComponent = components[0];
      
      // Combine connectors from all versions of this component
      const allConnectors = new Map<string, Connector>();
      
      for (const comp of components) {
        for (const connector of comp.connectors) {
          if (!allConnectors.has(connector.id)) {
            allConnectors.set(connector.id, connector);
          }
        }
      }
      
      primaryComponent.connectors = Array.from(allConnectors.values());
    }
    
    // Use the category:ID key for storage to maintain compatibility with connections
    const key = getKey(primaryComponent);
    componentMap.set(key, primaryComponent);
  }); // end of forEach

  const mergedComponents = Array.from(componentMap.values());


  //  STEP 3: MERGE CONNECTIONS
  const connectionMap = new Map<string, Connection>();
  const allConnections = filteredConfigs.flatMap(c => c.connections);

  for (const conn of allConnections) {
    const key = `${conn.from.componentId}:${conn.from.connectorId}:${conn.from.cavity}-${conn.to.componentId}:${conn.to.connectorId}:${conn.to.cavity}`;

    if (!connectionMap.has(key)) {
      connectionMap.set(key, conn);
    }
  }

  const mergedConnections = Array.from(connectionMap.values());

  //  STEP 4: RETURN
  return {
    masterComponents: Array.from(new Set(mergedMasterComponents)),
    components: mergedComponents,
    connections: mergedConnections,
    name: configs.length > 1 ? "Merged Schematic" : configs[0].name
  };
}

