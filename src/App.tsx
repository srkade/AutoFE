import React, { useState, useEffect, useRef } from "react";
import NavigationTabs from "./panels/NavigationTabs";
import LeftPanel from "./panels/LeftPanel";
import MainPanel from "./panels/MainPanel";
import Schematic from "./components/Schematic/Schematic";
import { SchematicData } from "./components/Schematic/SchematicTypes";
import "../src/Styles/global.css";
import "../src/Styles/theme.css";
import WelcomePage from "./pages/HomePage";

import LoginPage from "./pages/LoginPage";
import { mergeSchematicConfigs } from './utils/mergeSchematicConfigs';
import {
  getComponents, getComponentSchematic, getDtcs, getDtcSchematic, getHarnesses,
  getVoltageSupply, getSupplyFormula, getSystems, getSystemFormula, getHarnessSchematic, getWires, getWireDetailsByWireCode, fetchUsers
} from "./services/api";
import { normalizeSchematic } from "./utils/normalizeSchematic";
import RegisterForm from "./pages/RegistrationForm";
import { useTraceNavigation } from './hooks/useTraceNavigation';
import PasswordResetPage from './pages/PasswordResetPage';
import { useMediaQuery } from "./hooks/useMediaQuery";

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
import AuthorNavigationTabs from "./pages/AuthorNavigationTabs";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ImportFiles from "./pages/ImportedFiles";
import { useCallback } from "react";
import ImageManagement from "./pages/ImageManagement";
import GlobalSearch from "./components/GlobalSearch";
import { useGlobalSearch } from "./hooks/useGlobalSearch";
import { searchService } from "./services/searchService";


