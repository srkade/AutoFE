// DTC Steps Data File
// Contains all diagnostic trouble code steps and related information

export const DTC_STEPS_DATA: Record<string, any> = {
  "ICC 000100.01": {
    code: "ICC 000100.01",
    name: "E1018 - Engine Oil Pressure Low",
    steps: [
      "Steps 1 – Disconnect {connectorCode} CONNECTOR",
      "Step 2 - Check for dust or rust and clean connector {connectorCode} and and Sensor {componentCode}",
      "Step 3 – Check continuity for Sensor {componentCode}-",
      "    If continuity is presence - move to step 4",
      "If continuity is not present – replace {componentCode}",
      "Step 4 - Check voltage supply in {connectorCode}",
    ],
    probableCauses: [
      "Low oil pressure in {componentName}",
      "Faulty oil pressure sensor {componentCode}",
      "Open circuit in {connectorCode} wiring"
    ]
  },

  "ICC 000096.02": {
    code: "ICC 000096.02",
    name: "E1019 - Fuel Sensor Voltage Erratic or Out of Range",
    steps: [
      "Steps 1 – Disconnect {connectorCode} CONNECTOR",
      "Step 2 - Check for dust or rust and clean connector {connectorCode} and and Sensor {componentCode}",
      "Step 3 – Check continuity for Sensor {componentCode}- ",
      "If continuity is presence - move to step 4",
      "If continuity is not present – replace {componentCode}",
      "Step 4 - Check voltage supply in {connectorCode}",
    ],
    probableCauses: [
      "Erratic fuel sensor voltage at {componentCode}",
      "Faulty fuel sensor {componentName}",
      "Open circuit in {connectorCode} wiring"
    ]
  },

  "ICC 003942.03": {
    code: "ICC 003942.03",
    name: "E1005 - PTO Clutch Short to Power",
    steps: [
      "Steps 1 – Disconnect {connectorCode} CONNECTOR",
      "Step 2 - Check for dust or rust and clean connector {connectorCode} and Solenoid {componentCode}",
      "Step 3 – Check continuity for solenoid {componentCode}- ",
      "If continuity is presence - move to step 4",
      "If continuity is not present – replace {componentCode}",
      "Step 4 - Check voltage supply in {connectorCode}",
    ],
    probableCauses: [
      "Short to power in {componentName} circuit",
      "Damaged {componentCode} solenoid",
      "Wiring harness damage near {connectorCode}"
    ]
  },

  // NEW CODES FROM KIRLOSKAR MODEL
  "ECU 110.03": {
    code: "ECU 110.03",
    name: "Engine coolant Temperature Out of Range High",
    steps: [
      "Step 1 - Disconnect {connectorCode} from {componentName}",
      "Step 2 - Check Resistance between {componentCode} pins",
      "Step 3 - Inspect {connectorCode} for corrosion",
      "Step 4 - Verify wiring harness continuity"
    ],
    probableCauses: [
      "Faulty {componentName}",
      "Short circuit in {connectorCode}",
      "Harness damage"
    ]
  },

  "ECU 110.04": {
    code: "ECU 110.04",
    name: "Engine coolant Temperature Out of Range Low",
    steps: [
      "Step 1 - Inspect {componentCode} wiring",
      "Step 2 - Measure voltage at {connectorCode}",
      "Step 3 - Replace {componentName} if resistance is out of spec"
    ],
    probableCauses: [
      "Open circuit in {componentCode}",
      "Disconnected {connectorCode}",
      "Sensor failure"
    ]
  },

  "ECU 2791.05": {
    code: "ECU 2791.05",
    name: "Engine EGR Valve Current Out of Range High",
    steps: [
      "Step 1 - Disconnect {connectorCode}",
      "Step 2 - Check EGR Valve {componentCode} resistance",
      "Step 3 - Clean {connectorCode} terminals"
    ],
    probableCauses: [
      "EGR Valve {componentCode} shorted",
      "Water ingress in {connectorCode}",
      "Control unit failure"
    ]
  }
};