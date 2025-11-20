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
import { getComponents } from "./services/api";

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

  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);

  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [mergedSchematic, setMergedSchematic] = useState<SchematicData | null>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showWelcome, setShowWelcome] = useState(true);

  // API schematic data
  const [apiSchematics, setApiSchematics] = useState<any[]>([]);
  // API data for each category
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function loadSchematics() {
      try {
        const data = await getComponents(
          "aa2fe692-6b4a-47fe-b227-5e8b86bca364"
        );

        console.log("Raw API components:", data);
        setApiSchematics(data);

      } catch (err) {
        console.error("Failed to load components:", err);
      }
    }

    loadSchematics();
  }, []);

  const dashboardItems: DashboardItem[] = apiSchematics.map((api) => {
    return {
      code: api.code,
      name: api.name,
      type: api.type || api.category || "Component",
      status: "Active",
      voltage: "12V", // default
      description: `Schematic for ${api.name}`,
      schematicData: api
    };
  });

  function handleViewSchematic(codes: string[]) {
    const selectedItems = dashboardItems.filter((item) =>
      codes.includes(item.code)
    );

    const schematicConfigs = selectedItems.map((item) => item.schematicData);
    const merged = mergeSchematicConfigs(...schematicConfigs);

    setMergedSchematic(merged);
    setSelectedItem(null);
  }

  const filteredItems = dashboardItems.filter((item) => {
    switch (activeTab) {
      case "components":
        return item.type === "Component";
      case "controllers":
        return item.type === "Controller";
      case "systems":
        return false;
      case "voltage":
        return false;
      case "DTC":
        return false;
      case "signals":
        return false;
      case "harnesses":
        return false;
      default:
        return true;
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
            <Schematic data={selectedItem.schematicData} activeTab={activeTab}  />
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
