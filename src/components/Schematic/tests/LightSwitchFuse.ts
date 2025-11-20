const LightSwitchFuse = {
    code: "F1",
    name: "Light Switch Fuse(15A)",
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
            id: "XS1",
            label: "Key Switch",
            category: "Switch",
            shape: "rectangle",
            connectors: [{ id: "XS1", label: "XS1" }],
            engineering_component_name: "Key Switch",
            engineering_manufacturer: "M90206",
            primary_part_number: "U46662",
            harness_name: "",
            component_type: "Switch",
            connector_type: "U46662",
            remove: false,
            manufacturer: "M90206",
            connector_part_number: "XS1"
        },
        {
            id: "XSP_201_FL",
            label: "Splice",
            category: "Splice",
            shape: "circle",
            connectors: [{ id: "XSP_201_FL", label: "XSP_201_FL" }],
            engineering_component_name: "Splice",
            engineering_manufacturer: "",
            primary_part_number: "",
            harness_name: "",
            component_type: "Splice",
            connector_type: "",
            remove: false,
            manufacturer: "",
            connector_part_number: "XSP_201_FL"
        }
    ],
    connections: [
        {
            color: "red",
            from: { componentId: "X90", connectorId: "X90", cavity: "46", gender: "Female" },
            to: { componentId: "XS1", connectorId: "XS1", cavity: "B", gender: "Female" },
            label: "204A",
            wireDetails: {
                circuitNumber: "204A",
                wireSize: 1,
                wireColor: "RD",
                wireLength: 673,
                wireType: "Regular",
                fuse: { code: "F1", ampere: "15A" },
                from: {
                    connectorNumber: "X90",
                    devName: "Load Center",
                    connPartNumber: "57M13428",
                    termPartNo: "57M7491",
                    sealPartNo: "57M9219",
                    cavity: "46"
                },
                to: {
                    connectorNumber: "XS1",
                    devName: "Key Switch",
                    connPartNumber: "M90206",
                    termPartNo: "U46662",
                    sealPartNo: "",
                    cavity: "B"
                }
            }
        },
        {
            color: "red",
            from: { componentId: "X90", connectorId: "X90", cavity: "48", gender: "Female" },
            to: { componentId: "XS1", connectorId: "XS1", cavity: "B", gender: "Female" },
            label: "401B",
            wireDetails: {
                circuitNumber: "401B",
                wireSize: 2,
                wireColor: "RD",
                wireLength: 644,
                wireType: "Regular",
                fuse: { code: "F3", ampere: "20A" },
                from: {
                    connectorNumber: "X90",
                    devName: "Load Center",
                    connPartNumber: "57M13428",
                    termPartNo: "57M7491",
                    sealPartNo: "57M9219",
                    cavity: "35"
                },
                to: {
                    connectorNumber: "XSP_201_FL",
                    devName: "Splice",
                    connPartNumber: "",
                    termPartNo: "",
                    sealPartNo: "",
                    cavity: ""
                }
            }
        },
        {
            color: "red",
            from: { componentId: "X90", connectorId: "X90", cavity: "44", gender: "Female" },
            to: { componentId: "XSP_201_FL", connectorId: "XSP_201_FL", cavity: "", gender: "Female" },
            label: "201D",
            wireDetails: {
                circuitNumber: "201D",
                wireSize: 3,
                wireColor: "RD",
                wireLength: 644,
                wireType: "Regular",
                fuse: { code: "F3", ampere: "20A" },
                from: {
                    connectorNumber: "X90",
                    devName: "Load Center",
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
                    cavity: "X"
                }
            }
        },
        {
            color: "red",
            from: { componentId: "X90", connectorId: "X90", cavity: "34", gender: "Female" },
            to: { componentId: "XSP_201_FL", connectorId: "XSP_201_FL", cavity: "", gender: "Female" },
            label: "401A",
            wireDetails: {
                circuitNumber: "401A",
                wireSize: 1,
                wireColor: "RD",
                wireLength: 0,
                wireType: "Regular",
                fuse: { code: "F6", ampere: "15A" },
                from: {
                    connectorNumber: "X90",
                    devName: "Load Center",
                    connPartNumber: "57M13428",
                    termPartNo: "57M7491",
                    sealPartNo: "57M9219",
                    cavity: "43"
                },
                to: {
                    connectorNumber: "XSP_201_FL",
                    devName: "Splice",
                    connPartNumber: "",
                    termPartNo: "",
                    sealPartNo: "",
                    cavity: ""
                }
            }
        },
        {
            color: "red",
            from: { componentId: "X90", connectorId: "X90", cavity: "9", gender: "Female" },
            to: { componentId: "XSP_201_FL", connectorId: "XSP_201_FL", cavity: "", gender: "Female" },
            label: "201A",
            wireDetails: {
                circuitNumber: "201A",
                wireSize: 3,
                wireColor: "RD",
                wireLength: 644,
                wireType: "Regular",
                fuse: { code: "F6", ampere: "10A" }, // adjust code/ampere as needed
                from: {
                    connectorNumber: "X90",
                    devName: "Load Center",
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
                    cavity: "X"
                }
            }
        },
        {
            color: "red",
            from: { componentId: "X90", connectorId: "X90", cavity: "42", gender: "Female" },
            to: { componentId: "XSP_201_FL", connectorId: "XSP_201_FL", cavity: "", gender: "Female" },
            label: "201C",
            wireDetails: {
                circuitNumber: "201C",
                wireSize: 3,
                wireColor: "RD",
                wireLength: 644,
                wireType: "Regular",
                fuse: { code: "F1", ampere: "15A" },
                from: {
                    connectorNumber: "X90",
                    devName: "Load Center",
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

    ]
};

export default LightSwitchFuse;
