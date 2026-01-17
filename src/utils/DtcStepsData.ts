// DTC Steps Data File
// Contains all diagnostic trouble code steps and related information

export const DTC_STEPS_DATA: Record<string, any> = {
  "ICC 000100.01": {
    code: "ICC 000100.01",
    name: "E1018 - Engine Oil Pressure Low",
    steps: [
      "Steps 1 – Disconnect XB4 CONNECTOR",
      "Step 2 - Check for dust or rust and clean connector XB4 and and Sensor B1",
      "Step 3 – Check continuity for Sensor B1-",
      "    If continuity is presence - move to step 4",
      "If continuity is not present – replace B1",
      "Step 4 - Check voltage supply in XB4",
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
        "Steps 1 – Disconnect XB4 CONNECTOR",
        "Step 2 -  Check for dust or rust and clean connector XB4 and and Sensor B7",
        "Step 3 – Check continuity for Sensor B7- ",
        "If continuity is presence -  move to step 4",
        "If continuity is not present – replace B7",
        "Step 4- Check voltage supply in XB4",
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
        "Steps 1 – Disconnect XB4 CONNECTOR",
        "Step 2 -  Check for dust or rust and clean connector XB4 and Solenoid Y7",
        "Step 3 – Check continuity for solenoid Y7- ",
        "If continuity is presence -  move to step 4",
        "If continuity is not present – replace y7",
        "Step 4- Check voltage supply in XB4",
      ],
        probableCauses: [
          "Short to power in PTO clutch circuit",
          "Damaged PTO clutch solenoid",
          "Wiring harness damage"
        ]
},

};