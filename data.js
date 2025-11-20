const connections = [
  {
    components: [
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
      {
        id: "XSP_100B",
        label: "Splice",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XSP_100B", label: "XSP_100B" }],
      },
    ],
    connections: [
      {
        color: "BK",
        from: { componentId: "XJ1", connectorId: "XJ1", cavity: "20" },
        to: { componentId: "XSP_100B", connectorId: "XSP_100B", cavity: "L" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XB3",
        label: "Coolant Temperature Sensor",
        category: "Sensor",
        shape: "rectangle",
        connectors: [{ id: "XB3", label: "XB3" }],
      },
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
    ],
    connections: [
      {
        color: "OG",
        from: { componentId: "XB3", connectorId: "XB3", cavity: "1" },
        to: { componentId: "XJ1", connectorId: "XJ1", cavity: "16" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XB1",
        label: "Air restriction sensor",
        category: "Sensor",
        shape: "rectangle",
        connectors: [{ id: "XB1", label: "XB1" }],
      },
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
    ],
    connections: [
      {
        color: "GN",
        from: { componentId: "XB1", connectorId: "XB1", cavity: "A" },
        to: { componentId: "XJ2", connectorId: "XJ2", cavity: "9" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
      {
        id: "XS9",
        label: "Light switch",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XS9", label: "XS9" }],
      },
    ],
    connections: [
      {
        color: "PK",
        from: { componentId: "XJ1", connectorId: "XJ1", cavity: "12" },
        to: { componentId: "XS9", connectorId: "XS9", cavity: "C" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
      {
        id: "XSP_500",
        label: "Splice",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XSP_500", label: "XSP_500" }],
      },
    ],
    connections: [
      {
        color: "YE",
        from: { componentId: "XJ1", connectorId: "XJ1", cavity: "6" },
        to: { componentId: "XSP_500", connectorId: "XSP_500", cavity: "L" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
      {
        id: "XSP_500",
        label: "Splice",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XSP_500", label: "XSP_500" }],
      },
    ],
    connections: [
      {
        color: "YE",
        from: { componentId: "XJ2", connectorId: "XJ2", cavity: "19" },
        to: { componentId: "XSP_500", connectorId: "XSP_500", cavity: "L" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
      {
        id: "XSP_500",
        label: "Splice",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XSP_500", label: "XSP_500" }],
      },
    ],
    connections: [
      {
        color: "YE",
        from: { componentId: "XJ1", connectorId: "XJ1", cavity: "11" },
        to: { componentId: "XSP_500", connectorId: "XSP_500", cavity: "L" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "X90",
        label: "Load center",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "X90", label: "X90" }],
      },
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
    ],
    connections: [
      {
        color: "YE",
        from: { componentId: "X90", connectorId: "X90", cavity: "8" },
        to: { componentId: "XJ2", connectorId: "XJ2", cavity: "15" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "X90",
        label: "Load center",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "X90", label: "X90" }],
      },
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
    ],
    connections: [
      {
        color: "YE",
        from: { componentId: "X90", connectorId: "X90", cavity: "11" },
        to: { componentId: "XJ2", connectorId: "XJ2", cavity: "16" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
      {
        id: "XS1",
        label: "Key switch",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XS1", label: "XS1" }],
      },
    ],
    connections: [
      {
        color: "PK",
        from: { componentId: "XJ1", connectorId: "XJ1", cavity: "4" },
        to: { componentId: "XS1", connectorId: "XS1", cavity: "A" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "X90",
        label: "Load center",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "X90", label: "X90" }],
      },
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
    ],
    connections: [
      {
        color: "RD",
        from: { componentId: "X90", connectorId: "X90", cavity: "48" },
        to: { componentId: "XJ1", connectorId: "XJ1", cavity: "10" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XG2-3",
        label: "Alternator",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XG2-3", label: "XG2-3" }],
      },
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
    ],
    connections: [
      {
        color: "GN",
        from: { componentId: "XG2-3", connectorId: "XG2-3", cavity: "3" },
        to: { componentId: "XJ1", connectorId: "XJ1", cavity: "1" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "X3",
        label: "Main Chassis to FMI Monitor Harness Connector",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "X3", label: "X3" }],
      },
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
    ],
    connections: [
      {
        color: "GN",
        from: { componentId: "X3", connectorId: "X3", cavity: "B" },
        to: { componentId: "XJ1", connectorId: "XJ1", cavity: "2" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XB2",
        label: "Oil Pressure Switch",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XB2", label: "XB2" }],
      },
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
    ],
    connections: [
      {
        color: "GN",
        from: { componentId: "XB2", connectorId: "XB2", cavity: "A" },
        to: { componentId: "XJ2", connectorId: "XJ2", cavity: "10" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
      {
        id: "Y3",
        label: "Fuel solenoid",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "Y3", label: "Y3" }],
      },
    ],
    connections: [
      {
        color: "PK",
        from: { componentId: "XJ1", connectorId: "XJ1", cavity: "7" },
        to: { componentId: "Y3", connectorId: "Y3", cavity: "B" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "X90",
        label: "Load center",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "X90", label: "X90" }],
      },
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
    ],
    connections: [
      {
        color: "VT",
        from: { componentId: "X90", connectorId: "X90", cavity: "19" },
        to: { componentId: "XJ2", connectorId: "XJ2", cavity: "11" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "X6",
        label: "Main Chassis Harness to PTO Switch Harness Connector",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "X6", label: "X6" }],
      },
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
    ],
    connections: [
      {
        color: "BU",
        from: { componentId: "X6", connectorId: "X6", cavity: "B" },
        to: { componentId: "XJ1", connectorId: "XJ1", cavity: "14" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "X6",
        label: "Main Chassis Harness to PTO Switch Harness Connector",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "X6", label: "X6" }],
      },
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
    ],
    connections: [
      {
        color: "BU",
        from: { componentId: "X6", connectorId: "X6", cavity: "A" },
        to: { componentId: "XJ2", connectorId: "XJ2", cavity: "6" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
      {
        id: "XSP_754",
        label: "Splice",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XSP_754", label: "XSP_754" }],
      },
    ],
    connections: [
      {
        color: "BU",
        from: { componentId: "XJ2", connectorId: "XJ2", cavity: "2" },
        to: { componentId: "XSP_754", connectorId: "XSP_754", cavity: "L" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
      {
        id: "XSP_755",
        label: "Splice",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XSP_755", label: "XSP_755" }],
      },
    ],
    connections: [
      {
        color: "GN",
        from: { componentId: "XJ2", connectorId: "XJ2", cavity: "1" },
        to: { componentId: "XSP_755", connectorId: "XSP_755", cavity: "L" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
      {
        id: "XSP_757",
        label: "Splice",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XSP_757", label: "XSP_757" }],
      },
    ],
    connections: [
      {
        color: "BU",
        from: { componentId: "XJ1", connectorId: "XJ1", cavity: "8" },
        to: { componentId: "XSP_757", connectorId: "XSP_757", cavity: "L" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
      {
        id: "XS8",
        label: "Brake switch",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XS8", label: "XS8" }],
      },
    ],
    connections: [
      {
        color: "VT",
        from: { componentId: "XJ2", connectorId: "XJ2", cavity: "5" },
        to: { componentId: "XS8", connectorId: "XS8", cavity: "1" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
      {
        id: "XS7",
        label: "Reverse switch",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XS7", label: "XS7" }],
      },
    ],
    connections: [
      {
        color: "BU",
        from: { componentId: "XJ2", connectorId: "XJ2", cavity: "4" },
        to: { componentId: "XS7", connectorId: "XS7", cavity: "8" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
      {
        id: "XS4",
        label: "Seat switch",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XS4", label: "XS4" }],
      },
    ],
    connections: [
      {
        color: "PK",
        from: { componentId: "XJ2", connectorId: "XJ2", cavity: "3" },
        to: { componentId: "XS4", connectorId: "XS4", cavity: "4" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "X1",
        label: "Main Chassis to Rear Lighting Harness",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "X1", label: "X1" }],
      },
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
    ],
    connections: [
      {
        color: "PK",
        from: { componentId: "X1", connectorId: "X1", cavity: "C" },
        to: { componentId: "XJ1", connectorId: "XJ1", cavity: "9" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XB4",
        label: "Fuel level senser",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XB4", label: "XB4" }],
      },
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
    ],
    connections: [
      {
        color: "WH",
        from: { componentId: "XB4", connectorId: "XB4", cavity: "A" },
        to: { componentId: "XJ1", connectorId: "XJ1", cavity: "17" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
      {
        id: "XSP_904",
        label: "Splice",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XSP_904", label: "XSP_904" }],
      },
    ],
    connections: [
      {
        color: "GN",
        from: { componentId: "XJ1", connectorId: "XJ1", cavity: "18" },
        to: { componentId: "XSP_904", connectorId: "XSP_904", cavity: "L" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
      {
        id: "XSP_905",
        label: "Splice",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XSP_905", label: "XSP_905" }],
      },
    ],
    connections: [
      {
        color: "YE",
        from: { componentId: "XJ1", connectorId: "XJ1", cavity: "19" },
        to: { componentId: "XSP_905", connectorId: "XSP_905", cavity: "L" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ2",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ2", label: "XJ2" }],
      },
      {
        id: "XSP_767",
        label: "Splice",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XSP_767", label: "XSP_767" }],
      },
    ],
    connections: [
      {
        color: "VT",
        from: { componentId: "XJ2", connectorId: "XJ2", cavity: "5" },
        to: { componentId: "XSP_767", connectorId: "XSP_767", cavity: "L" },
        label: "",
      },
    ],
  },
  {
    components: [
      {
        id: "XJ1",
        label: "Instrument Cluster Controller",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XJ1", label: "XJ1" }],
      },
      {
        id: "XK5",
        label: "Flasher",
        category: "Instrument",
        shape: "rectangle",
        connectors: [{ id: "XK5", label: "XK5" }],
      },
    ],
    connections: [
      {
        color: "YE",
        from: { componentId: "XJ1", connectorId: "XJ1", cavity: "13" },
        to: { componentId: "XK5", connectorId: "XK5", cavity: "2" },
        label: "",
      },
    ],
  },
];
