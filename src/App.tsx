import React, { useState, useEffect } from "react";
import NavigationTabs from "./panels/NavigationTabs";
import LeftPanel from "./panels/LeftPanel";
import MainPanel from "./panels/MainPanel";
import Schematic from "./components/Schematic/Schematic";
import { SchematicData } from "./components/Schematic/SchematicTypes";
import "../src/Styles/global.css";

import WelcomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { mergeSchematicConfigs } from './utils/mergeSchematicConfigs';

export type DashboardItem = {
  code: string;
  name: string;
  type: string;
  status: "Active" | "Inactive";
  voltage?: string;
  description: string;
  schematicData: SchematicData;
};

export default function App() {
  // ========================
  // STATE
  // ========================
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);

  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [mergedSchematic, setMergedSchematic] = useState<SchematicData | null>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showWelcome, setShowWelcome] = useState(true);

  // API schematic data
  const [apiSchematics, setApiSchematics] = useState<any[]>([]);

  // ========================
  // WINDOW RESIZE HANDLER
  // ========================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ========================
  // FETCH SCHEMATICS FROM API
  // ========================
  useEffect(() => {
  async function fetchSchematics() {
    try {
      const res = await fetch(
        "http://localhost:8080/api/schematics/c21b8364-b15c-43f6-85dd-6901dc076db1/components"
      );

      const data = await res.json();

      // 🔥 PRINT EXACT RAW DATA
      console.log("Raw API response:", data);

      setApiSchematics(data);
    } catch (err) {
      console.error("Failed to fetch schematics:", err);
    }
  }

  fetchSchematics();
}, []);


  // ========================
  // CREATE DASHBOARD ITEMS FROM API ONLY
  // ========================
  const dashboardItems: DashboardItem[] = apiSchematics.map((api) => {
  return {
    code: api.code,
    name: api.name,
    type: "Component", // default because API does not send type
    status: "Active",
    voltage: "12V", // default
    description: `Schematic for ${api.name}`,
    schematicData: api     // API returns only code + name → still OK
  };
});


  // ========================
  // MULTI SELECT → MERGE API SCHEMATICS
  // ========================
  function handleViewSchematic(codes: string[]) {
    const selectedItems = dashboardItems.filter((item) =>
      codes.includes(item.code)
    );

    const schematicConfigs = selectedItems.map((item) => item.schematicData);
    const merged = mergeSchematicConfigs(...schematicConfigs);

    setMergedSchematic(merged);
    setSelectedItem(null);
  }

  // ========================
  // FILTER COMPONENT LIST BASED ON TAB
  // ========================
  const filteredItems = dashboardItems.filter((item) => {
    switch (activeTab) {
      case "components":
        return item.type === "Component";
      case "controllers":
        return item.type === "Controller"; // depends on your API structure
      case "systems":
        return false; // NO hardcoded systems since mode A
      case "voltage":
        return item.voltage === "12V" || item.voltage === "5V";
      case "DTC":
        return false; // NO dtc in mode A
      default:
        return true;
    }
  });

  // ========================
  // LOGIN CHECK
  // ========================
  if (!loggedIn) {
    return <LoginPage onLoginSuccess={() => setLoggedIn(true)} />;
  }

  // ========================
  // RENDER APP
  // ========================
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
          setShowWelcome(false);
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
          {/* LEFT PANEL */}
          <LeftPanel
            activeTab={activeTab}
            data={filteredItems}
            onItemSelect={(item) => {
              setSelectedItem(item);
              setMergedSchematic(null);
            }}
            selectedItem={selectedItem}
            selectedCodes={selectedCodes}
            setSelectedCodes={setSelectedCodes}
            onViewSchematic={handleViewSchematic}
            isMobile={isMobile}
          />

          {/* MOBILE MODE */}
          {!isMobile && selectedItem?.schematicData && (
            <Schematic data={selectedItem.schematicData} activeTab={activeTab} />
          )}

          {/* MAIN PANEL */}
          <MainPanel
            selectedItem={
              mergedSchematic
                ? {
                    code: "MERGED",
                    name: "Merged Schematic",
                    type: "Merged",
                    status: "Active",
                    voltage: "12V",
                    description: "Merged API schematic view",
                    schematicData: mergedSchematic,
                  }
                : selectedItem
            }
            activeTab={activeTab}
            isMultipleComponents={!!mergedSchematic}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
}
