const S4 = {
  code: "S4",
  name: "Seat Switch",
  masterComponents: ["S4"],
  components: [
    {
      id: "S4",
      label: "Seat switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS4",
          label: "XS4"
        },
      ],
      harness_name: "MAIN WIRING HARNESS (W1)",
      engineering_connector_code: "XS4",
      engineering_component_name: "Seat switch",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M7535",
      component_code: "S4",
      component_type: "Component",
      connector_type: "Direct",
      component_category: "Switch",
      remove: false,
      manufacturer: "Deutsch",
      connector_part_number: "57M7535",
      gender: "Female"
    },
    {
      id: "SPL_500",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_500",
          label: "XSP_500"
        },
      ],
      harness_name: "MAIN WIRING HARNESS (W1)",
      engineering_connector_code: "XSP_500",
      engineering_component_name: "Splice",
      primary_part_number: "",
      component_code: "SPL_500",
      component_type: "Splice",
      connector_type: "Direct",
      remove: false
    },
    {
      id: "ICC",
      label: "Instrument Cluster Controller",
      category: "Transistor",
      shape: "rectangle",
      connectors: [
        {
          id: "XJ2",
          label: "XJ2"
        },
      ],
      harness_name: "MAIN WIRING HARNESS (W1)",
      engineering_connector_code: "XJ2",
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
      color: "yellow",
      from: {
        componentId: "S4",
        connectorId: "XS4",
        cavity: "2",
        gender: "female"
      },
      to: {
        componentId: "SPL_500",
        connectorId: "XSP_500",
        cavity: "L",
        gender: ""
      },
      label: "",
      wireDetails: {
        circuitNumber: "500C",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 2377,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS4",
          devName: "Seat switch",
          connPartNumber: "57M7535",
          termPartNo: "57M7546",
          sealPartNo: "",
          cavity: "2",
        },
        to: {
          connectorNumber: "XSP_500",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L",
        },
      },
    },
    {
      color: "pink",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "3",
        gender: ""
      },
      to: {
        componentId: "S4",
        connectorId: "XS4",
        cavity: "4",
        gender: "female"
      },
      label: "",
      wireDetails: {
        circuitNumber: "800A",
        wireSize: 0.8,
        wireColor: "PK",
        wireLength: 2510,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "3",
          gender: ""
        },
        to: {
          connectorNumber: "XS4",
          devName: "Seat switch",
          connPartNumber: "57M7535",
          termPartNo: "57M7546",
          sealPartNo: "",
          cavity: "4",
          gender: ""
        },
      },
    },
  ],
};
export default S4;
