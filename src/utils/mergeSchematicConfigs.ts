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


export function mergeSchematicConfigs(...configs: SchematicConfig[]): SchematicData {
  const mergedComponents: Component[] = [];
  const mergedConnections: Connection[] = [];

  // --- Merge Components ---
  const componentMap = new Map<string, Component>();
  const allComponents = configs.flatMap(config => config.components);
  const mergedMasterComponents = configs.flatMap(config => config.masterComponents);

  for (const component of allComponents) {
    if (componentMap.has(component.id)) {
      // Component already exists, merge connectors
      const existingComponent = componentMap.get(component.id)!;
      const existingConnectorIds = new Set(existingComponent.connectors.map(c => c.id));
      const newConnectors = component.connectors.filter(c => !existingConnectorIds.has(c.id));
      existingComponent.connectors.push(...newConnectors);

      // Optional: handle category mismatch
      if (existingComponent.category !== component.category) {
        console.warn(`Category mismatch for component ${component.id}: ${existingComponent.category} vs ${component.category}`);
      }
    } else {
      componentMap.set(component.id, {
        ...component,
        connectors: [...component.connectors]
      });
    }
  }

  mergedComponents.push(...Array.from(componentMap.values()));

  // --- Merge Connections (avoid duplicates) ---
  const connectionMap = new Map<string, Connection>();
  const allConnections = configs.flatMap(config => config.connections);

  for (const conn of allConnections) {
    // Create a unique key based on from/to component+connector
    const key = `${conn.from.componentId}:${conn.from.connectorId}:${conn.from.cavity}-${conn.to.componentId}:${conn.to.connectorId}:${conn.to.cavity}`;
    if (!connectionMap.has(key)) {
      connectionMap.set(key, conn);
    }
  }

  mergedConnections.push(...Array.from(connectionMap.values()));

  return {
    masterComponents: Array.from(new Set(mergedMasterComponents)),
    components: mergedComponents,
    connections: mergedConnections,
    name: configs.length > 1 ? "Merged Schematic" : configs[0].name,
  };
}

// Example usage function
export function mergeB3AndS4Configs() {
  // Import the configs (you'll need to adjust the import paths as needed)
  const B3 = require('../components/Schematic/tests/B3.ts').default;
  const S4 = require('../components/Schematic/tests/S4.ts').default;

  return mergeSchematicConfigs(B3, S4);
}