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
import { getComponents, getComponentSchematic, getDtcs, getHarnesses, getVoltageSupply, getSystems, getSystemFormula, getHarnessSchematic } from "./services/api";
import { normalizeSchematic } from "./utils/normalizeSchematic";

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
  const [dtcList, setDtcList] = useState<any[]>([]);
  const [harnessesList, setHarnessesList] = useState<any[]>([]);
  const [supplyList, setVoltageSupplyList] = useState<any[]>([]);
  const [systemsList, setSystemsList] = useState<any[]>([]);

  const dtcItems: DashboardItem[] = dtcList.map((d) => ({
    code: d.code,
    name: d.name,
    type: "DTC",
    status: "Active",
    voltage: "N/A",
    description: d.comment || "No description available",

    schematicData: {
      masterComponents: [],
      components: [],
      connections: [],
      name: d.name
    }
  }));

  const systemsItem: DashboardItem[] = systemsList.map((s) => ({
    code: s.code,
    name: s.name,
    type: "System",
    status: "Active",
    voltage: "N/A",
    description: s.description || "No description available",
    schematicData: {
      masterComponents: [],
      components: [],
      connections: [],
      name: s.name
    }
  }));

  const harnessItems: DashboardItem[] = harnessesList.map((h) => ({
    code: h.code,
    name: h.name,
    type: "Harness",
    status: "Active",
    voltage: "N/A",
    description: h.description || "No description available",
    schematicData: {
      masterComponents: [],
      components: [],
      connections: [],
      name: h.name
    }
  }));

  const supplyItems: DashboardItem[] = supplyList.map((s) => ({
    code: s.code,
    name: s.name,
    type: "Supply",
    status: "Active",
    voltage: "N/A",
    description: s.description || "No description available",
    schematicData: {
      masterComponents: [],
      components: [],
      connections: [],
      name: s.name
    }
  }));


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function loadSchematics() {
      try {
        const data = await getComponents();
        console.log("Raw API components:", data);
        setApiSchematics(data);
      } catch (err) {
        console.error("Failed to load components:", err);
      }
    }

    loadSchematics();
  }, []);


  useEffect(() => {
    async function loadSystems() {
      try {
        const data = await getSystems();
        console.log("Raw API harnesses:", data);
        setSystemsList(data);
      } catch (err) {
        console.error("Failed to load harnesses:", err);
      }
    }

    loadSystems();
  }, []);


  useEffect(() => {
    async function loadDtcs() {
      try {
        const data = await getDtcs();
        console.log("Raw API DTC list:", data);
        setDtcList(data);
      } catch (err) {
        console.error("Failed to load DTC list:", err);
      }
    }

    loadDtcs();
  }, []);

  useEffect(() => {
    async function loadHarnesses() {
      try {
        const data = await getHarnesses();
        console.log("Raw API harnesses:", data);
        setHarnessesList(data);
      } catch (err) {
        console.error("Failed to load harnesses:", err);
      }
    }

    loadHarnesses();
  }, []);
  useEffect(() => {
    async function loadSupply() {
      try {
        const data = await getVoltageSupply();
        console.log("Row API voltage supply:", data);
        setVoltageSupplyList(data);
      } catch (err) {
        console.log("failed to load harness: ", err);
      }
    }
    loadSupply();
  }, []);
  const dashboardItems: DashboardItem[] = [
    // Components
    ...apiSchematics.map((api) => ({
      code: api.code,
      name: api.name,
      type: api.type || api.category || "Component",
      status: "Active" as const,
      voltage: "12V",
      description: `Schematic for ${api.name}`,

      schematicData: {
        masterComponents: api.masterComponents || [],
        components: api.components || [],
        connections: api.connections || [],
        name: api.name || "Unnamed Schematic"
      }
    })),
    // DTC Items
    ...dtcItems,
    // Systems Items
    ...systemsItem,
    // Harness Items
    ...harnessItems,
    //voltage supply
    ...supplyItems,
  ];

  async function handleViewSchematic(codes: string[]) {
    try {
      if (activeTab === "harnesses" && codes.length > 0) {
        // Use only the first selected harness for now
        const harnessCode = codes[0];

        const data = await getHarnessSchematic(harnessCode);

        const normalized = normalizeSchematic(data);

        setMergedSchematic(normalized);
        setSelectedItem(null);
        return;
      }

      // Existing behavior for components, DTC, etc.
      const fetchedSchematics = await Promise.all(
        codes.map(async (code) => {
          const data = await getComponentSchematic(code);
          return normalizeSchematic(data);
        })
      );

      const merged = mergeSchematicConfigs(...fetchedSchematics);
      setMergedSchematic(merged);
      setSelectedItem(null);
    } catch (err) {
      console.error("Error loading and merging schematics:", err);
    }
  }


  const filteredItems = dashboardItems.filter((item) => {
    switch (activeTab) {
      case "components":
        return item.type === "Component";
      case "controllers":
        return item.type === "Controller";
      case "systems":
        return item.type === "System";
      case "voltage":
        return item.type === "Supply";
      case "DTC":
        return item.type === "DTC";
      case "signals":
        return false;
      case "harnesses":
        return item.type === "Harness";
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
          {/* LEFT PANEL */}
          <LeftPanel
            activeTab={activeTab}
            data={filteredItems}
            onItemSelect={async (item) => {
              try {
                console.log("🔗 Item clicked:", item.code, "Type:", item.type);

                // ✅ CHECK IF HARNESS
                if (item.type === "Harness") {
                  console.log("📦 Loading harness schematic for:", item.code);

                  // Call harness API
                  const data = await getHarnessSchematic(item.code);
                  console.log("✅ Harness data received:", data);

                  const converted = normalizeSchematic(data);
                  console.log("✅ Normalized harness schematic:", converted);

                  const updatedItem = {
                    ...item,
                    schematicData: converted
                  };

                  setSelectedItem(updatedItem);
                  setMergedSchematic(null);
                  console.log("✅ Harness schematic set and ready to render");
                  return;
                }

                // ✅ OTHERWISE USE COMPONENT API (existing behavior)
                console.log("🔍 Loading component schematic for:", item.code);

                const code = item.code;
                const data = await getComponentSchematic(code);
                console.log("Loaded schematic:", data);

                const converted = normalizeSchematic(data);
                const updatedItem = {
                  ...item,
                  schematicData: converted
                };

                setSelectedItem(updatedItem);
                setMergedSchematic(null);
                console.log("Updated Item with schematic data:", updatedItem);

              } catch (err) {
                console.error("❌ Failed to load schematic:", err);
              }
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
