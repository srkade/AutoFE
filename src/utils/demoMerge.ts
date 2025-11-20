import { mergeSchematicConfigs } from '../utils/mergeSchematicConfigs';
import B3 from '../components/Schematic/tests/B3';
import S4 from '../components/Schematic/tests/S4';
import S8 from '../components/Schematic/tests/S8';
import S9 from '../components/Schematic/tests/S9';

// Demo function to show the merged result with multiple configurations
export function demoMerge() {
  // You can now merge 2, 3, 4, or more configurations
  const mergedResult = mergeSchematicConfigs(B3, S4); // 2 configs
  // const mergedResult = mergeSchematicConfigs(B3, S4, S8); // 3 configs
  // const mergedResult = mergeSchematicConfigs(B3, S4, S8, S9); // 4 configs
  
  console.log('Merged Configuration:');
  console.log('===================');
  
  console.log('\nComponents:');
  mergedResult.components.forEach(component => {
    console.log(`- ${component.id}: ${component.label}`);
    console.log(`  Category: ${component.category}`);
    console.log(`  Connectors: ${component.connectors.map(c => c.id).join(', ')}`);
  });
  
  console.log('\nConnections:');
  mergedResult.connections.forEach((connection, index) => {
    console.log(`${index + 1}. ${connection.color} wire: ${connection.from.componentId}(${connection.from.connectorId}:${connection.from.cavity}) → ${connection.to.componentId}(${connection.to.connectorId}:${connection.to.cavity})`);
  });
  
  return mergedResult;
}

// You can call this function to see the merged result
// demoMerge();