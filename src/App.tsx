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
import { getComponents, getComponentSchematic, getDtcs, getDtcSchematic, getHarnesses, getVoltageSupply, getSupplyFormula , getSystems, getSystemFormula, getHarnessSchematic, getWires } from "./services/api";
import { normalizeSchematic } from "./utils/normalizeSchematic";
import RegisterForm from "./pages/RegistrationForm";

export type DashboardItem = {
  code: string;
  name: string;
  type: string;
  status: "Active" | "Inactive";
  voltage?: string;
  description: string;
  schematicData: SchematicData;
};
import AdminNavigationTabs from "./pages/AdminNavigationTabs";
import ManageUsers from "./pages/ManageUsers";
import ImportFiles from "./pages/ImportedFiles";
export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<"login" | "register" | "dashboard">("login");
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: "admin" | "user";
  } | null>(null);

  const handleLoginSuccess = (loggedInRole: "admin" | "user", user: any) => {
    const userData = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: loggedInRole,
    };

    setCurrentUser(userData);
    setRole(loggedInRole);

    sessionStorage.setItem("currentUser", JSON.stringify(userData));
    sessionStorage.setItem("role", loggedInRole);

    setPage("dashboard");
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    const storedRole = sessionStorage.getItem("role");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedRole && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setRole(storedRole as "admin" | "user");
      setPage("dashboard");
    } else {
      setPage("login");
    }
  }, []);

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    // Clear React state
    setRole(null);
    setCurrentUser(null);
    setToken(null);

    // Redirect to login
    setPage("login");
  };


  const [activeTab, setActiveTab] = useState("components");
  const [adminTab, setAdminTab] = useState("manage-users");
  const [schematicTab, setSchematicTab] = useState("components");
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
  const [wireList, setWireList] = useState<any[]>([]);
  const [systemsList, setSystemsList] = useState<any[]>([]);
  // const [adminUser, setAdminUser] = useState<any>(null);



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

  const wiresItems: DashboardItem[] = wireList.map((w) => ({
    code: w.code,
    name: w.name,
    type: "wire",
    status: "Active",
    voltage: "N/A",
    description: w.description || "No description available",
    schematicData: {
      masterComponents: [],
      components: [],
      connections: [],
      name: w.name
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

  useEffect(() => {
    async function loadWires() {
      try {
        const data = await getWires();
        console.log("Row API Wires List:", data);
        setWireList(data);
      } catch (err) {
        console.log("failed to load harness: ", err);
      }
    }
    loadWires();
  }, []);
  const dashboardItems: DashboardItem[] = [

    // Components
    ...apiSchematics.map((api) => ({
      code: api.code,
      name: api.name,
      type: api.code === "ICC" ? "Controller" : api.type || api.category || "Component",
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
    //wires
    ...wiresItems

  ];

  async function handleViewSchematic(codes: string[]) {
    try {
      const tab = role === "admin" ? schematicTab : activeTab;

      if (tab === "harnesses" && codes.length > 0) {

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

  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("token")
  );

  const iccComponent = dashboardItems.find(item => item.name === "ICC") || null;

  const filteredItems = dashboardItems.filter((item) => {
    const filterBase = role === "admin" ? schematicTab : activeTab;

    switch (filterBase) {
      case "components":
        return item.type === "Component" || item.code === "ICC";
      case "controllers":
        return item.type === "Controller" || item.code === "ICC";
      case "systems":
        return item.type === "System";
      case "voltage":
        return item.type === "Supply";
      case "DTC":
        return item.type === "DTC";
      case "wire":
        return item.type === "wire";
      case "harnesses":
        return item.type === "Harness";
      default:
        return true;
    }
  });

  return (
    <div>
      {page === "login" && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onRegisterClick={() => setPage("register")}
          setToken={setToken}
        />
      )}

      {page === "register" && (
        <RegisterForm onBackToLogin={() => setPage("login")}
          isAdmin={role === "admin"} />
      )}

      {/* USER DASHBOARD */}
      {page === "dashboard" && role === "user" &&  token &&(
        <div
          style={{
            height: "100vh",
            background: "#f8f9fa",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <NavigationTabs
            activeTab={activeTab}
            onTabChange={(tabId) => {
              setActiveTab(tabId);
              setSelectedItem(null);
              setShowWelcome(false);
              setMergedSchematic(null);
              setSelectedCodes([]);
            }}
            onLogout={handleLogout}
            user={currentUser}
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
              <LeftPanel
                activeTab={activeTab}
                data={filteredItems}
                onItemSelect={async (item) => {
                  try {
                    console.log("🔗 Item clicked:", item.code, "Type:", item.type);

                    //  HARNESS CHECK
                    if (item.type === "Harness") {
                      console.log(" Loading harness schematic for:", item.code);

                      const harnessData = await getHarnessSchematic(item.code);
                      console.log(" Harness data received:", harnessData);

                      const converted = normalizeSchematic(harnessData);
                      console.log(" Normalized harness schematic:", converted);

                      const updatedItem = {
                        ...item,
                        schematicData: converted
                      };

                      setSelectedItem(updatedItem);
                      setMergedSchematic(null);
                      console.log(" Harness schematic set and ready to render");
                      return;
                    }

                    // SYSTEM OR COMPONENT
                    let schematicData;

                    if (item.type === "System") {
                      schematicData = await getSystemFormula(Number(item.code));
                    } else {
                      schematicData = await getComponentSchematic(item.code);
                    }
                    if (item.type === "DTC") {
                      const dtcData = await getDtcSchematic(item.code);
                      

                      const converted = normalizeSchematic(dtcData);

                      const updatedItem = {
                        ...item,
                        schematicData: converted,
                      };

                      setSelectedItem(updatedItem);
                      setMergedSchematic(null);
                      console.log("DTC schematic set and ready to render");
                      return;
                    }
                    console.log("Loaded schematic:", schematicData);

                    const converted = normalizeSchematic(schematicData);
                    const updatedItem = {
                      ...item,
                      schematicData: converted
                    };

                    setSelectedItem(updatedItem);
                    setMergedSchematic(null);
                    console.log("Updated Item with schematic data:", updatedItem);

                  } catch (err) {
                    console.error("Failed to load schematic:", err);
                  }
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
      )}
      {/* Admin DASHBOARD */}
      {page === "dashboard" && role === "admin" && token && (
        <div style={{ height: "100vh", display: "flex", flexDirection: "row" }}>

          <AdminNavigationTabs
            active={adminTab}
            onChange={setAdminTab}
            onLogout={handleLogout}
            user={currentUser}
          />

          {/* TAB CONTENT */}
          <div style={{ flex: 1 }}>
            {adminTab === "manage-users" && (
              <ManageUsers />
            )}

            {adminTab === "import-files" && (
              <ImportFiles />
            )}

            {adminTab === "view-schematic" && (
              <div
                style={{
                  height: "100vh",
                  background: "#f8f9fa",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "30px",
                }}
              >
                <NavigationTabs
                  activeTab={schematicTab}
                  onTabChange={(tabId) => {
                    setSchematicTab(tabId);
                    setSelectedItem(null);
                    setShowWelcome(false);
                    setMergedSchematic(null);
                    setSelectedCodes([]);
                  }}
                  onLogout={handleLogout}
                  user={currentUser}
                  hideLogout={true}
                  hideLogo={true}
                />

                {showWelcome ? (
                  <WelcomePage
                    onStart={() => {
                      setShowWelcome(false);
                      setSchematicTab("components");
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                    <LeftPanel
                      activeTab={schematicTab}
                      data={filteredItems}
                      onItemSelect={async (item) => {
                        try {
                          console.log("🔗 Item clicked:", item.code, "Type:", item.type);

                          //  HARNESS CHECK
                          if (item.type === "Harness") {
                            console.log(" Loading harness schematic for:", item.code);

                            const harnessData = await getHarnessSchematic(item.code);
                            console.log(" Harness data received:", harnessData);

                            const converted = normalizeSchematic(harnessData);
                            console.log(" Normalized harness schematic:", converted);

                            const updatedItem = {
                              ...item,
                              schematicData: converted
                            };

                            setSelectedItem(updatedItem);
                            setMergedSchematic(null);
                            console.log(" Harness schematic set and ready to render");
                            return;
                          }

                          // SYSTEM OR COMPONENT
                          let schematicData;

                          if (item.type === "System") {
                            schematicData = await getSystemFormula(Number(item.code));
                          } else {
                            schematicData = await getComponentSchematic(item.code);
                          }

                          if (item.type === "Supply") {
                            const supplyData = await getSupplyFormula(String(item.code));
                            console

                            const converted = normalizeSchematic(supplyData);

                            const updatedItem = {
                              ...item,
                              schematicData: converted,
                            };

                            setSelectedItem(updatedItem);
                            setMergedSchematic(null);
                            console.log("Voltage Supply schematic set and ready to render");
                            return;
                          }
                          console.log("Loaded schematic:", schematicData);
                          
                          if (item.type === "DTC") {
                            const dtcData = await getDtcSchematic(item.code);
                            console

                            const converted = normalizeSchematic(dtcData);

                            const updatedItem = {
                              ...item,
                              schematicData: converted,
                            };

                            setSelectedItem(updatedItem);
                            setMergedSchematic(null);
                            console.log("DTC schematic set and ready to render");
                            return;
                          }
                          console.log("Loaded schematic:", schematicData);

                          const converted = normalizeSchematic(schematicData);
                          const updatedItem = {
                            ...item,
                            schematicData: converted
                          };

                          setSelectedItem(updatedItem);
                          setMergedSchematic(null);
                          console.log("Updated Item with schematic data:", updatedItem);

                        } catch (err) {
                          console.error("Failed to load schematic:", err);
                        }
                      }}
                      selectedItem={selectedItem}
                      selectedCodes={selectedCodes}
                      setSelectedCodes={setSelectedCodes}
                      onViewSchematic={handleViewSchematic}
                      isMobile={isMobile}
                    />

                    {!isMobile && selectedItem?.schematicData && (
                      <Schematic data={selectedItem.schematicData} activeTab={schematicTab} />
                    )}

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
                      activeTab={schematicTab}
                      isMultipleComponents={!!mergedSchematic}
                      isMobile={isMobile}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
