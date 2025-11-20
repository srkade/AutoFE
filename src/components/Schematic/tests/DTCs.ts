export const DTC_StarterCoolDown = {
  code: "ICC 000677.31",
  name: "(E1001) - Starter Cool Down in Process",
  type: "dtcs",
  masterComponents: ["S12"],
  components: [
    {
      id: "S12",
      label: "Horn switch",
      category: "dtc",
      shape: "rectangle",
      connectors: [
        {
          id: "XS12",
          label: "XS12",
        },
      ],
    },
    {
      id: "SPL_500",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_500",
          label: "XSP_500",
        },
      ],
    },
    {
      id: "ICC",
      label: "Instrument Cluster Controller",
      category: "Transformer",
      shape: "rectangle",
      connectors: [
        {
          id: "XJ1",
          label: "XJ1",
        },
      ],
    },

    {
      id: "H1",
      label: "Horn",
      category: "Horn",
      shape: "rectangle",
      connectors: [
        {
          id: "XH1",
          label: "XH1",
        },
      ],
    },
  ],
  connections: [
    {
      color: "yellow",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "6",
      },
      to: {
        componentId: "SPL_500",
        connectorId: "XSP_500",
        cavity: "L",
      },
      label: "",
    },
    {
      color: "black",
      from: {
        componentId: "S12",
        connectorId: "XS12",
        cavity: "A",
      },
      to: {
        componentId: "SPL_500",
        connectorId: "XSP_500",
        cavity: "L",
      },
      label: "",
    },
    {
      color: "violet",
      from: {
        componentId: "H1",
        connectorId: "XH1",
        cavity: "A",
      },
      to: {
        componentId: "S12",
        connectorId: "XS12",
        cavity: "B",
      },
      label: "",
    },
  ],
  probableCauses: [
    "open circuit in connector XSP_500",
    "corroded connector XS12 cavity A",
    "Loose ground near horn circuit"
  ],
  steps: [
    "check continuity between ICC XJ! cavity 6 and splice XSP_500.",
    "Inspect connector XS1 for corrosion.",
    "Verify horn ground connection."
  ],
  vedioUrl: "https://www.youtube.com/embed/gaelXhngh5A"
};

