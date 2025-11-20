const HeadlightRelayFuse = {
  code: "F2",
  name: "Headlight Relay Fuse (10A)",
  masterComponents: ["X90"],
  components: [
    {
      id: "X90",
      label: "Load Center",
      category: "Supply",
      shape: "rectangle",
      connectors: [{ id: "X90", label: "X90" }],
      engineering_component_name: "Load Center",
      engineering_manufacturer: "57M9219",
      primary_part_number: "57M13428",
      harness_name: "400A",
      component_type: "Load center",
      connector_type: "57M13428",
      remove: false,
      manufacturer: "57M9219",
      connector_part_number: "X90"
    },
    {
      id: "S9",
      label: "Light Switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [{ id: "XS9", label: "XS9" }],
      engineering_component_name: "Light Switch",
      engineering_manufacturer: "57M8631",
      primary_part_number: "57M8200",
      harness_name: "Light Switch Harness",
      component_type: "Switch",
      connector_type: "57M8200",
      remove: false,
      manufacturer: "57M8631",
      connector_part_number: "XS9"
    },
    {
      id: "SP_401",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [{ id: "SP_401", label: "SP_401" }],
      engineering_component_name: "Splice",
      engineering_manufacturer: "57M9219",
      primary_part_number: "57M13428",
      harness_name: "401",
      component_type: "Splice",
      connector_type: "57M13428",
      remove: false,
      manufacturer: "57M9219",
      connector_part_number: "SP_401"
    }
  ],
  connections: [
    // 400A wire
    {
      color: "yellow",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "47",
        gender: "Female"
      },
      to: {
        componentId: "S9",
        connectorId: "XS9",
        cavity: "D",
        gender: "Female"
      },
      label: "400A",
      wireDetails: {
        circuitNumber: "400A",
        wireSize: 1,
        wireColor: "YE",
        wireLength: 571,
        wireType: "Regular",
        fuse: { code: "F2", ampere: "10A" },
        from: {
          connectorNumber: "X90",
          devName: "Load Center",
          connPartNumber: "57M13428",
          termPartNo: "57M7401",
          sealPartNo: "57M9219",
          cavity: "47"
        },
        to: {
          connectorNumber: "XS9",
          devName: "Light Switch",
          connPartNumber: "57M8631",
          termPartNo: "57M8200",
          sealPartNo: "",
          cavity: "D"
        }
      }
    },

    // 401A wire
    {
      color: "yellow",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "43",
        gender: "Female"
      },
      to: {
        componentId: "SP_401",
        connectorId: "SP_401",
        cavity: "",
        gender: "Female"
      },
      label: "401A",
      wireDetails: {
        circuitNumber: "401A",
        wireSize: 2,
        wireColor: "YE",
        wireLength: 174,
        wireType: "Regular",
        fuse: { code: "F3", ampere: "20A" },
        from: {
          connectorNumber: "XS9",
          devName: "Load Center",
          connPartNumber: "57M13428",
          termPartNo: "57M7401",
          sealPartNo: "57M9219",
          cavity: "43"
        },
        to: {
          connectorNumber: "SP_401",
          devName: "Splice",
          connPartNumber: "57M9219",
          termPartNo: "",
          sealPartNo: "",
          cavity: ""
        }
      }
    },

    // 401B wire
    {
      color: "yellow",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "35",
        gender: "Female"
      },
      to: {
        componentId: "SP_401",
        connectorId: "SP_401",
        cavity: "",
        gender: "Female"
      },
      label: "401B",
      wireDetails: {
        circuitNumber: "401B",
        wireSize: 2,
        wireColor: "YE",
        wireLength: 174,
        wireType: "Regular",
        fuse: { code: "F5", ampere: "15A" },
        from: {
          connectorNumber: "XS9",
          devName: "Load Center",
          connPartNumber: "57M13428",
          termPartNo: "57M7401",
          sealPartNo: "57M9219",
          cavity: "35"
        },
        to: {
          connectorNumber: "SP_401",
          devName: "Splice",
          connPartNumber: "57M9219",
          termPartNo: "",
          sealPartNo: "",
          cavity: ""
        }
      }
    },

    // 401C wire
    {
      color: "yellow",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "2",
        gender: "Female"
      },
      to: {
        componentId: "SP_401",
        connectorId: "SP_401",
        cavity: "",
        gender: "Female"
      },
      label: "401C",
      wireDetails: {
        circuitNumber: "401C",
        wireSize: 2,
        wireColor: "YE",
        wireLength: 174,
        wireType: "Regular",
        fuse: { code: "F5", ampere: "25A" }, 
        from: {
      connectorNumber: "X90",
      devName: "Load Center",
      connPartNumber: "57M13428",
      termPartNo: "57M7401",
      sealPartNo: "57M9219",
      cavity: "2"
    },
    to: {
      connectorNumber: "SP_401",
      devName: "Splice",
      connPartNumber: "57M9219",
      termPartNo: "",
      sealPartNo: "",
      cavity: ""
    }
      }
    }
  ]
};

export default HeadlightRelayFuse;
