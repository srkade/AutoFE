const ChargingSystem = {
  code: "7",
  name: "Charging System",
  masterComponents: ["X90","G2","G1"],
  components: [
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
      remove: true,
      manufacturer: "",
      connector_part_number: "",
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
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M11990",
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
      remove: true,
      manufacturer: "Delphi",
      connector_part_number: "M90206",
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
        }
      ],
      engineering_component_name: "Alternator",
      engineering_manufacturer: "Bosch",
      primary_part_number: "57M11530",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: true,
      manufacturer: "Delphi",
      connector_part_number: "57M11530",
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
      remove: true,
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
      remove: true,
      manufacturer: "ALPHA",
      connector_part_number: "57M11989",
      gender: "Female"
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
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M9361",
      gender: ""
    },
    {
      id: "J2",
      label: "Instrument Cluster Controller",
      category: "Transistor",
      shape: "rectangle",
      connectors: [
        {
          id: "XJ2",
          label: "XJ2"
        }
      ],
      engineering_component_name: "Instrument Cluster Controller",
      engineering_manufacturer: "",
      primary_part_number: "57M12920",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M12920",
      gender: ""
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
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M9361",
      gender: ""
    },
    {
      id: "J1",
      label: "Instrument Cluster Controller",
      category: "Transistor",
      shape: "rectangle",
      connectors: [
        {
          id: "XJ1",
          label: "XJ1"
        }
      ],
      engineering_component_name: "Instrument Cluster Controller",
      engineering_manufacturer: "",
      primary_part_number: "57M12666",
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M12666",
      gender: ""
    },
    {
      id: "Y3",
      label: "Fuel solenoid",
      category: "Component",
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
      harness_name: "MAIN WIRING HARNESS (W1)",
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
      category: "Component",
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
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M8820",
      gender: ""
    },
    {
      id: "R1",
      label: "Glow plugs",
      category: "Resistor",
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
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "57M10147",
      gender: ""
    },
    {
      id: "K4",
      label: "Power Port Relay",
      category: "Component",
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
      harness_name: "MAIN WIRING HARNESS (W1)",
      component_type: "Component",
      connector_type: "Direct",
      remove: false,
      manufacturer: "",
      connector_part_number: "",
      gender: ""
    },
    
  ],
  connections: [
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
        cavity: "8"
      },
      to: {
        componentId: "J2",
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
        componentId: "J2",
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
        componentId: "J1",
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
        componentId: "J2",
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

export default ChargingSystem;