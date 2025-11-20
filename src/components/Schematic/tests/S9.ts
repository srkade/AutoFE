const S9 = {
  code: "S9",
  name: "Light Switch",
  masterComponents: ["S9"],
  components: [
    {
      id: "S9",
      label: "Light switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS9",
          label: "XS9",
        },
      ],
      harness_name: "MAIN WIRING HARNESS (W1)",
      engineering_connector_code: "XS9",
      engineering_component_name: "Light switch",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M9361",
      component_code: "S9",
      component_type: "Component",
      connector_type: "Direct",
      component_category: "Switch",
      remove: false,
      manufacturer: "Delphi",
      connector_part_number: "57M9361",
      gender: "Female"
    },
    {
      id: "SPL_450",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_450",
          label: "XSP_450",
        },
      ],
      harness_name: "MAIN WIRING HARNESS (W1)",
      engineering_connector_code: "XSP_450",
      engineering_component_name: "Splice",
      primary_part_number: "",
      component_code: "SPL_450",
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
    },
    {
      id: "X90",
      label: "Load center",
      category: "Transformer",
      shape: "rectangle",
      connectors: [
        {
          id: "X90",
          label: "X90",
        },
      ],
      harness_name: "MAIN WIRING HARNESS (W1)",
      engineering_connector_code: "X90",
      engineering_component_name: "Load center",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M13428",
      component_code: "X90",
      component_type: "Component",
      connector_type: "Direct",
      component_category: "Transformator",
      remove: false,
      manufacturer: "GEP",
      connector_part_number: "57M13428",
      gender: "Female"
    },
    {
      id: "K3",
      label: "Headlight relay",
      category: "Instrument",
      shape: "rectangle",
      connectors: [
        {
          id: "XK3",
          label: "XK3",
        },
      ],
      harness_name: "MAIN WIRING HARNESS (W1)",
      engineering_connector_code: "XK3",
      engineering_component_name: "Headlight relay",
      engineering_manufacturer: "",
      primary_part_number: "",
      component_code: "K3",
      component_type: "Component",
      connector_type: "Direct",
      component_category: "Relay",
      remove: false,
      manufacturer: "",
      connector_part_number: "",
      gender: ""
    }
  ],
  connections: [
    {
      color: "yellow",
      from: {
        componentId: "S9",
        connectorId: "XS9",
        cavity: "B",
        gender: "female"
      },
      to: {
        componentId: "SPL_450",
        connectorId: "XSP_450",
        cavity: "L",
        gender: ""
      },
      label: "",
      wireDetails: {
        circuitNumber: "450A",
        wireSize: 1,
        wireColor: "YE",
        wireLength: 1339,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS9",
          devName: "Light switch",
          connPartNumber: "57M9361",
          termPartNo: "57M9200",
          sealPartNo: "",
          cavity: "B",
        },
        to: {
          connectorNumber: "XSP_450",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L",
        },
      },
    },
    {
      color: "yellow",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "47",
        gender: "female"
      },
      to: {
        componentId: "S9",
        connectorId: "XS9",
        cavity: "D",
        gender: "female"
      },
      label: "",
      wireDetails: {
        circuitNumber: "400A",
        wireSize: 1,
        wireColor: "YE",
        wireLength: 571,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "X90",
          devName: "Load center",
          connPartNumber: "57M13428",
          termPartNo: "57M7491",
          sealPartNo: "57M9219",
          cavity: "47"
        },
        to: {
          connectorNumber: "XS9",
          devName: "Light switch",
          connPartNumber: "57M9361",
          termPartNo: "57M9200",
          sealPartNo: "",
          cavity: "D"
        }
      }
    },
    {
      color: "pink",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "12",
        gender: "female"
      },
      to: {
        componentId: "S9",
        connectorId: "XS9",
        cavity: "C",
        gender: "female"
      },
      label: "",
      wireDetails: {
        circuitNumber: "456A",
        wireSize: 0.8,
        wireColor: "PK",
        wireLength: 856,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "12"
        },
        to: {
          connectorNumber: "XS9",
          devName: "Light switch",
          connPartNumber: "57M9361",
          termPartNo: "57M9200",
          sealPartNo: "",
          cavity: "C"
        }
      }
    },
    {
      color: "green",
      from: {
        componentId: "K3",
        connectorId: "XK3",
        cavity: "19",
        gender: ""
      },
      to: {
        componentId: "S9",
        connectorId: "XS9",
        cavity: "1",
        gender: "female"
      },
      label: "",
      wireDetails: {
        circuitNumber: "456A-1",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: "",
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XK3",
          devName: "Headlight relay",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "19"
        },
        to: {
          connectorNumber: "XS9",
          devName: "Light switch",
          connPartNumber: "57M9361",
          termPartNo: "57M9200",
          sealPartNo: "",
          cavity: "1"
        }
      }
    }
  ],
};
export default S9;
