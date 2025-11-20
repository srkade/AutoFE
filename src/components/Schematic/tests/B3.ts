const B3 = {
  code: "B3",
  name: "Coolant Temperature Sensor",
  masterComponents: ["B3"],
  components: [
    {
      id: "B3",
      label: "Coolant Temperature sensor",
      category: "Sensor",
      shape: "rectangle",
      connectors: [
        {
          id: "XB3",
          label: "XB3"
        }
      ],
      engineering_component_name: "Coolant Temperature Sensor",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M10968",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "ALPHA",
      connector_part_number: "57M10968",
      
    },
    {
      id: "ICC",
      label: "Instrument Cluster Controller",
      category: "Transistor",
      shape: "rectangle",
      connectors: [
        {
          id: "XJ1",
          label: "XJ1",
        },
      ],
      harness_name: "MAIN WIRING HARNESS (W1)",
      engineering_connector_code: "XJ1",
      engineering_component_name: "Instrument Cluster Controller",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M12666",
      component_code: "ICC",
      component_type: "Component",
      connector_type: "Direct",
      component_category: "Transistor",
      remove: false,
      manufacturer: "Molex",
      connector_part_number: "57M12666",
      gender: "Female"
    }
  ],
  connections: [
    {
      color: "orange",
      from: {
        componentId: "B3",
        connectorId: "XB3",
        cavity: "1",
        gender: "Female"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "16",
        gender: "Female"
      },
      label: "",
      // Extra wire data if you want at connection level instead:
      wireDetails: {
        circuitNumber: "310A",
        wireSize: 0.8,
        wireColor: "OG",
        wireLength: 960,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XB3",
          devName: "Coolant Temperature Sensor",
          connPartNumber: "57M10968",
          termPartNo: "57M10968",
          sealPartNo: "",
          cavity: "1"
        },
        to: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "16"
        }
      }
    },
  ],
};

export default B3;
