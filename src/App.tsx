import React, { Component, useState, useEffect } from "react";
import NavigationTabs from "./panels/NavigationTabs";
import LeftPanel from "./panels/LeftPanel";
import MainPanel from "./panels/MainPanel";
import Schematic from "./components/Schematic/Schematic";
import { SchematicData } from "./components/Schematic/SchematicTypes";
import "../src/Styles/global.css"
import {
  ICC,
  S4,
  S9,
  S8,
  B3,
  CrankingSystem,
  ChargingSystem,
  LightSwitchFuse,
  HeadLightRelayFuse,
} from "./components/Schematic/tests";
import WelcomePage from "./pages/HomePage";
import { DTC_StarterCoolDown, DTC_StarterRelayPower, DTC_StarterRelayGround, DTC_ICC } from "./components/Schematic/tests/DTCs"
import LoginPage from "./pages/LoginPage";
import { mergeSchematicConfigs } from './utils/mergeSchematicConfigs';


const wrapSchematic = (schematic: any): any => ({
  masterComponents: [], // add this line
  ...schematic
});
// Create dashboard items from schematics
const allSchematics = {
  ICC: wrapSchematic(ICC),
  B3: wrapSchematic(B3),
  S4: wrapSchematic(S4),
  S8: wrapSchematic(S8),
  S9: wrapSchematic(S9),
  CrankingSystem: wrapSchematic(CrankingSystem),
  ChargingSystem: wrapSchematic(ChargingSystem),
  DTC_StarterCoolDown: wrapSchematic(DTC_StarterCoolDown),
  DTC_StarterRelayPower: wrapSchematic(DTC_StarterRelayPower),
  DTC_StarterRelayGround: wrapSchematic(DTC_StarterRelayGround),
  DTC_ICC: wrapSchematic(DTC_ICC),
  LightSwitchFuse: wrapSchematic(LightSwitchFuse),
  HeadLightRelayFuse: wrapSchematic(HeadLightRelayFuse),
};
const SYSTEM_KEYS = ["CrankingSystem", "ChargingSystem"];

// Create dashboardItems mapping (DO NOT place any hook or selection logic here)
const dashboardItems = Object.entries(allSchematics).map(([key, schematic]) => {
  const isSystem = SYSTEM_KEYS.includes(key);
  // NEW: Read code and name from schematic if they exist
  const dtcCode = schematic.code || key;
  const dtcName = schematic.name || schematic.components[0]?.label || (isSystem ? key : "Unknown Component");
  const label =
    schematic.components[0]?.label || (isSystem ? key : "Unknown Component");
  return {
    code: dtcCode,  // Changed: now uses schematic.code
    name: dtcName,  // Changed: now uses schematic.name
    type: isSystem ? "System" : schematic.components[0]?.category || "Unknown",
    status: "Active" as const,
    voltage: isSystem
      ? "12V"
      : key === "B3"
        ? "12V"
        : key === "S4"
          ? "5V"
          : "12V",
    description: isSystem
      ? `System schematic: ${label}`
      : `Schematic for ${label}`,
    schematicData: schematic,
  };
});

export type DashboardItem = {
  code: string;
  name: string;
  type: string;
  status: "Active" | "Inactive";
  voltage?: string;
  description: string;
  schematicData: SchematicData;
};

// ===============================
// Place ALL React state and logic BELOW this line in the main function
// ===============================
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false); // track login state
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);


  // Multi-select additions:
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [mergedSchematic, setMergedSchematic] = useState<SchematicData | null>(
    null
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showWelcome, setShowWelcome] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth <= 768;
      setIsMobile(nowMobile);
    };

    window.addEventListener("resize", handleResize);

    // Run once when component mounts (to ensure correct initial size)
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleViewSchematic(codes: string[]) {
    const selectedItems = dashboardItems.filter((it) =>
      codes.includes(it.code)
    );
    // Extract schematic data from dashboard items
    const schematicConfigs = selectedItems.map(item => item.schematicData);
    const merged = mergeSchematicConfigs(...schematicConfigs);
    setMergedSchematic(merged);
    setSelectedItem(null); // Optionally deselect single
  }

  // Filter items by category based on active tab
  const filteredItems = dashboardItems.filter((item) => {
    switch (activeTab) {
      case "components":
        return ["Sensor", "Switch"].includes(item.type);
      case "controllers":
        return ["Transistor", "Instrument"].includes(item.type);
      case "systems":
        return ["System"].includes(item.type);
      case "voltage":
        return ["Supply"].includes(item.type);
      case "DTC":
        return ["dtc"].includes(item.type);
      default:
        return false;
    }
  });
  if (!loggedIn) {
    return <LoginPage onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          setShowWelcome(false); //  hides welcome page when a tab is clicked
        }}
        onLogout={() => setLoggedIn(false)}
        userName="admin"
      />

      {showWelcome ? (
        <WelcomePage
          onStart={() => {
            setShowWelcome(false);
            setActiveTab("components");
          }}
        />
      ) : (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left Panel */}
          <LeftPanel
            activeTab={activeTab}
            data={filteredItems}
            onItemSelect={(item) => {
              setSelectedItem(item);
              setMergedSchematic(null); // Reset merge if new single selected
            }}
            selectedItem={selectedItem}
            selectedCodes={selectedCodes}
            setSelectedCodes={setSelectedCodes}
            onViewSchematic={handleViewSchematic}
            isMobile={isMobile}
          />
          {!isMobile && selectedItem?.schematicData && (
            <Schematic data={selectedItem.schematicData} activeTab={activeTab} />
          )}

          {/* Main Panel */}
          <MainPanel
            // If merged schematic is present, show that; otherwise single selection
            selectedItem={
              mergedSchematic
                ? {
                  code: "MERGED",
                  name: "Merged Schematic",
                  type: "Merged",
                  status: "Active",
                  voltage: "12V",
                  description: "Merged view of selected schematics",
                  schematicData: mergedSchematic,
                }
                : selectedItem
            }
            activeTab={activeTab}
            isMultipleComponents={!!mergedSchematic}
            isMobile={isMobile}
          />
        </div>
      )
      }

    </div>
  );
}
