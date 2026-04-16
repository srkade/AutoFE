import React, { useState, useEffect, useRef } from "react";
import NavigationTabs from "./panels/NavigationTabs";
import { FiX } from "react-icons/fi";
import LeftPanel from "./panels/LeftPanel";
import MainPanel from "./panels/MainPanel";
import Schematic from "./components/Schematic/Schematic";
import { SchematicData } from "./components/Schematic/SchematicTypes";
import "../src/Styles/global.css";
import WelcomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { mergeSchematicConfigs } from './utils/mergeSchematicConfigs';
import {
  getComponents, getComponentSchematic, getDtcs, getDtcSchematic, getHarnesses,
  getVoltageSupply, getSupplyFormula, getSystems, getSystemFormula, getHarnessSchematic, getWires, getWireDetailsByWireCode
} from "./services/api";
import { AuditLogProvider } from "./context/AuditLogContext";
import { AuditLogViewer } from "./components/AuditLogViewer";
import { normalizeSchematic } from "./utils/normalizeSchematic";
import RegisterForm from "./pages/RegistrationForm";
import { useTraceNavigation } from './hooks/useTraceNavigation';
import PasswordResetPage from './pages/PasswordResetPage';

export type DashboardItem = {
  code: string;
  name: string;
  type: string;
  status: "Active" | "Inactive";
  voltage?: string;
  description: string;
  schematicData: SchematicData;
};
import AuthorDashboard from "./pages/AuthorDashboard";
import AuthorNavigationTabs, { AuthorTopbar } from "./pages/AuthorNavigationTabs";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ImportFiles from "./pages/ImportedFiles";
import { useCallback } from "react";
import ImageManagement from "./pages/ImageManagement";
import GlobalSearch from "./components/GlobalSearch";
import { useGlobalSearch } from "./hooks/useGlobalSearch";
import { searchService } from "./services/searchService";
import ModelManagement from "./pages/ModelManagement";