export const DTC_StarterRelayPower = {
  code: "ICC 000677.03",
  name: "(E1007) - Starter Relay Short to Power",
  type: "dtcs",
  masterComponents: ["K3", "K6"],
  components: [
    {
      id: "K6",
      label: "Starter Relay",
      category: "dtc",
      shape: "rectangle",
      connectors: [{ id: "XK6", label: "XK6" }],
      engineering_component_name: "Starter Relay",
      engineering_manufacturer: "",
      primary_part_number: "",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "",
      gender: "Male"
    },

    {
      id: "ICC",
      label: "Instrument Cluster Controller",
      category: "Transistor",
      shape: "rectangle",
      connectors: [{ id: "XJ1", label: "XJ1" }],
      engineering_component_name: "Instrument Cluster Controller",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M12666",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Controller",
      connector_type: "Direct",
      remove: false,
      manufacturer: "Bosch",
      connector_part_number: "57M12666",
      gender: "Female"
    },
    {
      id: "SPL1",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [{ id: "XSP_100B", label: "XSP_100B" }]
    },
    {
      id: "K3",
      label: "Headlight Relay",
      category: "Relay",
      shape: "rectangle",
      connectors: [{ id: "XK3", label: "XK3" }],
      engineering_component_name: "Headlight Relay",
      engineering_manufacturer: "",
      primary_part_number: "",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "",
      gender: "Male"
    },
    {
      id: "SPL2",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [{ id: "XSP_455", label: "XSP_455" }]
    },
    {
      id: "S9",
      label: "Light switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [{ id: "XS9", label: "XS9" }],
      engineering_component_name: "Light switch",
      engineering_manufacturer: "",
      primary_part_number: "57M9361",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M9361",
      gender: "Female"
    },
    {
      id: "H8",
      label: "Main to W3 Front Lighting Harness",
      category: "Harness",
      shape: "rectangle",
      connectors: [{ id: "X8", label: "X8" }],
      engineering_component_name: "Main to Front Lighting Harness",
      engineering_manufacturer: "",
      primary_part_number: "57M7264",
      harness_name: "W3 FRONT LIGHT HARNESS",
      component_type: "Harness",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M7264",
      gender: ""
    },


  ],
  connections: [
    {
      color: "green",
      from: { componentId: "K3", connectorId: "XK3", cavity: "20" },
      to: { componentId: "SPL2", connectorId: "XSP_455", cavity: "L" },
      label: "",
      wireDetails: {
        circuitNumber: "455C",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 0,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XK3",
          devName: "Headlight Relay",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "20"
        },
        to: {
          connectorNumber: "XSP_455",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "green",
      from: { componentId: "K3", connectorId: "XK3", cavity: "19" },
      to: { componentId: "S9", connectorId: "XS9", cavity: "1" },
      label: "",
      wireDetails: {
        circuitNumber: "456A-1",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 0,
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
    },
    {
      color: "black",
      from: { componentId: "K6", connectorId: "XK6", cavity: "10" },
      to: { componentId: "SPL1", connectorId: "XSP_100B", cavity: "L" },
      label: "",
      wireDetails: {
        circuitNumber: "100D",
        wireSize: 1.0,
        wireColor: "BK",
        wireLength: 0,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XK6",
          devName: "Starter Relay",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "10"
        },
        to: {
          connectorNumber: "XSP_100B",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "black",
      from: { componentId: "ICC", connectorId: "XJ1", cavity: "20" },
      to: { componentId: "SPL1", connectorId: "XSP_100B", cavity: "L" },
      label: "",
      wireDetails: {
        circuitNumber: "100AG",
        wireSize: 2.0,
        wireColor: "BK",
        wireLength: 597,
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
          cavity: "20"
        },
        to: {
          connectorNumber: "XSP_100B",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "green",
      from: { componentId: "H8", connectorId: "X8", cavity: "A" },
      to: { componentId: "SPL2", connectorId: "XSP_455", cavity: "L" },
      label: "",
      wireDetails: {
        circuitNumber: "455A",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 0,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "X8",
          devName: "Main to W3 Front Lighting Harness",
          connPartNumber: "57M7264",
          termPartNo: "R104919",
          sealPartNo: "",
          cavity: "A"
        },
        to: {
          connectorNumber: "XSP_455",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "green",
      from: { componentId: "H8", connectorId: "X8", cavity: "B" },
      to: { componentId: "SPL2", connectorId: "XSP_455", cavity: "L" },
      label: "",
      wireDetails: {
        circuitNumber: "455B",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 0,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "X8",
          devName: "Main to W3 Front Lighting Harness",
          connPartNumber: "57M7264",
          termPartNo: "R104919",
          sealPartNo: "",
          cavity: "B"
        },
        to: {
          connectorNumber: "XSP_455",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    }
  ],
  probableCauses: [
    "Faulty Starter Relay (K6)",
    "Loose or corroded connections at XSP_100B or XK6",
    "Instrument Cluster Controller (ICC) sending incorrect signals",
    "Damaged wiring in MAIN WIRING HARNESS (H8)",
    "Short circuit between circuits 100D or 100AG"
  ],
  steps: [
    "Inspect Starter Relay (K6) and its connector XK6 for damage or corrosion",
    "Check continuity of wiring from XK6 to splice XSP_100B",
    "Verify Instrument Cluster Controller (ICC) output signals at connector XJ1",
    "Check MAIN WIRING HARNESS (H8) for shorts or open circuits",
    "Test circuit numbers 100D and 100AG for correct voltage and continuity"
  ],
  vedioUrl: "https://www.youtube.com/embed/gaelXhngh5A"
};


export const DTC_StarterRelayGround = {
  code: "ICC 000677.04",
  name: "(E1006) - Starter Relay Short to Ground",
  type: "dtcs",
  masterComponents: [
    "G2",

  ],
  components: [
    {
      id: "G2",
      label: "Alternator",
      category: "dtc",
      shape: "rectangle",
      connectors: [
        { id: "XG2-1", label: "XG2-1" },
        { id: "XG2-3", label: "XG2-3" }
      ],
      engineering_component_name: "Alternator",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M8928",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "Bosch",
      connector_part_number: "57M8928",
      gender: "Male"
    },
    {
      id: "M1",
      label: "Starter Motor",
      category: "Motor",
      shape: "rectangle",
      connectors: [
        { id: "XM1", label: "XM1" }
      ],
      engineering_component_name: "Starter Motor",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M11989",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "Bosch",
      connector_part_number: "57M11989",
      gender: "Female"
    },
    {
      id: "ICC",
      label: "Instrument Cluster Controller",
      category: "Transistor",
      shape: "rectangle",
      connectors: [
        { id: "XJ1", label: "XJ1" }
      ],
      engineering_component_name: "Instrument Cluster Controller",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M12666",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Controller",
      connector_type: "Direct",
      remove: false,
      manufacturer: "Bosch",
      connector_part_number: "57M12666",
      gender: "Female"
    },
    {
      id: "SPL1",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [{ id: "XSP_500", label: "XSP_500" }]
    },
    {
      id: "SPL2",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [{ id: "XSP_201_FL", label: "XSP_201_FL" }]
    },
    {
      id: "SPL3",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [{ id: "XSP_FUEL_FL", label: "XSP_FUEL_FL" }]
    },
    {
      id: "SPL4",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [{ id: "XSP_GLOW_FL", label: "XSP_GLOW_FL" }]
    }
  ],
  connections: [
    {
      color: "red",
      from: { componentId: "G2", connectorId: "XG2-1", cavity: "1" },
      to: { componentId: "M1", connectorId: "XM1", cavity: "1" },
      label: "",
      wireDetails: {
        circuitNumber: "200D",
        wireSize: 8.0,
        wireColor: "RD",
        wireLength: 379,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XG2-1",
          devName: "Alternator",
          connPartNumber: "57M11530",
          termPartNo: "57M11530",
          sealPartNo: "",
          cavity: "1"
        },
        to: {
          connectorNumber: "XM1",
          devName: "Starter Motor",
          connPartNumber: "57M11989",
          termPartNo: "57M11989",
          sealPartNo: "",
          cavity: "1"
        }
      }
    },
    {
      color: "yellow",
      from: { componentId: "G2", connectorId: "XG2-3", cavity: "2" },
      to: { componentId: "SPL1", connectorId: "XSP_500", cavity: "L" },
      label: "",
      wireDetails: {
        circuitNumber: "500B",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 1142,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XG2-3",
          devName: "Alternator",
          connPartNumber: "57M8928",
          termPartNo: "57M8404",
          sealPartNo: "",
          cavity: "2"
        },
        to: {
          connectorNumber: "XSP_500",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "green",
      from: { componentId: "G2", connectorId: "XG2-3", cavity: "3" },
      to: { componentId: "ICC", connectorId: "XJ1", cavity: "1" },
      label: "",
      wireDetails: {
        circuitNumber: "615A",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 1337,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XG2-3",
          devName: "Alternator",
          connPartNumber: "57M8928",
          termPartNo: "57M8404",
          sealPartNo: "57M8929",
          cavity: "3"
        },
        to: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11548",
          sealPartNo: "",
          cavity: "1"
        }
      }
    },
    {
      color: "red",
      from: { componentId: "G2", connectorId: "XG2-3", cavity: "1" },
      to: { componentId: "SPL2", connectorId: "XSP_201_FL", cavity: "L" },
      label: "",
      wireDetails: {
        circuitNumber: "FUSELINK_201",
        wireSize: 1.0,
        wireColor: "RD",
        wireLength: 127,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XG2-3",
          devName: "Alternator",
          connPartNumber: "57M8928",
          termPartNo: "57M8404",
          sealPartNo: "",
          cavity: "1"
        },
        to: {
          connectorNumber: "XSP_201_FL",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "red",
      from: { componentId: "G2", connectorId: "XG2-3", cavity: "1" },
      to: { componentId: "SPL3", connectorId: "XSP_FUEL_FL", cavity: "L" },
      label: "",
      wireDetails: {
        circuitNumber: "FUSELINK_FUEL",
        wireSize: 1.0,
        wireColor: "RD",
        wireLength: 132,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XG2-3",
          devName: "Alternator",
          connPartNumber: "57M8928",
          termPartNo: "57M8404",
          sealPartNo: "",
          cavity: "1"
        },
        to: {
          connectorNumber: "XSP_FUEL_FL",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "red",
      from: { componentId: "G2", connectorId: "XG2-3", cavity: "1" },
      to: { componentId: "SPL4", connectorId: "XSP_GLOW_FL", cavity: "L" },
      label: "",
      wireDetails: {
        circuitNumber: "FUSELINK_GLOW",
        wireSize: 1.0,
        wireColor: "RD",
        wireLength: 134,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XG2-3",
          devName: "Alternator",
          connPartNumber: "57M8928",
          termPartNo: "57M8404",
          sealPartNo: "",
          cavity: "1"
        },
        to: {
          connectorNumber: "XSP_GLOW_FL",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    }
  ],
  probableCauses: [
    "Faulty Alternator (G2) or internal short",
    "Damaged or corroded connections at XM1 or XG2-1/XG2-3",
    "Short circuit in MAIN WIRING HARNESS (W1)",
    "Loose or damaged splices (XSP_500, XSP_201_FL, XSP_FUEL_FL, XSP_GLOW_FL)",
    "Instrument Cluster Controller (ICC) providing incorrect signal"
  ],
  steps: [
    "Inspect Alternator (G2) and its connectors XG2-1 and XG2-3 for damage or corrosion",
    "Check Starter Motor (M1) connector XM1 for secure connection",
    "Verify continuity of wiring from Alternator to Starter Motor (circuit 200D)",
    "Inspect splices (XSP_500, XSP_201_FL, XSP_FUEL_FL, XSP_GLOW_FL) for shorts or loose connections",
    "Test MAIN WIRING HARNESS (W1) for shorts to ground",
    "Check Instrument Cluster Controller (ICC) signals at XJ1 for proper operation"
  ],
  vedioUrl: "https://www.youtube.com/embed/gaelXhngh5A"
};


export const DTC_ICC = {
  code: "ICC 000677.05",
  name: "(E1012) - Starter Relay Open Circuit",
  type: "dtcs",
  masterComponents: ["ICC"],
  components: [
    {
      id: "ICC",
      label: "Instrument Cluster Controller",
      category: "dtc",
      shape: "rectangle",
      connectors: [
        {
          id: "XJ1",
          label: "XJ1"
        },
        {
          id: "XJ2",
          label: "XJ2"
        }
      ],
      engineering_component_name: "Instrument Cluster Controller",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M12666",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Controller",
      connector_type: "Direct",
      remove: false,
      manufacturer: "Bosch",
      connector_part_number: "57M12666",
      gender: "Female"
    },
    {
      id: "B3",
      label: "Coolant Temperature Sensor",
      category: "Sensor",
      shape: "rectangle",
      connectors: [
        {
          id: "XB3",
          label: "XB3"
        }
      ],
      engineering_component_name: "Coolant Temperature Sensor",
      engineering_manufacturer: "",
      primary_part_number: "57M10968",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M10968",
      gender: ""
    },
    {
      id: "B1",
      label: "Air restriction sensor",
      category: "Sensor",
      shape: "rectangle",
      connectors: [
        {
          id: "XB1",
          label: "XB1"
        }
      ],
      engineering_component_name: "Air restriction sensor",
      engineering_manufacturer: "",
      primary_part_number: "57M7254",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M7254",
      gender: ""
    },
    {
      id: "X90",
      label: "Load center",
      category: "Transformer",
      shape: "rectangle",
      connectors: [
        {
          id: "X90",
          label: "X90"
        }
      ],
      engineering_component_name: "Load center",
      engineering_manufacturer: "",
      primary_part_number: "57M13428",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M13428",
      gender: ""
    },
    {
      id: "G2",
      label: "Alternator",
      category: "Motor",
      shape: "rectangle",
      connectors: [
        {
          id: "XG2-3",
          label: "XG2-3"
        }
      ],
      engineering_component_name: "Alternator",
      engineering_manufacturer: "",
      primary_part_number: "57M8928",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M8928",
      gender: ""
    },
    {
      id: "H3",
      label: "Main Chassis to FMI Monitor Harness Connector",
      category: "Harness",
      shape: "rectangle",
      connectors: [
        {
          id: "X3",
          label: "X3"
        }
      ],
      engineering_component_name: "Main Chassis to FMI Monitor Harness Connector",
      engineering_manufacturer: "",
      primary_part_number: "57M7255",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M7255",
      gender: ""
    },
    {
      id: "B2",
      label: "Oil Pressure Switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XB2",
          label: "XB2"
        }
      ],
      engineering_component_name: "Oil Pressure Switch",
      engineering_manufacturer: "",
      primary_part_number: "57M9614",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M9614",
      gender: ""
    },
    {
      id: "H6",
      label: "Main Chassis Harness to PTO Switch Harness Connector",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "X6",
          label: "X6"
        }
      ],
      engineering_component_name: "Main Chassis Harness to PTO Switch Harness Connector",
      engineering_manufacturer: "",
      primary_part_number: "T24167",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "T24167",
      gender: ""
    },
    {
      id: "H1",
      label: "Main Chassis to Rear Lighting Harness",
      category: "Harness",
      shape: "rectangle",
      connectors: [
        {
          id: "X1",
          label: "X1"
        }
      ],
      engineering_component_name: "Main Chassis to Rear Lighting Harness",
      engineering_manufacturer: "",
      primary_part_number: "57M8841",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M8841",
      gender: ""
    },
    {
      id: "B4",
      label: "Fuel level senser",
      category: "Sensor",
      shape: "rectangle",
      connectors: [
        {
          id: "XB4",
          label: "XB4"
        }
      ],
      engineering_component_name: "Fuel level senser",
      engineering_manufacturer: "",
      primary_part_number: "57M7309",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M7309",
      gender: ""
    },
    {
      id: "SPL1",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_100B",
          label: "XSP_100B"
        }
      ]
    },
    {
      id: "S9",
      label: "Light switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS9",
          label: "XS9"
        }
      ],
      engineering_component_name: "Light switch",
      engineering_manufacturer: "",
      primary_part_number: "57M9361",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M9361",
      gender: ""
    },
    {
      id: "SPL2",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_500",
          label: "XSP_500"
        }
      ]
    },
    {
      id: "SPL3",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_500",
          label: "XSP_500"
        }
      ]
    },
    {
      id: "SPL4",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_500",
          label: "XSP_500"
        }
      ]
    },
    {
      id: "S1",
      label: "Key switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS1",
          label: "XS1"
        }
      ],
      engineering_component_name: "Key switch",
      engineering_manufacturer: "",
      primary_part_number: "M90206",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "M90206",
      gender: ""
    },
    {
      id: "Y3",
      label: "Fuel solenoid",
      category: "Solenoid",
      shape: "rectangle",
      connectors: [
        {
          id: "Y3",
          label: "Y3"
        }
      ],
      engineering_component_name: "Fuel solenoid",
      engineering_manufacturer: "",
      primary_part_number: "AT262963",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "AT262963",
      gender: ""
    },
    {
      id: "SPL5",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_754",
          label: "XSP_754"
        }
      ]
    },
    {
      id: "SPL6",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_755",
          label: "XSP_755"
        }
      ]
    },
    {
      id: "SPL7",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_757",
          label: "XSP_757"
        }
      ]
    },
    {
      id: "S8",
      label: "Brake switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS8",
          label: "XS8"
        }
      ],
      engineering_component_name: "Brake switch",
      engineering_manufacturer: "",
      primary_part_number: "57M14183",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M14183",
      gender: ""
    },
    {
      id: "S7",
      label: "Reverse switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS7",
          label: "XS7"
        }
      ],
      engineering_component_name: "Reverse switch",
      engineering_manufacturer: "",
      primary_part_number: "57M14183",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M14183",
      gender: ""
    },
    {
      id: "S4",
      label: "Seat switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS4",
          label: "XS4"
        }
      ],
      engineering_component_name: "Seat switch",
      engineering_manufacturer: "",
      primary_part_number: "57M7535",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M7535",
      gender: ""
    },
    {
      id: "SPL8",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_904",
          label: "XSP_904"
        }
      ]
    },
    {
      id: "SPL9",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_905",
          label: "XSP_905"
        }
      ]
    },
    {
      id: "SPL10",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_767",
          label: "XSP_767"
        }
      ]
    },
    {
      id: "K5",
      label: "Flasher",
      category: "Lamp",
      shape: "rectangle",
      connectors: [
        {
          id: "XK5",
          label: "XK5"
        }
      ],
      engineering_component_name: "Flasher",
      engineering_manufacturer: "",
      primary_part_number: "",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "",
      gender: ""
    },
    {
      id: "S13",
      label: "Hood Switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS13",
          label: "XS13"
        }
      ],
      engineering_component_name: "Hood Switch",
      engineering_manufacturer: "",
      primary_part_number: "",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "",
      gender: ""
    },
    {
      id: "SPL11",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_623",
          label: "XSP_623"
        }
      ]
    },
    {
      id: "SPL12",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_624",
          label: "XSP_624"
        }
      ]
    }
  ],
  connections: [
    {
      color: "black",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "20"
      },
      to: {
        componentId: "SPL1",
        connectorId: "XSP_100B",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "100AG",
        wireSize: 2.0,
        wireColor: "BK",
        wireLength: 597,
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
          cavity: "20"
        },
        to: {
          connectorNumber: "XSP_100B",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "pink",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "12"
      },
      to: {
        componentId: "S9",
        connectorId: "XS9",
        cavity: "C"
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
      color: "yellow",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "6"
      },
      to: {
        componentId: "SPL4",
        connectorId: "XSP_500",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "500AD",
        wireSize: 2.0,
        wireColor: "YE",
        wireLength: 602,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11548",
          sealPartNo: "",
          cavity: "6"
        },
        to: {
          connectorNumber: "XSP_500",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "yellow",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "19"
      },
      to: {
        componentId: "SPL4",
        connectorId: "XSP_500",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "500E",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 540,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "19"
        },
        to: {
          connectorNumber: "XSP_500",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "yellow",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "11"
      },
      to: {
        componentId: "SPL4",
        connectorId: "XSP_500",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "500F",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 602,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11548",
          sealPartNo: "",
          cavity: "11"
        },
        to: {
          connectorNumber: "XSP_500",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "pink",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "4"
      },
      to: {
        componentId: "S1",
        connectorId: "XS1",
        cavity: "A"
      },
      label: "",
      wireDetails: {
        circuitNumber: "591A",
        wireSize: 0.8,
        wireColor: "PK",
        wireLength: 958,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11548",
          sealPartNo: "",
          cavity: "4"
        },
        to: {
          connectorNumber: "XS1",
          devName: "Key switch",
          connPartNumber: "M90206",
          termPartNo: "57M8809",
          sealPartNo: "",
          cavity: "A"
        }
      }
    },
    {
      color: "pink",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "7"
      },
      to: {
        componentId: "Y3",
        connectorId: "Y3",
        cavity: "B"
      },
      label: "",
      wireDetails: {
        circuitNumber: "645A",
        wireSize: 0.8,
        wireColor: "PK",
        wireLength: 1319,
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
          cavity: "7"
        },
        to: {
          connectorNumber: "Y3",
          devName: "Fuel solenoid",
          connPartNumber: "AT262963",
          termPartNo: "57M9491",
          sealPartNo: "",
          cavity: "B"
        }
      }
    },
    {
      color: "blue",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "2"
      },
      to: {
        componentId: "SPL5",
        connectorId: "XSP_754",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "754B",
        wireSize: 0.8,
        wireColor: "BU",
        wireLength: 485,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "2"
        },
        to: {
          connectorNumber: "XSP_754",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "green",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "1"
      },
      to: {
        componentId: "SPL6",
        connectorId: "XSP_755",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "755B",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 144,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "1"
        },
        to: {
          connectorNumber: "XSP_755",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "blue",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "8"
      },
      to: {
        componentId: "SPL7",
        connectorId: "XSP_757",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "757A",
        wireSize: 0.8,
        wireColor: "BU",
        wireLength: 622,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11548",
          sealPartNo: "",
          cavity: "8"
        },
        to: {
          connectorNumber: "XSP_757",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "violet",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "5"
      },
      to: {
        componentId: "S8",
        connectorId: "XS8",
        cavity: "1"
      },
      label: "",
      wireDetails: {
        circuitNumber: "767A",
        wireSize: 0.8,
        wireColor: "VT",
        wireLength: 1212,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "5"
        },
        to: {
          connectorNumber: "XS8",
          devName: "Brake switch",
          connPartNumber: "57M14183",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "1"
        }
      }
    },
    {
      color: "blue",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "4"
      },
      to: {
        componentId: "S7",
        connectorId: "XS7",
        cavity: "8"
      },
      label: "",
      wireDetails: {
        circuitNumber: "772A",
        wireSize: 0.8,
        wireColor: "BU",
        wireLength: 1337,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "4"
        },
        to: {
          connectorNumber: "XS7",
          devName: "Reverse switch",
          connPartNumber: "57M14183",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "8"
        }
      }
    },
    {
      color: "pink",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "3"
      },
      to: {
        componentId: "S4",
        connectorId: "XS4",
        cavity: "4"
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
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "3"
        },
        to: {
          connectorNumber: "XS4",
          devName: "Seat switch",
          connPartNumber: "57M7535",
          termPartNo: "57M7546",
          sealPartNo: "",
          cavity: "4"
        }
      }
    },
    {
      color: "green",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "18"
      },
      to: {
        componentId: "SPL8",
        connectorId: "XSP_904",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "904C",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 343,
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
          cavity: "18"
        },
        to: {
          connectorNumber: "XSP_904",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "yellow",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "19"
      },
      to: {
        componentId: "SPL9",
        connectorId: "XSP_905",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "905C",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 343,
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
          cavity: "19"
        },
        to: {
          connectorNumber: "XSP_905",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "violet",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "5"
      },
      to: {
        componentId: "SPL10",
        connectorId: "XSP_767",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "767D",
        wireSize: 1.0,
        wireColor: "VT",
        wireLength: 0,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "5"
        },
        to: {
          connectorNumber: "XSP_767",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "yellow",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "13"
      },
      to: {
        componentId: "K5",
        connectorId: "XK5",
        cavity: "2"
      },
      label: "",
      wireDetails: {
        circuitNumber: "613A",
        wireSize: 2.0,
        wireColor: "YE",
        wireLength: 0,
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
          cavity: "13"
        },
        to: {
          connectorNumber: "XK5",
          devName: "Flasher",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "2"
        }
      }
    },
    {
      color: "green",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "5"
      },
      to: {
        componentId: "S13",
        connectorId: "XS13",
        cavity: "1"
      },
      label: "",
      wireDetails: {
        circuitNumber: "650A",
        wireSize: 1.0,
        wireColor: "GN",
        wireLength: 0,
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
          cavity: "5"
        },
        to: {
          connectorNumber: "XS13",
          devName: "Hood Switch",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "1"
        }
      }
    },
    {
      color: "green",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "15"
      },
      to: {
        componentId: "SPL11",
        connectorId: "XSP_623",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "623B",
        wireSize: 1.0,
        wireColor: "GN",
        wireLength: 0,
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
          cavity: "15"
        },
        to: {
          connectorNumber: "XSP_623",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "blue",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "13"
      },
      to: {
        componentId: "SPL12",
        connectorId: "XSP_624",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "624F",
        wireSize: 1.0,
        wireColor: "BU",
        wireLength: 0,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "13"
        },
        to: {
          connectorNumber: "XSP_624",
          devName: "Splice",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "L"
        }
      }
    },
    {
      color: "orange",
      from: {
        componentId: "B3",
        connectorId: "XB3",
        cavity: "1"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "16"
      },
      label: "",
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
    {
      color: "green",
      from: {
        componentId: "B1",
        connectorId: "XB1",
        cavity: "A"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "9"
      },
      label: "",
      wireDetails: {
        circuitNumber: "315A",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 1302,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XB1",
          devName: "Air restriction sensor",
          connPartNumber: "57M7254",
          termPartNo: "57M10770",
          sealPartNo: "57M7258",
          cavity: "A"
        },
        to: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "9"
        }
      }
    },
    {
      color: "yellow",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "8"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "15"
      },
      label: "",
      wireDetails: {
        circuitNumber: "506A",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 450,
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
          cavity: "8"
        },
        to: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "15"
        }
      }
    },
    {
      color: "yellow",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "11"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "16"
      },
      label: "",
      wireDetails: {
        circuitNumber: "515A",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 450,
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
          cavity: "11"
        },
        to: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "16"
        }
      }
    },
    {
      color: "red",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "48"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "10"
      },
      label: "",
      wireDetails: {
        circuitNumber: "595A",
        wireSize: 2.0,
        wireColor: "RD",
        wireLength: 512,
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
          cavity: "48"
        },
        to: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "10"
        }
      }
    },
    {
      color: "green",
      from: {
        componentId: "G2",
        connectorId: "XG2-3",
        cavity: "3"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "1"
      },
      label: "",
      wireDetails: {
        circuitNumber: "615A",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 1337,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XG2-3",
          devName: "Alternator",
          connPartNumber: "57M8928",
          termPartNo: "57M8404",
          sealPartNo: "57M8929",
          cavity: "3"
        },
        to: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11548",
          sealPartNo: "",
          cavity: "1"
        }
      }
    },
    {
      color: "green",
      from: {
        componentId: "H3",
        connectorId: "X3",
        cavity: "B"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "2"
      },
      label: "",
      wireDetails: {
        circuitNumber: "617A",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 1992,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "X3",
          devName: "Main Chassis to FMI Monitor Harness Connector",
          connPartNumber: "57M7255",
          termPartNo: "57M10770",
          sealPartNo: "57M9215",
          cavity: "B"
        },
        to: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11548",
          sealPartNo: "",
          cavity: "2"
        }
      }
    },
    {
      color: "green",
      from: {
        componentId: "B2",
        connectorId: "XB2",
        cavity: "A"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "10"
      },
      label: "",
      wireDetails: {
        circuitNumber: "620A",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 1566,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XB2",
          devName: "Oil Pressure Switch",
          connPartNumber: "57M9614",
          termPartNo: "57M9614",
          sealPartNo: "",
          cavity: "A"
        },
        to: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "10"
        }
      }
    },
    {
      color: "violet",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "19"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "11"
      },
      label: "",
      wireDetails: {
        circuitNumber: "721A",
        wireSize: 0.8,
        wireColor: "VT",
        wireLength: 450,
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
          cavity: "19"
        },
        to: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "11"
        }
      }
    },
    {
      color: "blue",
      from: {
        componentId: "H6",
        connectorId: "X6",
        cavity: "B"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "14"
      },
      label: "",
      wireDetails: {
        circuitNumber: "740A",
        wireSize: 0.8,
        wireColor: "BU",
        wireLength: 2181,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "X6",
          devName: "Main Chassis Harness to PTO Switch Harness Connector",
          connPartNumber: "T24167",
          termPartNo: "57M8810",
          sealPartNo: "",
          cavity: "B"
        },
        to: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "14"
        }
      }
    },
    {
      color: "blue",
      from: {
        componentId: "H6",
        connectorId: "X6",
        cavity: "A"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "6"
      },
      label: "",
      wireDetails: {
        circuitNumber: "742A",
        wireSize: 0.8,
        wireColor: "BU",
        wireLength: 2119,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "X6",
          devName: "Main Chassis Harness to PTO Switch Harness Connector",
          connPartNumber: "T24167",
          termPartNo: "57M8810",
          sealPartNo: "",
          cavity: "A"
        },
        to: {
          connectorNumber: "XJ2",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12920",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "6"
        }
      }
    },
    {
      color: "pink",
      from: {
        componentId: "H1",
        connectorId: "X1",
        cavity: "C"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "9"
      },
      label: "",
      wireDetails: {
        circuitNumber: "815A",
        wireSize: 1.0,
        wireColor: "PK",
        wireLength: 2203,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "X1",
          devName: "Main Chassis to Rear Lighting Harness",
          connPartNumber: "57M8841",
          termPartNo: "57M9203",
          sealPartNo: "",
          cavity: "C"
        },
        to: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11548",
          sealPartNo: "",
          cavity: "9"
        }
      }
    },
    {
      color: "white",
      from: {
        componentId: "B4",
        connectorId: "XB4",
        cavity: "A"
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "17"
      },
      label: "",
      wireDetails: {
        circuitNumber: "900A",
        wireSize: 0.8,
        wireColor: "WH",
        wireLength: 1901,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XB4",
          devName: "Fuel level senser",
          connPartNumber: "57M7309",
          termPartNo: "57M7297",
          sealPartNo: "57M9219",
          cavity: "A"
        },
        to: {
          connectorNumber: "XJ1",
          devName: "Instrument Cluster Controller",
          connPartNumber: "57M12666",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "17"
        }
      }
    }
  ],
  probableCauses: [
    "Open or damaged wiring between ICC and Starter Relay",
    "Loose, corroded, or damaged connectors at ICC, relay, or splices",
    "Faulty Starter Relay with internal open circuit",
    "Instrument Cluster Controller (ICC) not providing output signal",
    "Blown fuse or protection circuit in starter relay control"
  ],
  steps: [
    "Visually inspect wiring from ICC to Starter Relay for cuts, chafing, or damage",
    "Check connectors at ICC (XJ1/XJ2), Starter Relay, and splice points (e.g., SPL11, SPL12) for corrosion or poor fit",
    "Check continuity of wires from ICC output to Starter Relay coil",
    "Test Starter Relay separately to ensure proper switching",
    "Check ICC output signal at cavity 13 (XJ1) when attempting to start",
    "Repair damaged wires or connectors, replace faulty relay, or replace ICC if necessary",
    "Clear DTC and attempt engine start to verify repair"
  ],
  vedioUrl: "https://www.youtube.com/embed/gaelXhngh5A"
};

export const DTC_MAP: Record<string, any> = {
  "ICC 000677.31": DTC_StarterCoolDown,
  "ICC 000677.03": DTC_StarterRelayPower,
  "ICC 000677.04": DTC_StarterRelayGround,
  "ICC 000677.05": DTC_ICC,
};
