const ICC = {
  code: "ICC",
  name: "Instrument Cluster Controller",
  masterComponents: ["ICC"],
  components: [
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
        {
          id: "XJ2",
          label: "XJ2",
        },
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
    // {
    //   id: "SPL_757",
    //   label: "Splice",
    //   category: "Splice",
    //   shape: "circle",
    //   connectors: [
    //     {
    //       id: "XSP_757",
    //       label: "XSP_757",
    //     },
    //   ],
    // },
    {
      id: "FS",
      label: "Fuel solenoid",
      category: "Fuel solenoid",
      shape: "rectangle",
      connectors: [
        {
          id: "Y3",
          label: "Y3",
        },
      ],
    },
    {
      id: "ALT",
      label: "Alternator",
      category: "Motor",
      shape: "rectangle",
      connectors: [
        {
          id: "XG2-3",
          label: "XG2-3",
        },
      ],
    },
    {
      id: "MCFMHC",
      label: "Main Chassis to FMI Monitor Harness Connector",
      category: "Sensor",
      shape: "rectangle",
      connectors: [
        {
          id: "X3",
          label: "X3",
        },
      ],
    },
    {
      id: "MCRLH",
      label: "Main Chassis to Rear Lighting Harness",
      category: "",
      shape: "rectangle",
      connectors: [
        {
          id: "X1",
          label: "X1",
        },
      ],
    },
    {
      id: "FLS",
      label: "Fuel level sensor",
      category: "Sensor",
      shape: "rectangle",
      connectors: [
        {
          id: "XB4",
          label: "XB4",
        },
      ],
    },
    // {
    //   id: "SPL_904",
    //   label: "Splice",
    //   category: "Splice",
    //   shape: "circle",
    //   connectors: [
    //     {
    //       id: "XSP_904",
    //       label: "XSP_904",
    //     },
    //   ],
    // },
    // {
    //   id: "SPL_905",
    //   label: "Splice",
    //   category: "Splice",
    //   shape: "circle",
    //   connectors: [
    //     {
    //       id: "XSP_905",
    //       label: "XSP_905",
    //     },
    //   ],
    // },
    {
      id: "FLSH",
      label: "Flasher",
      category: "Lamp",
      shape: "rectangle",
      connectors: [
        {
          id: "XK5",
          label: "XK5",
        },
      ],
    },
    {
      id: "HS",
      label: "Hood Switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS13",
          label: "XS13",
        },
      ],
    },
    // {
    //   id: "SPL_623",
    //   label: "Splice",
    //   category: "Splice",
    //   shape: "circle",
    //   connectors: [
    //     {
    //       id: "XSP_623",
    //       label: "XSP_623",
    //     },
    //   ],
    // },
    // {
    //   id: "SPL_100B",
    //   label: "Splice",
    //   category: "Splice",
    //   shape: "circle",
    //   connectors: [
    //     {
    //       id: "XSP_100B",
    //       label: "XSP_100B",
    //     },
    //   ],
    // },
    {
      id: "CTS",
      label: "Coolant Temperature Sensor",
      category: "Sensor",
      shape: "rectangle",
      connectors: [
        {
          id: "XB3",
          label: "XB3",
        },
      ],
    },
    {
      id: "LS",
      label: "Light Switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS9",
          label: "XS9",
        },
      ],
    },
    {
      id: "KS",
      label: "Key Switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS1",
          label: "XS1",
        },
      ],
    }, 
        {
      id: "ARS",
      label: "Air Restriction Sensor",
      category: "Sensor",
      shape: "rectangle",
      connectors: [
        {
          id: "XB1",
          label: "XB1",
        },
      ],
    },
    {
      id: "OPS",
      label: "Oil Pressure Switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XB2",
          label: "XB2",
        },
      ],
    },
    // {
    //   id: "SPL_754",
    //   label: "Splice",
    //   category: "Splice",
    //   shape: "circle",
    //   connectors: [
    //     {
    //       id: "XSP_754",
    //       label: "XSP_754",
    //     },
    //   ],
    // },
    // {
    //   id: "SPL_755",
    //   label: "Splice",
    //   category: "Splice",
    //   shape: "circle",
    //   connectors: [
    //     {
    //       id: "XSP_755",
    //       label: "XSP_755",
    //     },
    //   ],
    // },
    {
      id: "BS",
      label: "Break switch",
      category: "switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS8",
          label: "XS8",
        },
      ],
    },
    {
      id: "RS",
      label: "Reverse switch",
      category: "Switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS7",
          label: "XS7",
        },
      ],
    },
    {
      id: "SS",
      label: "Seat switch",
      category: "switch",
      shape: "rectangle",
      connectors: [
        {
          id: "XS4",
          label: "XS4",
        },
      ],
    },
    // {
    //   id: "SPL_767",
    //   label: "Splice",
    //   category: "Splice",
    //   shape: "circle",
    //   connectors: [
    //     {
    //       id: "XSP_767",
    //       label: "XSP_767",
    //     },
    //   ],
    // },
    // {
    //   id: "SPL_624",
    //   label: "Splice",
    //   category: "Splice",
    //   shape: "circle",
    //   connectors: [
    //     {
    //       id: "XSP_624",
    //       label: "XSP_624",
    //     },
    //   ],
    // },
           {
      id: "MCHPTO",
      label: "Main Chassis Harness to PTO Switch Harness Connector",
      category: "Connector",
      shape: "rectangle",
      connectors: [
        {
          id: "X6",
          label: "X6",
        },
      ],
    },
    // {
    //   id: "SPL_500",
    //   label: "Splice",
    //   category: "Splice",
    //   shape: "circle",
    //   connectors: [
    //     {
    //       id: "XSP_500",
    //       label: "XSP_500",
    //     },
    //   ],
    // },
    {
      id: "LC",
      label: "Load Center",
      category: "Transformer",
      shape: "rectangle",
      connectors: [
        {
          id: "X90",
          label: "X90",
        },
      ],
    },
  ],
  connections: [
    // {
    //   color: "blue",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ1",
    //     cavity: "8",
    //   },
    //   to: { componentId: "SPL_757", connectorId: "XSP_757", cavity: "L" },
    //   label: "",
    // },
    {
      color: "pink",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "7",
      },
      to: { componentId: "FS", connectorId: "Y3", cavity: "B" },
      label: "",
    },
    {
      color: "green",
      from: { componentId: "ALT", connectorId: "XG2-3", cavity: "3" },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "1",
      },
      label: "",
    },
    {
      color: "green",
      from: {
        componentId: "MCFMHC",
        connectorId: "X3",
        cavity: "B",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "2",
      },
      label: "",
    },
    {
      color: "pink",
      from: {
        componentId: "MCRLH",
        connectorId: "X1",
        cavity: "C",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "9",
      },
      label: "",
    },
    {
      color: "white",
      from: {
        componentId: "FLS",
        connectorId: "XB4",
        cavity: "A",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "17",
      },
      label: "",
    },
    // {
    //   color: "green",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ1",
    //     cavity: "18",
    //   },
    //   to: { componentId: "SPL_904", connectorId: "XSP_904", cavity: "L" },
    //   label: "",
    // },
    // {
    //   color: "yellow",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ1",
    //     cavity: "19",
    //   },
    //   to: { componentId: "SPL_905", connectorId: "XSP_905", cavity: "L" },
    //   label: "",
    // },
    {
      color: "yellow",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "13",
      },
      to: { componentId: "FLSH", connectorId: "XK5", cavity: "2" },
      label: "",
    },
    {
      color: "green",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "5",
      },
      to: { componentId: "HS", connectorId: "XS13", cavity: "1" },
      label: "",
    },
    // {
    //   color: "green",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ1",
    //     cavity: "15",
    //   },
    //   to: { componentId: "SPL_623", connectorId: "XSP_623", cavity: "L" },
    //   label: "",
    // },
    // {
    //   color: "black",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ1",
    //     cavity: "20",
    //   },
    //   to: {
    //     componentId: "SPL_100B",
    //     connectorId: "XSP_100B",
    //     cavity: "L",
    //   },
    //   label: "",
    // },
    {
      color: "orange",
      from: {
        componentId: "CTS",
        connectorId: "XB3",
        cavity: "1",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "16",
      },
      label: "",
    },
    {
      color: "pink",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "12",
      },
      to: {
        componentId: "LS",
        connectorId: "XS9",
        cavity: "C",
      },
      label: "",
    },
    // {
    //   color: "yellow",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ1",
    //     cavity: "6",
    //   },
    //   to: {
    //     componentId: "SPL_500",
    //     connectorId: "XSP_500",
    //     cavity: "L",
    //   },
    //   label: "",
    // },
    {
      color: "pink",
      from: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "4",
      },
      to: { componentId: "KS", connectorId: "XS1", cavity: "A" },
      label: "",
    },
    // {
    //   color: "yellow",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ1",
    //     cavity: "11",
    //   },
    //   to: {
    //     componentId: "SPL_500",
    //     connectorId: "XSP_500",
    //     cavity: "L",
    //   },
    //   label: "",
    // },
    {
      color: "blue",
      from: {
        componentId: "MCHPTO",
        connectorId: "X6",
        cavity: "B",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "14",
      },
      label: "",
    },
    {
      color: "red",
      from: { componentId: "LC", connectorId: "X90", cavity: "48" },
      to: {
        componentId: "ICC",
        connectorId: "XJ1",
        cavity: "10",
      },
      label: "",
    },
    {
      color: "green",
      from: {
        componentId: "ARS",
        connectorId: "XB1",
        cavity: "A",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "9",
      },
      label: "",
    },
    {
      color: "green",
      from: {
        componentId: "OPS",
        connectorId: "XB2",
        cavity: "A",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "10",
      },
      label: "",
    },
    // {
    //   color: "blue",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ2",
    //     cavity: "2",
    //   },
    //   to: {
    //     componentId: "SPL_754",
    //     connectorId: "XSP_754",
    //     cavity: "L",
    //   },
    //   label: "",
    // },
    // {
    //   color: "green",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ2",
    //     cavity: "1",
    //   },
    //   to: {
    //     componentId: "SPL_755",
    //     connectorId: "XSP_755",
    //     cavity: "L",
    //   },
    //   label: "",
    // },
    {
      color: "violet",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "5",
      },
      to: {
        componentId: "BS",
        connectorId: "XS8",
        cavity: "1",
      },
      label: "",
    },
    {
      color: "blue",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "4",
      },
      to: {
        componentId: "RS",
        connectorId: "XS7",
        cavity: "8",
      },
      label: "",
    },
    {
      color: "pink",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "3",
      },
      to: {
        componentId: "SS",
        connectorId: "XS4",
        cavity: "4",
      },
      label: "",
    },
    // {
    //   color: "violet",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ2",
    //     cavity: "5",
    //   },
    //   to: {
    //     componentId: "SPL_767",
    //     connectorId: "XSP_767",
    //     cavity: "L",
    //   },
    //   label: "",
    // },
    // {
    //   color: "blue",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ2",
    //     cavity: "13",
    //   },
    //   to: {
    //     componentId: "SPL_624",
    //     connectorId: "XSP_624",
    //     cavity: "L",
    //   },
    //   label: "",
    // },
    {
      color: "blue",
      from: {
        componentId: "MCHPTO",
        connectorId: "X6",
        cavity: "A",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "6",
      },
      label: "",
    },
    // {
    //   color: "yellow",
    //   from: {
    //     componentId: "ICC",
    //     connectorId: "XJ2",
    //     cavity: "19",
    //   },
    //   to: {
    //     componentId: "SPL_500",
    //     connectorId: "XSP_500",
    //     cavity: "L",
    //   },
    //   label: "",
    // },
    {
      color: "violet",
      from: {
        componentId: "LC",
        connectorId: "X90",
        cavity: "19",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "11",
      },
      label: "",
    },
        {
      color: "yellow",
      from: {
        componentId: "LC",
        connectorId: "X90",
        cavity: "8",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "15",
      },
      label: "",
    },
    {
      color: "yellow",
      from: {
        componentId: "LC",
        connectorId: "X90",
        cavity: "11",
      },
      to: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "16",
      },
      label: "",
    },
  ],
};

export default ICC;
