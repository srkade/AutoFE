// DTC Steps Data File
// Contains all diagnostic trouble code steps and related information

export const DTC_STEPS_DATA: Record<string, any> = {
  "ICC 000100.01": {
    code: "ICC 000100.01",
    name: "E1018 - Engine Oil Pressure Low",
    steps: [
      "Disconnect XB4 CONNECTOR",
      "Check for dust or rust and clean connector XB4 and Sensor B1",
      "Check continuity for Sensor B1 - If continuity is present - move to step 4; If continuity is not present – replace B1",
      "Check voltage supply in XB4 - Voltage required – 5 Volts; If not check wire or replace wire"
    ],
    probableCauses: [
      "Low oil pressure",
      "Faulty oil pressure sensor",
      "Open circuit in sensor wiring"
    ]
  },
  
  "ICC 000096.02": {
    code: "ICC 000096.02",
    name: "E1019 - Fuel Sensor Voltage Erratic or Out of Range",
    steps: [
      "Disconnect XB4 CONNECTOR",
      "Check for dust or rust and clean connector XB4 and Sensor B7",
      "Check continuity for Sensor B7 - If continuity is present - move to step 4; If continuity is not present – replace B7",
      "Check voltage supply in XB4 - Voltage required – 5 Volts; If not check wire or replace wire"
    ],
    probableCauses: [
      "Erratic fuel sensor voltage",
      "Faulty fuel sensor",
      "Open circuit in sensor wiring"
    ]
  },
  
  "ICC 003942.03": {
    code: "ICC 003942.03",
    name: "E1005 - PTO Clutch Short to Power",
    steps: [
      "Disconnect XB4 CONNECTOR",
      "Check for dust or rust and clean connector XB4 and Solenoid Y7",
      "Check continuity for solenoid Y7 - If continuity is present - move to step 4; If continuity is not present – replace Y7",
      "Check voltage supply in XB4 - Voltage required – 5 Volts; If not check wire or replace wire"
    ],
    probableCauses: [
      "Short to power in PTO clutch circuit",
      "Damaged PTO clutch solenoid",
      "Wiring harness damage"
    ]
  },
  
  "ICC 000677.31": {
    code: "ICC 000677.31",
    name: "(E1001) - Starter Cool Down in Process",
    steps: [
      "Check continuity between ICC XJ1 cavity 6 and splice XSP_500",
      "Inspect connector XS12 for corrosion",
      "Verify horn ground connection"
    ],
    probableCauses: [
      "Open circuit in connector XSP_500",
      "Corroded connector XS12 cavity A",
      "Loose ground near horn circuit"
    ],
    videoUrl: "https://www.youtube.com/embed/gaelXhngh5A"
  }
};