function AppContent() {
  const trace = useTraceNavigation();
  const { isSearchOpen, closeSearch } = useGlobalSearch();
  const [isTraceMode, setIsTraceMode] = useState(false);
  const [traceBreadcrumb, setTraceBreadcrumb] = useState("");
  const [selectedModelId, setSelectedModelId] = useState<string | null>(sessionStorage.getItem("selectedModelId"));

  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<"login" | "register" | "dashboard" | "password-reset">("login");
  const [role, setRole] = useState<"superadmin" | "author" | "user" | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: "superadmin" | "author" | "user";
  } | null>(null);
  const [modelCount, setModelCount] = useState<number | null>(null);




  const handleLoginSuccess = (loggedInRole: "superadmin" | "author" | "user", user: any) => {
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
    // Check if we're on the password reset page (has token in URL)
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');

    if (resetToken) {
      // We're on the password reset page
      setPage("password-reset");
      return;
    }

    const storedUser = sessionStorage.getItem("currentUser");
    const storedRole = sessionStorage.getItem("role");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedRole && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setRole(storedRole as "superadmin" | "author" | "user");
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


  const [isAuthorPanelCollapsed, setIsAuthorPanelCollapsed] = useState(false);
  const [isAuthorMenuOpen, setIsAuthorMenuOpen] = useState(false);

  // User Dashboard State
  const [activeTab, setActiveTab] = useState("components");
  const [authorTab, setAuthorTab] = useState("manage-users");
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
        const data = await getComponents(selectedModelId || undefined);
        setApiSchematics(data);
      } catch (err) {
        console.error("Failed to load components:", err);
      }
    }

    loadSchematics();
  }, [selectedModelId]);

  useEffect(() => {
    async function loadSystems() {
      try {
        const data = await getSystems(selectedModelId || undefined);
        setSystemsList(data);
      } catch (err) {
        console.error("Failed to load systems:", err);
      }
    }

    loadSystems();
  }, [selectedModelId]);

  useEffect(() => {
    async function loadDtcs() {
      try {
        const data = await getDtcs(selectedModelId || undefined);
        setDtcList(data);
      } catch (err) {
        console.error("Failed to load DTC list:", err);
      }
    }

    loadDtcs();
  }, [selectedModelId]);

  useEffect(() => {
    async function loadHarnesses() {
      try {
        const data = await getHarnesses(selectedModelId || undefined);
        setHarnessesList(data);
      } catch (err) {
        console.error("Failed to load harnesses:", err);
      }
    }

    loadHarnesses();
  }, [selectedModelId]);
  useEffect(() => {
    async function loadSupply() {
      try {
        const data = await getVoltageSupply(selectedModelId || undefined);
        setVoltageSupplyList(data);
      } catch (err) {
        console.error("failed to load supply: ", err);
      }
    }
    loadSupply();
  }, [selectedModelId]);

  useEffect(() => {
    async function loadWires() {
      try {
        const data = await getWires(selectedModelId || undefined);
        setWireList(data);
      } catch (err) {
        console.error("failed to load wires: ", err);
      }
    }
    loadWires();
  }, [selectedModelId]);

  // Initialize Search Index when data changes
  useEffect(() => {
    if (apiSchematics.length > 0) {
      searchService.initializeSearchIndex(
        apiSchematics,
        dtcList,
        [], // connectors - can be added later if available
        wireList,
        harnessesList,
        systemsList,
        supplyList
      );
    }
  }, [apiSchematics, dtcList, wireList, harnessesList, systemsList, supplyList]);
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
      // If no codes selected, clear the merged schematic
      if (codes.length === 0) {
        setMergedSchematic(null);
        setSelectedItem(null);
        return;
      }

      const tab = role === "author" ? schematicTab : activeTab;

      if (tab === "harnesses") {

        // Use only the first selected harness for now
        const harnessCode = codes[0];

        const data = await getHarnessSchematic(harnessCode, selectedModelId || undefined);

        const normalized = normalizeSchematic(data);

        setMergedSchematic(normalized);
        setSelectedItem(null);
        return;
      }

      // Determine the type of each code based on the current tab context
      const fetchResults = await Promise.all(
        codes.map(async (code) => {
          // Find the dashboard item to determine the type
          // First, try to find an item that matches the current tab context
          let dashboardItem;

          if (tab === "voltage") {
            // When in voltage tab, prioritize supply items with the same code
            dashboardItem = dashboardItems.find(item => item.code === code && item.type === "Supply");
          }

          // If no supply item found in voltage tab or not in voltage tab, find any item with the code
          if (!dashboardItem) {
            dashboardItem = dashboardItems.find(item => item.code === code);
          }

          let data;
          let sourceType: string | undefined;

          if (dashboardItem) {
            switch (dashboardItem.type) {
              case "Supply":
                data = await getSupplyFormula(code, selectedModelId || undefined);
                sourceType = "Supply";
                break;
              case "DTC":
                data = await getDtcSchematic(code, selectedModelId || undefined);
                sourceType = "DTC";
                break;
              case "System":
                data = await getSystemFormula(code, selectedModelId || undefined);
                sourceType = "System";
                break;
              case "Harness":
                data = await getHarnessSchematic(code, selectedModelId || undefined);
                sourceType = "Harness";
                break;
              default: // Component, Controller, etc.
                data = await getComponentSchematic(code, selectedModelId || undefined);
                sourceType = "Component";
                break;
            }
          } else {
            // Fallback to component schematic if type is unknown
            data = await getComponentSchematic(code, selectedModelId || undefined);
            sourceType = "Component";
          }

          const normalized = normalizeSchematic(data);
          // Add source type information to the normalized data
          return { ...normalized, sourceType };
        })
      );

      // Extract the actual schematic data for merging
      const fetchedSchematics = fetchResults.map(result => {
        const { sourceType, ...schematicData } = result;
        return schematicData;
      });

      // Pass source information to the merge function
      const sourceTypes = fetchResults.map(result => result.sourceType);

      const currentTab = role === "author" ? schematicTab : activeTab;
      const merged = mergeSchematicConfigs(fetchedSchematics, undefined, currentTab);
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
  // Inside App.tsx - Replace handleComponentRightClick
  const handleComponentRightClick = useCallback(async (component: any) => {

    const componentCode = component.id;
    const itemName = component.label || component.id;

    // Find the item in dashboardItems
    const dashboardItem = dashboardItems.find(i => i.code === componentCode);

    if (!dashboardItem) {
      console.error("❌ TRACE 2: Component code not found in dashboardItems:", componentCode);
      return;
    }


    let targetTab = 'components';
    if (dashboardItem.type === 'System') targetTab = 'systems';
    if (dashboardItem.type === 'Harness') targetTab = 'harnesses';
    if (dashboardItem.type === 'DTC') targetTab = 'DTC';
    if (dashboardItem.type === 'Supply') targetTab = 'voltage';


    // Enter Trace Mode - now with the original state
    trace.enterTrace(targetTab, componentCode, itemName, activeTab, selectedItem, mergedSchematic);
    setActiveTab(targetTab);

    try {
      let rawData;
      if (targetTab === 'harnesses') rawData = await getHarnessSchematic(componentCode, selectedModelId || undefined);
      else if (targetTab === 'voltage') rawData = await getSupplyFormula(componentCode, selectedModelId || undefined);
      else if (targetTab === 'DTC') rawData = await getDtcSchematic(componentCode, selectedModelId || undefined);
      else if (targetTab === 'systems') rawData = await getSystemFormula(componentCode, selectedModelId || undefined);
      else rawData = await getComponentSchematic(componentCode, selectedModelId || undefined);


      const normalized = normalizeSchematic(rawData);

      setMergedSchematic(null);
      setSelectedItem({ ...dashboardItem, schematicData: normalized });

    } catch (error) {
      console.error("❌ TRACE ERROR: API fetch failed", error);
    }
  }, [dashboardItems, activeTab, selectedItem, mergedSchematic, trace, selectedModelId]);

  const handleItemSelection = useCallback(async (item: DashboardItem) => {
    try {

      setMergedSchematic(null);
      setShowWelcome(false);

      // Determine target tab based on item type
      let targetTab = role === "author" ? schematicTab : activeTab;

      const typeToTab: Record<string, string> = {
        'System': 'systems',
        'Harness': 'harnesses',
        'DTC': 'DTC',
        'Supply': 'voltage',
        'wire': 'wire',
        'Controller': 'controllers',
        'Component': 'components'
      };

      if (typeToTab[item.type]) {
        targetTab = typeToTab[item.type];
      }

      if (role === "author") setSchematicTab(targetTab);
      else setActiveTab(targetTab);

      let schematicData;
      if (item.type === "Harness") {
        schematicData = await getHarnessSchematic(item.code, selectedModelId || undefined);
      } else if (item.type === "System") {
        schematicData = await getSystemFormula(item.code, selectedModelId || undefined);
      } else if (item.type === "Supply") {
        schematicData = await getSupplyFormula(item.code, selectedModelId || undefined);
      } else if (item.type === "DTC") {
        schematicData = await getDtcSchematic(item.code, selectedModelId || undefined);
      } else if (item.type === "wire") {
        const wireDetails = await getWireDetailsByWireCode(item.code, selectedModelId || undefined);
        schematicData = { name: `Wire ${item.code}`, wires: wireDetails };
      } else {
        schematicData = await getComponentSchematic(item.code, selectedModelId || undefined);
      }

      const converted = normalizeSchematic(schematicData);
      setSelectedItem({ ...item, schematicData: converted });
    } catch (err) {
      console.error("Failed to selection item:", err);
    }
  }, [role, schematicTab, activeTab, selectedModelId]);

  const filteredItems = dashboardItems.filter((item) => {
    const filterBase = role === "author" ? schematicTab : activeTab;

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
          isAuthor={role === "author"} />
      )}

      {page === "password-reset" && (
        <PasswordResetPage />
      )}

      {/* USER DASHBOARD */}
      {page === "dashboard" && role === "user" && token && (
        <div
          style={{
            height: "100vh",
            background: "var(--bg-primary, #f6f8fc)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <NavigationTabs
            activeTab={activeTab}
            onTabChange={(tabId) => {
              // Exit trace mode when changing tabs
              if (trace.isTraceMode) {
                trace.exitTrace();
              }
              setActiveTab(tabId);
              setSelectedItem(null);
              setShowWelcome(false);
              setMergedSchematic(null);
              setSelectedCodes([]);
            }}
            onLogout={handleLogout}
            user={currentUser}
            selectedModelId={selectedModelId}
            onModelChange={(id) => {
              setSelectedModelId(id);
              if (id) sessionStorage.setItem("selectedModelId", id);
              else sessionStorage.removeItem("selectedModelId");
              setSelectedItem(null);
              setMergedSchematic(null);
              setSelectedCodes([]);
            }}
            onModelsLoaded={setModelCount}
          />

          {modelCount === 0 && role === "user" ? (
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-primary)",
              padding: "40px",
              textAlign: "center"
            }}>
              <div style={{
                padding: "60px 40px",
                background: "var(--bg-secondary)",
                borderRadius: "16px",
                boxShadow: "var(--card-shadow)",
                maxWidth: "600px",
                border: "1px solid var(--border-color)"
              }}>
                <div style={{ 
                  width: "80px", 
                  height: "80px", 
                  borderRadius: "50%", 
                  background: "#fee2e2", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  color: "#ef4444"
                }}>
                  <FiX size={40} />
                </div>
                <h2 style={{ fontSize: "24px", color: "var(--text-primary)", marginBottom: "16px", fontWeight: "700" }}>Access Restricted</h2>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "0" }}>
                  You don't have access of models. Please contact with your respective admin for assistance.
                </p>
              </div>
            </div>
          ) : showWelcome ? (
            <WelcomePage
              onStart={() => {
                setShowWelcome(false);
                setActiveTab("components");
              }}
            />
          ) : (
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              <div style={{ display: isMobile && (selectedItem || mergedSchematic) ? 'none' : 'flex', flexShrink: 0, height: '100%', width: isMobile ? '100%' : 'auto' }}>
                <LeftPanel
                  activeTab={activeTab}
                  data={filteredItems}
                  traceMode={trace.isTraceMode}
                  onItemSelect={handleItemSelection}
                  selectedItem={selectedItem}
                  selectedCodes={selectedCodes}
                  setSelectedCodes={setSelectedCodes}
                  onViewSchematic={handleViewSchematic}
                  isMobile={isMobile}
                />
              </div>

              {/* Render single item schematic only if no merged schematic is present */}
              {/* {!isMobile && selectedItem?.schematicData && !mergedSchematic && (
                <Schematic key={selectedItem.code} data={selectedItem.schematicData} activeTab={activeTab} />
              )} */}


              <div style={{ display: isMobile && !(selectedItem || mergedSchematic) ? 'none' : 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
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

                onComponentRightClick={handleComponentRightClick}
                traceMode={trace.isTraceMode}
                traceBreadcrumb={trace.getBreadcrumb()}
                onBackClick={() => {
                  const prevState = trace.exitTrace();
                  setActiveTab(prevState.tab);
                  setSelectedItem(prevState.selectedItem);
                  setMergedSchematic(prevState.mergedSchematic);
                  setSelectedCodes([]);
                }}
                onMobileBack={() => {
                  setSelectedItem(null);
                  setMergedSchematic(null);
                  setSelectedCodes([]);
                }}
              />
              </div>
            </div>
          )}
        </div>
      )}
            {/* Author DASHBOARD */}
      {page === "dashboard" && role === "author" && token && (
        <div style={{ height: "100vh", display: "flex", flexDirection: "row", overflow: "hidden" }}>

          <AuthorNavigationTabs
            active={authorTab}
            onChange={setAuthorTab}
            onLogout={handleLogout}
            user={currentUser}
            selectedModelId={selectedModelId}
            onModelChange={(id) => {
              setSelectedModelId(id);
              if (id) sessionStorage.setItem("selectedModelId", id);
              else sessionStorage.removeItem("selectedModelId");
            }}
            isPanelCollapsed={isAuthorPanelCollapsed}
            onPanelCollapse={setIsAuthorPanelCollapsed}
            isMenuOpen={isAuthorMenuOpen}
            setIsMenuOpen={setIsAuthorMenuOpen}
          />

          {/* TAB CONTENT */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <AuthorTopbar
              onLogout={handleLogout}
              user={currentUser}
              token={token}
              selectedModelId={selectedModelId}
              onModelChange={(id) => {
                setSelectedModelId(id);
                if (id) sessionStorage.setItem("selectedModelId", id);
                else sessionStorage.removeItem("selectedModelId");
              }}
              isPanelCollapsed={isAuthorPanelCollapsed}
              onPanelCollapse={setIsAuthorPanelCollapsed}
              setIsMenuOpen={setIsAuthorMenuOpen}
            />
            
            <div className="content-panel">
              {authorTab === "manage-users" && (
                <ManageUsers />
              )}
              {authorTab === "manage-models" && (
                <ModelManagement />
              )}

              {authorTab === "import-files" && (
                <ImportFiles />
              )}
              {authorTab === "import-images" && (
                <ImageManagement />
              )}

              {authorTab === "view-schematic" && (
                <div
                  style={{
                    height: "100%",
                    background: "var(--bg-primary, #f6f8fc)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <NavigationTabs
                    activeTab={schematicTab}
                    onTabChange={(tabId) => {
                      // Exit trace mode when changing tabs
                      if (trace.isTraceMode) {
                        trace.exitTrace();
                      }
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
                    hideSearch={true}
                    hideModelSelector={true}
                    selectedModelId={selectedModelId}
                    onModelChange={(id) => {
                      setSelectedModelId(id);
                      if (id) sessionStorage.setItem("selectedModelId", id);
                      else sessionStorage.removeItem("selectedModelId");
                      setSelectedItem(null);
                      setMergedSchematic(null);
                      setSelectedCodes([]);
                    }}
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
                      <div style={{ display: isMobile && (selectedItem || mergedSchematic) ? 'none' : 'flex', flexShrink: 0, height: '100%', width: isMobile ? '100%' : 'auto' }}>
                        <LeftPanel
                          activeTab={schematicTab}
                          data={filteredItems}
                          traceMode={trace.isTraceMode}
                          onItemSelect={handleItemSelection}
                          selectedItem={selectedItem}
                          selectedCodes={selectedCodes}
                          setSelectedCodes={setSelectedCodes}
                          onViewSchematic={handleViewSchematic}
                          isMobile={isMobile}
                        />
                      </div>

                      <div style={{ display: isMobile && !(selectedItem || mergedSchematic) ? 'none' : 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
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
                        onComponentRightClick={handleComponentRightClick}
                        traceMode={trace.isTraceMode}
                        traceBreadcrumb={trace.getBreadcrumb()}
                        onBackClick={() => {
                          const prevState = trace.exitTrace();
                          setActiveTab(prevState.tab);
                          setSelectedItem(prevState.selectedItem);
                          setMergedSchematic(prevState.mergedSchematic);
                          setSelectedCodes([]);
                        }}
                        onMobileBack={() => {
                          setSelectedItem(null);
                          setMergedSchematic(null);
                          setSelectedCodes([]);
                        }}
                      />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUPER ADMIN DASHBOARD */}
      {page === "dashboard" && role === "superadmin" && token && (
        <SuperAdminDashboard
          token={token}
          onLogout={handleLogout}
          selectedModelId={selectedModelId}
          onModelChange={(id) => {
            setSelectedModelId(id);
            if (id) sessionStorage.setItem("selectedModelId", id);
            else sessionStorage.removeItem("selectedModelId");
          }}
        />
      )}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onItemSelected={(item) => {
          const dashboardItem = dashboardItems.find(di => di.code === item.code);
          if (dashboardItem) {
            handleItemSelection(dashboardItem);
          }
        }}
      />
      <AuditLogViewer currentUserEmail={currentUser?.email} />
    </div>
  );
}
export default function App() { return ( <AuditLogProvider> <AppContent /> </AuditLogProvider> ); }