export default function App() {
  const trace = useTraceNavigation();
  const { isSearchOpen, closeSearch } = useGlobalSearch();
  const [isTraceMode, setIsTraceMode] = useState(false);
  const [traceBreadcrumb, setTraceBreadcrumb] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<"login" | "register" | "dashboard" | "password-reset">("login");
  const [role, setRole] = useState<"superadmin" | "author" | "user" | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: "superadmin" | "author" | "user";
  } | null>(null);

  const [token, setToken] = useState<string | null>(null);

  // Author dashboard panel visibility state
  const [isAuthorPanelHidden, setIsAuthorPanelHidden] = useState(false);

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
      setToken(storedToken);
      setLoggedIn(true);
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
  const [authorTab, setAuthorTab] = useState("manage-users");
  const [schematicTab, setSchematicTab] = useState("components");
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);

  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [mergedSchematic, setMergedSchematic] = useState<SchematicData | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
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
  const [usersList, setUsersList] = useState<any[]>([]);
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
    async function loadSchematics() {
      try {
        const data = await getComponents();
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
        setSystemsList(data);
      } catch (err) {
        console.error("Failed to load systems:", err);
      }
    }

    loadSystems();
  }, []);

  useEffect(() => {
    async function loadDtcs() {
      try {
        const data = await getDtcs();
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
        setVoltageSupplyList(data);
      } catch (err) {
        console.error("failed to load supply: ", err);
      }
    }
    loadSupply();
  }, []);

  useEffect(() => {
    async function loadWires() {
      try {
        const data = await getWires();
        setWireList(data);
      } catch (err) {
        console.error("failed to load wires: ", err);
      }
    }
    loadWires();
  }, []);

  useEffect(() => {
    async function loadUsers() {
      if (!loggedIn || !role || role === 'user') return;
      try {
        const data = await fetchUsers();
        setUsersList(data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    }
    loadUsers();
  }, [loggedIn, role]);

  // Navigation Shortcuts
  const navigationShortcuts = [
    { id: 'sa-home', name: 'Home / Dashboard', targetTab: 'home', description: 'Main overview and stats', role: 'superadmin' },
    { id: 'sa-settings', name: 'System Settings', targetTab: 'system-settings', description: 'Configure environment and parameters', role: 'superadmin' },
    { id: 'sa-logs', name: 'Security Logs', targetTab: 'security-logs', description: 'Audit trails and access monitoring', role: 'superadmin' },
    { id: 'sa-db', name: 'Database Management', targetTab: 'database-management', description: 'Table statistics and health', role: 'superadmin' },
    { id: 'sa-analytics', name: 'User Analytics', targetTab: 'user-analytics', description: 'Engagement and behavioral metrics', role: 'superadmin' },
    { id: 'sa-mon', name: 'System Monitoring', targetTab: 'system-monitoring', description: 'Hardware and uptime tracking', role: 'superadmin' },
    { id: 'auth-users', name: 'Manage Users', targetTab: 'manage-users', targetPage: 'manage-users', description: 'Administer user accounts and roles', role: 'author' },
    { id: 'auth-import', name: 'Import Files', targetTab: 'import-files', targetPage: 'import-files', description: 'Upload schematic data files', role: 'author' },
    { id: 'auth-images', name: 'Image Management', targetTab: 'import-images', targetPage: 'import-images', description: 'Manage component and connector graphics', role: 'author' }
  ];

  // Initialize Search Index when data changes
  useEffect(() => {
    // Filter navigation shortcuts by current user role
    const filteredNav = navigationShortcuts.filter(nav => !nav.role || nav.role === role);

    searchService.initializeSearchIndex(
      apiSchematics,
      dtcList,
      [], // connectors
      wireList,
      harnessesList,
      systemsList,
      supplyList,
      usersList,
      filteredNav
    );
  }, [apiSchematics, dtcList, wireList, harnessesList, systemsList, supplyList, usersList, role]);
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

        const data = await getHarnessSchematic(harnessCode);

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
                data = await getSupplyFormula(code);
                sourceType = "Supply";
                break;
              case "DTC":
                data = await getDtcSchematic(code);
                sourceType = "DTC";
                break;
              case "System":
                data = await getSystemFormula(Number(code));
                sourceType = "System";
                break;
              case "Harness":
                data = await getHarnessSchematic(code);
                sourceType = "Harness";
                break;
              default: // Component, Controller, etc.
                data = await getComponentSchematic(code);
                sourceType = "Component";
                break;
            }
          } else {
            // Fallback to component schematic if type is unknown
            data = await getComponentSchematic(code);
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
      if (targetTab === 'harnesses') rawData = await getHarnessSchematic(componentCode);
      else if (targetTab === 'voltage') rawData = await getSupplyFormula(componentCode);
      else if (targetTab === 'DTC') rawData = await getDtcSchematic(componentCode);
      else if (targetTab === 'systems') rawData = await getSystemFormula(Number(componentCode));
      else rawData = await getComponentSchematic(componentCode);


      const normalized = normalizeSchematic(rawData);

      setMergedSchematic(null);
      setSelectedItem({ ...dashboardItem, schematicData: normalized });

    } catch (error) {
      console.error("❌ TRACE ERROR: API fetch failed", error);
    }
  }, [dashboardItems, activeTab, selectedItem, mergedSchematic, trace]);

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
        schematicData = await getHarnessSchematic(item.code);
      } else if (item.type === "System") {
        schematicData = await getSystemFormula(Number(item.code));
      } else if (item.type === "Supply") {
        schematicData = await getSupplyFormula(item.code);
      } else if (item.type === "DTC") {
        schematicData = await getDtcSchematic(item.code);
      } else if (item.type === "wire") {
        const wireDetails = await getWireDetailsByWireCode(item.code);
        schematicData = { name: `Wire ${item.code}`, wires: wireDetails };
      } else {
        schematicData = await getComponentSchematic(item.code);
      }

      const converted = normalizeSchematic(schematicData);
      setSelectedItem({ ...item, schematicData: converted });
    } catch (err) {
      console.error("Failed to selection item:", err);
    }
  }, [role, schematicTab, activeTab]);

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
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        {page === "login" && (
          <div style={{ height: "100vh", overflowY: "auto", background: "var(--bg-primary)" }}>
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onRegisterClick={() => setPage("register")}
              setToken={setToken}
            />
          </div>
        )}

        {page === "register" && (
          <div style={{ height: "100vh", overflowY: "auto", background: "var(--bg-primary)" }}>
            <RegisterForm onBackToLogin={() => setPage("login")}
              isAuthor={role === "author"} />
          </div>
        )}

        {page === "password-reset" && (
          <PasswordResetPage />
        )}

        {/* USER DASHBOARD */}
        {page === "dashboard" && role === "user" && token && (
          <div
            style={{
              height: "100vh",
              background: "var(--bg-primary)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <NavigationTabs
              activeTab={activeTab}
              onTabChange={(tabId: string) => {
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
            />

            {showWelcome ? (
              <WelcomePage
                onStart={() => {
                  setShowWelcome(false);
                  setActiveTab("components");
                }}
              />
            ) : (
              <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: isMobile ? "column" : "row" }}>
                {(!isMobile || (!selectedItem && !mergedSchematic)) && (
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
                )}

                {(!isMobile || selectedItem || mergedSchematic) && (
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
                  />
                )}
              </div>
            )}
          </div>
        )}
        {/* Author DASHBOARD */}
        {page === "dashboard" && role === "author" && token && (
          <div className={`admin-container ${isAuthorPanelHidden ? 'panel-hidden' : ''}`}>
            <AuthorNavigationTabs
              active={authorTab}
              onChange={setAuthorTab}
              onLogout={handleLogout}
              user={currentUser}
              isPanelHidden={isAuthorPanelHidden}
              onPanelToggle={setIsAuthorPanelHidden}
            />

            {/* TAB CONTENT */}
            <div className="content-panel">
              {authorTab === "manage-users" && (
                <ManageUsers />
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
                    background: "var(--bg-primary)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <NavigationTabs
                    activeTab={schematicTab}
                    onTabChange={(tabId: string) => {
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
                  />

                  {showWelcome ? (
                    <WelcomePage
                      onStart={() => {
                        setShowWelcome(false);
                        setSchematicTab("components");
                      }}
                    />
                  ) : (
                    <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: isMobile ? "column" : "row" }}>
                      {(!isMobile || (!selectedItem && !mergedSchematic)) && (
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
                      )}

                      {(!isMobile || selectedItem || mergedSchematic) && (
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
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SuperAdmin DASHBOARD */}
        {page === "dashboard" && role === "superadmin" && token && (
          <SuperAdminDashboard token={token} onLogout={handleLogout} />
        )}

        <GlobalSearch
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onItemSelected={(item: any) => {
            // Handle Navigation shortcuts
            if (item.type === 'navigation') {
              if (role === 'superadmin') {
                const event = new CustomEvent('navigateSuperAdminTab', { detail: item.metadata?.targetTab });
                window.dispatchEvent(event);
              } else if (role === 'author') {
                if (item.metadata?.targetPage) setAuthorTab(item.metadata.targetPage);
              }
              return;
            }

            // Handle User search
            if (item.type === 'user') {
              if (role === 'author') {
                setAuthorTab('manage-users');
              } else if (role === 'superadmin') {
                const event = new CustomEvent('navigateSuperAdminTab', { detail: 'user-analytics' });
                window.dispatchEvent(event);
              }
              return;
            }

            // Default: Schematic items
            const dashboardItem = dashboardItems.find(di => di.code === item.code);
            if (dashboardItem) {
              handleItemSelection(dashboardItem);
            }
          }}
        />
      </div>
  );
}