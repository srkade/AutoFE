const CrankingSystem = {
  code: "8",
  name: "Cranking System",
  masterComponents: ["Y2","W1","X90","G2","S3"],
  components: [
    {
      id: "S3",
      label: "PTO switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS3",
          label: "XS3"
        }
      ],
      engineering_component_name: "PTO switch",
      engineering_manufacturer: "Bosch",
      primary_part_number: "M133149",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "DeltaSystem",
      connector_part_number: "M133149",
      gender: "Female"
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
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M14183",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "Molex",
      connector_part_number: "57M14183",
      gender: "Female"
    },
    
    {
      id: "S8",
      label: "Brake Switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS8",
          label: "XS8"
        }
      ],
      engineering_component_name: "Brake Switch",
      engineering_manufacturer: "",
      primary_part_number: "",
      harness_name: "TAILLIGHT WIRING HARNESS (W2)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "",
      gender: ""
    },
     {
      id: "Y2",
      label: "Starter Motor Solenoid",
      category: "Solenoid",
      shape: "rectangle",
      connectors: [
        {
          id: "XY1",
          label: "XY1"
        }
      ],
      engineering_component_name: "Starter Motor Solenoid",
      engineering_manufacturer: "",
      primary_part_number: "57M8820",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M8820",
      gender: ""
    },
    {
      id: "W1",
      label: "Ground",
      category: "Ground",
      shape: "rectangle",
      connectors: [
        {
          id: "XW1",
          label: "XW1"
        }
      ],
      engineering_component_name: "Ground",
      engineering_manufacturer: "",
      primary_part_number: "57M11990",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M11990",
      gender: ""
    },
    {
      id: "G1",
      label: "Battery",
      category: "Battery",
      shape: "rectangle",
      connectors: [
        {
          id: "XG1",
          label: "XG1"
        }
      ],
      engineering_component_name: "Battery",
      engineering_manufacturer: "",
      primary_part_number: "",
      harness_name: "BATTERY NEGATIVE (W7)",
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
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "",
      gender: ""
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
      engineering_manufacturer: "Bosch",
      primary_part_number: "M90206",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "Delphi",
      connector_part_number: "M90206",
      gender: "Female"
    },
    {
      id: "ICC",
      label: "Instrument Cluster Controller",
      category: "Transistor",
      shape: "rectangle",
      connectors: [
        {
          id: "J2",
          label: "XJ1"
        },
        {
          id: "J1",
          label: "XJ2"
        }
      ],
      engineering_component_name: "Instrument Cluster Controller",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M12666",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "Molex",
      connector_part_number: "57M12666",
      gender: "Female"
    },
    {
      id: "G2",
      label: "Alternator",
      category: "Motor",
      shape: "rectangle",
      connectors: [
        {
          id: "XG2-1",
          label: "XG2-1"
        },
        {
          id: "XG2-3",
          label: "XG2-3"
        }
      ],
      engineering_component_name: "Alternator",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M11530",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "Delphi",
      connector_part_number: "57M11530",
      gender: "Female"
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
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M7535",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "Deutsch",
      connector_part_number: "57M7535",
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
          label: "X90"
        }
      ],
      engineering_component_name: "Load center",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M13428",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "GEP",
      connector_part_number: "57M13428",
      gender: "Female"
    },
    {
      id: "M1",
      label: "Starter Motor",
      category: "Motor",
      shape: "rectangle",
      connectors: [
        {
          id: "XM1",
          label: "XM1"
        }
      ],
      engineering_component_name: "Starter Motor",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M11989",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "ALPHA",
      connector_part_number: "57M11989",
      gender: "Female"
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
      id: "SPL2",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_100A",
          label: "XSP_100A"
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
          id: "XSP_201_FL",
          label: "XSP_201_FL"
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
          id: "XSP_GLOW_FL",
          label: "XSP_GLOW_FL"
        }
      ]
    },
    {
      id: "SPL5",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_FUEL_FL",
          label: "XSP_FUEL_FL"
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
      id: "SPL6",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_401",
          label: "XSP_401"
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
          id: "XSP_450",
          label: "XSP_450"
        }
      ]
    },
    {
      id: "SPL8",
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
      id: "S2",
      label: "Power port switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS2",
          label: "XS2"
        }
      ],
      engineering_component_name: "Power port switch",
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
      id: "Y1",
      label: "Start motor solenoid",
      category: "Solenoid",
      shape: "rectangle",
      connectors: [
        {
          id: "Y1",
          label: "Y1"
        }
      ],
      engineering_component_name: "Start motor solenoid",
      engineering_manufacturer: "",
      primary_part_number: "57M8820",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M8820",
      gender: ""
    },
    {
      id: "SPL9",
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
      id: "SPL10",
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
      id: "SPL11",
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
      id: "R1",
      label: "Glow plugs",
      category: "Actuator",
      shape: "rectangle",
      connectors: [
        {
          id: "XR1",
          label: "XR1"
        }
      ],
      engineering_component_name: "Glow plugs",
      engineering_manufacturer: "",
      primary_part_number: "57M10147",
      harness_name: "",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M10147",
      gender: ""
    },
    {
      id: "SPL12",
      label: "Splice",
      category: "Splice",
      shape: "circle",
      connectors: [
        {
          id: "XSP_205",
          label: "XSP_205"
        }
      ]
    },
    {
      id: "K4",
      label: "Power Port Relay",
      category: "Relay",
      shape: "rectangle",
      connectors: [
        {
          id: "XK4",
          label: "XK4"
        }
      ],
      engineering_component_name: "Power Port Relay",
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
      id: "SPL13",
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
   
  ],
  connections: [
    {
      color: "black",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "28"
      },
      to: {
        componentId: "SPL1",
        connectorId: "XSP_100B",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "100C",
        wireSize: 0.8,
        wireColor: "BK",
        wireLength: 206,
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
          cavity: "28"
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "21"
      },
      to: {
        componentId: "SPL2",
        connectorId: "XSP_100A",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "100V",
        wireSize: 0.8,
        wireColor: "BK",
        wireLength: 1246,
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
          cavity: "21"
        },
        to: {
          connectorNumber: "XSP_100A",
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "10"
      },
      to: {
        componentId: "SPL1",
        connectorId: "XSP_100B",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "100W",
        wireSize: 0.8,
        wireColor: "BK",
        wireLength: 206,
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "3"
      },
      to: {
        componentId: "SPL1",
        connectorId: "XSP_100B",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "100X",
        wireSize: 0.8,
        wireColor: "BK",
        wireLength: 206,
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
          cavity: "3"
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "16"
      },
      to: {
        componentId: "SPL1",
        connectorId: "XSP_100B",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "100Y",
        wireSize: 0.8,
        wireColor: "BK",
        wireLength: 206,
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
          cavity: "16"
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "32"
      },
      to: {
        componentId: "SPL2",
        connectorId: "XSP_100A",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "100Z",
        wireSize: 2.0,
        wireColor: "BK",
        wireLength: 935,
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
          cavity: "32"
        },
        to: {
          connectorNumber: "XSP_100A",
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
      from: {
        componentId: "G2",
        connectorId: "XG2-1",
        cavity: "1"
      },
      to: {
        componentId: "M1",
        connectorId: "XM1",
        cavity: "1"
      },
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
      color: "red",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "9"
      },
      to: {
        componentId: "SPL3",
        connectorId: "XSP_201_FL",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "201A",
        wireSize: 3.0,
        wireColor: "RD",
        wireLength: 644,
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
          cavity: "9"
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "34"
      },
      to: {
        componentId: "SPL3",
        connectorId: "XSP_201_FL",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "201B",
        wireSize: 3.0,
        wireColor: "RD",
        wireLength: 644,
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
          cavity: "34"
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "42"
      },
      to: {
        componentId: "SPL3",
        connectorId: "XSP_201_FL",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "201C",
        wireSize: 3.0,
        wireColor: "RD",
        wireLength: 644,
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
          cavity: "42"
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "44"
      },
      to: {
        componentId: "SPL3",
        connectorId: "XSP_201_FL",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "201D",
        wireSize: 3.0,
        wireColor: "RD",
        wireLength: 644,
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
          cavity: "44"
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "46"
      },
      to: {
        componentId: "S1",
        connectorId: "XS1",
        cavity: "B"
      },
      label: "",
      wireDetails: {
        circuitNumber: "204A",
        wireSize: 1.0,
        wireColor: "RD",
        wireLength: 673,
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
          cavity: "46"
        },
        to: {
          connectorNumber: "XS1",
          devName: "Key switch",
          connPartNumber: "M90206",
          termPartNo: "U46662",
          sealPartNo: "",
          cavity: "B"
        }
      }
    },
    // {
    //   color: "red",
    //   from: {
    //     componentId: "X90",
    //     connectorId: "X90",
    //     cavity: "27"
    //   },
    //   to: {
    //     componentId: "X90",
    //     connectorId: "X90",
    //     cavity: "38"
    //   },
    //   label: "",
    //   wireDetails: {
    //     circuitNumber: "207A",
    //     wireSize: 2.0,
    //     wireColor: "RD",
    //     wireLength: 100,
    //     wireType: "Regular",
    //     twistId: "",
    //     shieldId: "",
    //     wireOption: "",
    //     mark: "",
    //     from: {
    //       connectorNumber: "X90",
    //       devName: "Load center",
    //       connPartNumber: "57M13428",
    //       termPartNo: "57M7491",
    //       sealPartNo: "57M9219",
    //       cavity: "27"
    //     },
    //     to: {
    //       connectorNumber: "X90",
    //       devName: "Load center",
    //       connPartNumber: "57M13428",
    //       termPartNo: "57M7491",
    //       sealPartNo: "57M9219",
    //       cavity: "38"
    //     }
    //   }
    // },
    {
      color: "red",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "7"
      },
      to: {
        componentId: "SPL4",
        connectorId: "XSP_GLOW_FL",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "272A",
        wireSize: 3.0,
        wireColor: "RD",
        wireLength: 637,
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
          cavity: "7"
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
    },
    {
      color: "red",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "15"
      },
      to: {
        componentId: "SPL5",
        connectorId: "XSP_FUEL_FL",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "273A",
        wireSize: 3.0,
        wireColor: "RD",
        wireLength: 639,
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
          cavity: "15"
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
      color: "yellow",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "47"
      },
      to: {
        componentId: "S9",
        connectorId: "XS9",
        cavity: "D"
      },
      label: "",
      wireDetails: {
        circuitNumber: "400A",
        wireSize: 1.0,
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
      color: "yellow",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "43"
      },
      to: {
        componentId: "SPL6",
        connectorId: "XSP_401",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "401A",
        wireSize: 1.0,
        wireColor: "YE",
        wireLength: 174,
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
          cavity: "43"
        },
        to: {
          connectorNumber: "XSP_401",
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
        componentId: "X90",
        connectorId: "X90",
        cavity: "35"
      },
      to: {
        componentId: "SPL6",
        connectorId: "XSP_401",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "401B",
        wireSize: 2.0,
        wireColor: "YE",
        wireLength: 174,
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
          cavity: "35"
        },
        to: {
          connectorNumber: "XSP_401",
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
        componentId: "X90",
        connectorId: "X90",
        cavity: "2"
      },
      to: {
        componentId: "SPL6",
        connectorId: "XSP_401",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "401C",
        wireSize: 3.0,
        wireColor: "YE",
        wireLength: 174,
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
          cavity: "2"
        },
        to: {
          connectorNumber: "XSP_401",
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
        componentId: "X90",
        connectorId: "X90",
        cavity: "30"
      },
      to: {
        componentId: "SPL7",
        connectorId: "XSP_450",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "450B-1",
        wireSize: 1.0,
        wireColor: "YE",
        wireLength: 0,
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
          cavity: "30"
        },
        to: {
          connectorNumber: "XSP_450",
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
        componentId: "X90",
        connectorId: "X90",
        cavity: "36"
      },
      to: {
        componentId: "SPL7",
        connectorId: "XSP_450",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "450C-1",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 0,
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
          cavity: "36"
        },
        to: {
          connectorNumber: "XSP_450",
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
        componentId: "X90",
        connectorId: "X90",
        cavity: "1"
      },
      to: {
        componentId: "SPL8",
        connectorId: "XSP_500",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "500AH",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 317,
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
          cavity: "1"
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
        componentId: "G2",
        connectorId: "XG2-3",
        cavity: "2"
      },
      to: {
        componentId: "SPL8",
        connectorId: "XSP_500",
        cavity: "L"
      },
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
      color: "yellow",
      from: {
        componentId: "S4",
        connectorId: "XS4",
        cavity: "2"
      },
      to: {
        componentId: "SPL8",
        connectorId: "XSP_500",
        cavity: "L"
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
      color: "yellow",
      from: {
        componentId: "S8",
        connectorId: "XS8",
        cavity: "5"
      },
      to: {
        componentId: "SPL8",
        connectorId: "XSP_500",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "500D",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 1079,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS8",
          devName: "Brake switch",
          connPartNumber: "57M14183",
          termPartNo: "",
          sealPartNo: "",
          cavity: "5"
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
        componentId: "S7",
        connectorId: "XS7",
        cavity: "1"
      },
      to: {
        componentId: "SPL8",
        connectorId: "XSP_500",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "500G",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 602,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS7",
          devName: "Reverse switch",
          connPartNumber: "57M14183",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "1"
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
        componentId: "S7",
        connectorId: "XS7",
        cavity: "4"
      },
      to: {
        componentId: "SPL8",
        connectorId: "XSP_500",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "500H",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 1204,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS7",
          devName: "Reverse switch",
          connPartNumber: "57M14183",
          termPartNo: "57M11448",
          sealPartNo: "",
          cavity: "4"
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
        componentId: "S3",
        connectorId: "XS3",
        cavity: "1"
      },
      to: {
        componentId: "SPL8",
        connectorId: "XSP_500",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "500J",
        wireSize: 0.8,
        wireColor: "YE",
        wireLength: 450,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS3",
          devName: "PTO switch",
          connPartNumber: "M133149",
          termPartNo: "57M8810",
          sealPartNo: "",
          cavity: "1"
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
        componentId: "S1",
        connectorId: "XS1",
        cavity: "E"
      },
      to: {
        componentId: "SPL8",
        connectorId: "XSP_500",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "500P",
        wireSize: 1.0,
        wireColor: "YE",
        wireLength: 356,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS1",
          devName: "Key switch",
          connPartNumber: "M90206",
          termPartNo: "U46662",
          sealPartNo: "",
          cavity: "E"
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
        componentId: "X90",
        connectorId: "X90",
        cavity: "8"
      },
      to: {
        componentId: "ICC",
        connectorId: "J1",
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
        connectorId: "J1",
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
        cavity: "39"
      },
      to: {
        componentId: "S2",
        connectorId: "XS2",
        cavity: "C"
      },
      label: "",
      wireDetails: {
        circuitNumber: "592A",
        wireSize: 2.0,
        wireColor: "RD",
        wireLength: 540,
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
          cavity: "39"
        },
        to: {
          connectorNumber: "XS2",
          devName: "Power port switch",
          connPartNumber: "57M9361",
          termPartNo: "57M9200",
          sealPartNo: "",
          cavity: "C"
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
        connectorId: "J2",
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
        connectorId: "J2",
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
      color: "white",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "12"
      },
      to: {
        componentId: "Y3",
        connectorId: "Y3",
        cavity: "C"
      },
      label: "",
      wireDetails: {
        circuitNumber: "680A",
        wireSize: 3.0,
        wireColor: "WH",
        wireLength: 1034,
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
          cavity: "12"
        },
        to: {
          connectorNumber: "Y3",
          devName: "Fuel solenoid",
          connPartNumber: "AT262963",
          termPartNo: "57M9491",
          sealPartNo: "",
          cavity: "C"
        }
      }
    },
    {
      color: "violet",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "20"
      },
      to: {
        componentId: "Y1",
        connectorId: "Y1",
        cavity: "1"
      },
      label: "",
      wireDetails: {
        circuitNumber: "720A",
        wireSize: 2.0,
        wireColor: "VT",
        wireLength: 986,
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
          cavity: "20"
        },
        to: {
          connectorNumber: "Y1",
          devName: "Start motor solenoid",
          connPartNumber: "57M8820",
          termPartNo: "57M7497",
          sealPartNo: "",
          cavity: "1"
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
        connectorId: "J1",
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
      color: "bu",
      from: {
        componentId: "S3",
        connectorId: "XS3",
        cavity: "6"
      },
      to: {
        componentId: "SPL9",
        connectorId: "XSP_754",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "754A",
        wireSize: 0.8,
        wireColor: "BU",
        wireLength: 505,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS3",
          devName: "PTO switch",
          connPartNumber: "M133149",
          termPartNo: "57M8810",
          sealPartNo: "",
          cavity: "6"
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
        componentId: "S3",
        connectorId: "XS3",
        cavity: "3"
      },
      to: {
        componentId: "SPL10",
        connectorId: "XSP_755",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "755A",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 846,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS3",
          devName: "PTO switch",
          connPartNumber: "M133149",
          termPartNo: "57M8810",
          sealPartNo: "",
          cavity: "3"
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
      color: "green",
      from: {
        componentId: "S3",
        connectorId: "XS3",
        cavity: "4"
      },
      to: {
        componentId: "SPL10",
        connectorId: "XSP_755",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "755D",
        wireSize: 0.8,
        wireColor: "GN",
        wireLength: 846,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS3",
          devName: "PTO switch",
          connPartNumber: "M133149",
          termPartNo: "57M8810",
          sealPartNo: "",
          cavity: "4"
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
      color: "bu",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "17"
      },
      to: {
        componentId: "SPL11",
        connectorId: "XSP_757",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "757B",
        wireSize: 0.8,
        wireColor: "BU",
        wireLength: 231,
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
          cavity: "17"
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
      color: "white",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "4"
      },
      to: {
        componentId: "R1",
        connectorId: "XR1",
        cavity: "1"
      },
      label: "",
      wireDetails: {
        circuitNumber: "784A",
        wireSize: 3.0,
        wireColor: "WH",
        wireLength: 1030,
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
          cavity: "4"
        },
        to: {
          connectorNumber: "XR1",
          devName: "Glow plugs",
          connPartNumber: "57M10147",
          termPartNo: "57M10148",
          sealPartNo: "",
          cavity: "1"
        }
      }
    },
    {
      color: "red",
      from: {
        componentId: "G2",
        connectorId: "XG2-3",
        cavity: "1"
      },
      to: {
        componentId: "SPL3",
        connectorId: "XSP_201_FL",
        cavity: "L"
      },
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
      from: {
        componentId: "G2",
        connectorId: "XG2-3",
        cavity: "1"
      },
      to: {
        componentId: "SPL5",
        connectorId: "XSP_FUEL_FL",
        cavity: "L"
      },
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
      from: {
        componentId: "G2",
        connectorId: "XG2-3",
        cavity: "1"
      },
      to: {
        componentId: "SPL4",
        connectorId: "XSP_GLOW_FL",
        cavity: "L"
      },
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
    },
    {
      color: "red",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "38"
      },
      to: {
        componentId: "SPL12",
        connectorId: "XSP_205",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "205A",
        wireSize: 1.0,
        wireColor: "RD",
        wireLength: 0,
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
          cavity: "38"
        },
        to: {
          connectorNumber: "XSP_205",
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "27"
      },
      to: {
        componentId: "S2",
        connectorId: "XS2",
        cavity: "B"
      },
      label: "",
      wireDetails: {
        circuitNumber: "203A",
        wireSize: 1.0,
        wireColor: "RD",
        wireLength: 0,
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
          cavity: "27"
        },
        to: {
          connectorNumber: "XS2",
          devName: "Power port switch",
          connPartNumber: "57M9361",
          termPartNo: "57M9200",
          sealPartNo: "",
          cavity: "B"
        }
      }
    },
    {
      color: "red",
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "35"
      },
      to: {
        componentId: "SPL12",
        connectorId: "XSP_205",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "205C",
        wireSize: 1.0,
        wireColor: "RD",
        wireLength: 0,
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
          cavity: "35"
        },
        to: {
          connectorNumber: "XSP_205",
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
      from: {
        componentId: "X90",
        connectorId: "X90",
        cavity: "39"
      },
      to: {
        componentId: "K4",
        connectorId: "XK4",
        cavity: "31"
      },
      label: "",
      wireDetails: {
        circuitNumber: "206A",
        wireSize: 1.0,
        wireColor: "RD",
        wireLength: 0,
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
          cavity: "39"
        },
        to: {
          connectorNumber: "XK4",
          devName: "Power Port Relay",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "31"
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
        componentId: "S1",
        connectorId: "XS1",
        cavity: "B"
      },
      label: "",
      wireDetails: {
        circuitNumber: "202C",
        wireSize: 1.0,
        wireColor: "RD",
        wireLength: 0,
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
          connectorNumber: "XS1",
          devName: "Key switch",
          connPartNumber: "M90206",
          termPartNo: "U46662",
          sealPartNo: "",
          cavity: "B"
        }
      }
    },
    {
      color: "violet",
      from: {
        componentId: "S8",
        connectorId: "XS8",
        cavity: "1"
      },
      to: {
        componentId: "SPL13",
        connectorId: "XSP_767",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "767G",
        wireSize: 1.0,
        wireColor: "VT",
        wireLength: 0,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS8",
          devName: "Brake switch",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "1"
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
        componentId: "S13",
        connectorId: "XS13",
        cavity: "D"
      },
      to: {
        componentId: "SPL8",
        connectorId: "XSP_500",
        cavity: "L"
      },
      label: "",
      wireDetails: {
        circuitNumber: "500L",
        wireSize: 1.0,
        wireColor: "YE",
        wireLength: 0,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS13",
          devName: "Hood Switch",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "D"
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
      color: "red",
      from: {
        componentId: "G1",
        connectorId: "XG1",
        cavity: "B"
      },
      to: {
        componentId: "Y2",
        connectorId: "XY1",
        cavity: "A"
      },
      label: "",
      wireDetails: {
        circuitNumber: "RD",
        wireSize: 1.0,
        wireColor: "RD",
        wireLength: 0,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XG1",
          devName: "Battery",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "B"
        },
        to: {
          connectorNumber: "XY1",
          devName: "Starter Motor Solenoid",
          connPartNumber: "57M8820",
          termPartNo: "57M7497",
          sealPartNo: "",
          cavity: "A"
        }
      }
    },
    {
      color: "black",
      from: {
        componentId: "G1",
        connectorId: "XG1",
        cavity: "1"
      },
      to: {
        componentId: "W1",
        connectorId: "XW1",
        cavity: "1"
      },
      label: "",
      wireDetails: {
        circuitNumber: "BK",
        wireSize: 2.0,
        wireColor: "BK",
        wireLength: 450,
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XG1",
          devName: "Battery",
          connPartNumber: "",
          termPartNo: "",
          sealPartNo: "",
          cavity: "1"
        },
        to: {
          connectorNumber: "XW1",
          devName: "Ground",
          connPartNumber: "57M11990",
          termPartNo: "57M11990",
          sealPartNo: "",
          cavity: "1"
        }
      }
    }
  ]
};

export default CrankingSystem;