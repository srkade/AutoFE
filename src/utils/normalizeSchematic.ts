export function normalizeSchematic(apiData: any) {
  if (!apiData || !apiData.schematicData) return apiData;

  const data = apiData.schematicData;

  // Wire color mapping
  const colorMap: Record<string, string> = {
    'OG': 'orange',
    'BK': 'black',
    'BR': 'brown',
    'RD': 'red',
    'YE': 'yellow',
    'GN': 'green',
    'BU': 'blue',
    'VI': 'violet',
    'GY': 'gray',
    'WH': 'white',
    'PK': 'pink',
    'LG': 'lightgreen',
    'TN': 'tan',
  };

  // Component code extraction: extract code from component name or use existing code
  const extractComponentCode = (component: any): string => {
    // If componentCode exists and is not the full name, use it
    if (component.componentCode && component.componentCode !== component.id) {
      return component.componentCode;
    }
    
    // Try to extract from engineeringConnectorCode (e.g., "XJ1" -> "ICC", "XB3" -> "B3")
    if (component.engineeringConnectorCode) {
      const connCode = component.engineeringConnectorCode;
      // Extract the letter part after X (e.g., XJ1 -> J, XB3 -> B)
      const match = connCode.match(/^X([A-Z]+)/);
      if (match) {
        return match[1] + connCode.slice(2); // E.g., "J" + "1" = "J1" but we want the component
      }
    }

    // Fallback: Use the ID as-is or try to extract initials
    // For "Instrument Cluster Controller" -> "ICC"
    // For "Coolant Temperature Sensor" -> "B3" (based on connector XB3)
    if (component.id && component.engineeringConnectorCode) {
      const connCode = component.engineeringConnectorCode;
      // XJ1 -> ICC mapping, XB3 -> B3 mapping
      if (connCode.startsWith('XJ')) {
        return 'ICC';
      } else if (connCode.startsWith('XB')) {
        return connCode.substring(1); // XB3 -> B3
      }
    }

    // Last resort: return the ID as-is
    return component.id;
  };

  // Build a mapping from full component names to short codes
  const componentCodeMap: Record<string, string> = {};
  data.components.forEach((c: any) => {
    const shortCode = extractComponentCode(c);
    componentCodeMap[c.id] = shortCode;
  });

  return {
    code: data.code,
    name: data.name,
    masterComponents: data.masterComponents || [],
    components: data.components.map((c: any) => {
      const shortCode = extractComponentCode(c);
      
      return {
        id: shortCode,
        label: c.label || c.engineeringComponentName || shortCode,
        category: c.componentCategory || c.category || 'Component',
        shape: c.shape || 'rectangle',
        connectors: c.connectors?.map((conn: any) => ({
          id: conn.id,
          label: conn.label
        })) || [],
        engineering_component_name: c.engineeringComponentName,
        engineering_manufacturer: c.engineeringManufacturer,
        primary_part_number: c.primaryPartNumber,
        harness_name: c.harnessName,
        component_type: c.componentType,
        connector_type: c.connectorType,
        remove: c.remove || false,
        manufacturer: c.manufacturer,
        connector_part_number: c.connectorPartNumber,
        gender: c.gender
      };
    }),
    connections: data.connections.map((con: any) => ({
      color: colorMap[con.color] || con.color.toLowerCase(),
      from: {
        componentId: componentCodeMap[con.from.componentId] || con.from.componentId,
        connectorId: con.from.connectorId,
        cavity: con.from.cavity,
        gender: con.from.gender?.charAt(0).toUpperCase() + con.from.gender?.slice(1).toLowerCase() || 'Female'
      },
      to: {
        componentId: componentCodeMap[con.to.componentId] || con.to.componentId,
        connectorId: con.to.connectorId,
        cavity: con.to.cavity,
        gender: con.to.gender?.charAt(0).toUpperCase() + con.to.gender?.slice(1).toLowerCase() || 'Female'
      },
      label: con.label || '',
      wireDetails: {
        circuitNumber: con.wireDetails?.circuitNumber,
        wireSize: con.wireDetails?.wireSize,
        wireColor: con.wireDetails?.wireColor,
        wireLength: con.wireDetails?.wireLength,
        wireType: con.wireDetails?.wireType,
        twistId: con.wireDetails?.twistId || '',
        shieldId: con.wireDetails?.shieldId || '',
        wireOption: con.wireDetails?.wireOption || '',
        mark: con.wireDetails?.mark || '',
        from: {
          connectorNumber: con.wireDetails?.fromConnNumber,
          devName: con.wireDetails?.fromDevName,
          connPartNumber: con.wireDetails?.fromConnPartNumber,
          termPartNo: con.wireDetails?.fromTermPartNo,
          sealPartNo: con.wireDetails?.fromSealPartNo || '',
          cavity: con.wireDetails?.fromCavity
        },
        to: {
          connectorNumber: con.wireDetails?.toConnNumber,
          devName: con.wireDetails?.toDevName,
          connPartNumber: con.wireDetails?.toConnPartNumber,
          termPartNo: con.wireDetails?.toTermPartNo,
          sealPartNo: con.wireDetails?.toSealPartNo || '',
          cavity: con.wireDetails?.toCavity
        }
      }
    }))
  };
}
