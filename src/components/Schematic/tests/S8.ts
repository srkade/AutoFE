const S8 = {
  code: "S8",
  name: "Brake Switch",
  masterComponents: ["S8"],
  components: [
  {
    id: "S8",
    label: "Brake switch",
    category: "Switch",
    shape: "rectangle",
    connectors: [
      {
        id: "XS8",
        label: "XS8",
      },
    ],
    engineering_component_name: "Brake switch",
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
    id: "SPL_767",
    label: "Splice",
    category: "Splice",
    shape: "circle",
    connectors: [
      {
        id: "XSP_767",
        label: "XSP_767",
      },
    ],
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
    },
],
  connections: [
    {
      color: "yellow",
      from: {
        componentId: "S8",
        connectorId: "XS8",
        cavity: "5",
        gender: ""
      },
      to: {
        componentId: "SPL_500",
        connectorId: "XSP_500",
        cavity: "L",
        gender: ""
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
          cavity: "5",
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
      color: "violet",
      from: {
        componentId: "S8",
        connectorId: "XS8",
        cavity: "1",
      },
      to: {
        componentId: "SPL_767",
        connectorId: "XSP_767",
        cavity: "L",
      },
      label: "",
      wireDetails: {
        circuitNumber: "767G",
        wireSize: 1,
        wireColor: "VT",
        wireLength: "",
        wireType: "Regular",
        twistId: "",
        shieldId: "",
        wireOption: "",
        mark: "",
        from: {
          connectorNumber: "XS8",
          devName: "Brake Switch",
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
      },
    },
    {
      color: "violet",
      from: {
        componentId: "ICC",
        connectorId: "XJ2",
        cavity: "3",
        gender:"female"
      },
      to: {
        componentId: "S8",
        connectorId: "XS8",
        cavity: "1",
        gender:""
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
      },
    },
  ],
};
export default S8;