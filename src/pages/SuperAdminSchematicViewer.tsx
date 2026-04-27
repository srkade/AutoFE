import React, { useState, useEffect, useCallback } from "react";
import { 
  getCompanies, 
  getModels, 
  getComponents, 
  getComponentSchematic, 
  getDtcs, 
  getDtcSchematic, 
  getHarnesses, 
  getHarnessSchematic, 
  getVoltageSupply, 
  getSupplyFormula, 
  getSystems, 
  getSystemFormula, 
  getWires, 
  getWireDetailsByWireCode,
  Company,
  Model 
} from "../services/api";
import { DashboardItem } from "../App";
import { SchematicData } from "../components/Schematic/SchematicTypes";
import { normalizeSchematic } from "../utils/normalizeSchematic";
import { mergeSchematicConfigs } from "../utils/mergeSchematicConfigs";
import { mergeSchematics } from "../components/Schematic/SchematicUtils";
import { useTraceNavigation } from "../hooks/useTraceNavigation";
import NavigationTabs from "../panels/NavigationTabs";
import LeftPanel from "../panels/LeftPanel";
import MainPanel from "../panels/MainPanel";
import { FiLayers, FiAlertCircle } from "react-icons/fi";
import "../Styles/SuperAdminSchematicViewer.css";

interface SuperAdminSchematicViewerProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  onLogout: () => void;
}

export default function SuperAdminSchematicViewer({ user, onLogout }: SuperAdminSchematicViewerProps) {
  const trace = useTraceNavigation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  // Schematic State
  const [activeTab, setActiveTab] = useState("components");
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [mergedSchematic, setMergedSchematic] = useState<SchematicData | null>(null);
  
  // Data Lists
  const [components, setComponents] = useState<any[]>([]);
  const [dtcList, setDtcList] = useState<any[]>([]);
  const [harnessesList, setHarnessesList] = useState<any[]>([]);
  const [supplyList, setVoltageSupplyList] = useState<any[]>([]);
  const [wireList, setWireList] = useState<any[]>([]);
  const [systemsList, setSystemsList] = useState<any[]>([]);

  // Initialize
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, modelsData] = await Promise.all([
          getCompanies(),
          getModels()
        ]);
        setCompanies(companiesData.filter(c => !c.isDeleted));
        setAllModels(modelsData.filter(m => !m.isDeleted));
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      }
    };
    fetchData();
  }, []);

  const filteredModels = allModels.filter(m => m.companyId === selectedCompanyId);

  // Load model specific data
  useEffect(() => {
    if (!selectedModelId) {
      setComponents([]);
      setDtcList([]);
      setHarnessesList([]);
      setVoltageSupplyList([]);
      setWireList([]);
      setSystemsList([]);
      return;
    }

    const loadModelData = async () => {
      setLoading(true);
      try {
        const [compData, sysData, dtcData, harnData, suppData, wireData] = await Promise.all([
          getComponents(selectedModelId),
          getSystems(selectedModelId),
          getDtcs(selectedModelId),
          getHarnesses(selectedModelId),
          getVoltageSupply(selectedModelId),
          getWires(selectedModelId)
        ]);
        setComponents(compData);
        setSystemsList(sysData);
        setDtcList(dtcData);
        setHarnessesList(harnData);
        setVoltageSupplyList(suppData);
        setWireList(wireData);
      } catch (err) {
        console.error("Failed to load model data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadModelData();
  }, [selectedModelId]);

  // Reset schematic state when model or company changes
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanyId(e.target.value);
    setSelectedModelId("");
    resetSchematicState();
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModelId(e.target.value);
    resetSchematicState();
  };

  const resetSchematicState = () => {
    setSelectedItem(null);
    setSelectedCodes([]);
    setMergedSchematic(null);
    if (trace.isTraceMode) trace.exitTrace();
  };

  // Construct dashboard items (mapping logic from App.tsx)
  const dashboardItems: DashboardItem[] = [
    ...components.map(api => ({
      code: api.code,
      name: api.name,
      type: api.code === "ICC" ? "Controller" : api.type || api.category || "Component",
      status: "Active" as const,
      description: `Schematic for ${api.name}`,
      schematicData: {
        masterComponents: api.masterComponents || [],
        components: api.components || [],
        connections: api.connections || [],
        name: api.name || "Unnamed Schematic"
      }
    })),
    ...dtcList.map(d => ({
      code: d.code, name: d.name, type: "DTC", status: "Active" as const, description: d.comment || "",
      schematicData: { masterComponents: [], components: [], connections: [], name: d.name }
    })),
    ...systemsList.map(s => ({
      code: s.code, name: s.name, type: "System", status: "Active" as const, description: s.description || "",
      schematicData: { masterComponents: [], components: [], connections: [], name: s.name }
    })),
    ...harnessesList.map(h => ({
      code: h.code, name: h.name, type: "Harness", status: "Active" as const, description: h.description || "",
      schematicData: { masterComponents: [], components: [], connections: [], name: h.name }
    })),
    ...supplyList.map(s => ({
      code: s.code, name: s.name, type: "Supply", status: "Active" as const, description: s.description || "",
      schematicData: { masterComponents: [], components: [], connections: [], name: s.name }
    })),
    ...wireList.map(w => ({
      code: w.code, name: w.name, type: "wire", status: "Active" as const, description: w.description || "",
      schematicData: { masterComponents: [], components: [], connections: [], name: w.name }
    }))
  ];

  const filteredItems = dashboardItems.filter(item => {
    switch (activeTab) {
      case "components": return item.type === "Component" || item.code === "ICC";
      case "controllers": return item.type === "Controller" || item.code === "ICC";
      case "systems": return item.type === "System";
      case "voltage": return item.type === "Supply";
      case "DTC": return item.type === "DTC";
      case "wire": return item.type === "wire";
      case "harnesses": return item.type === "Harness";
      default: return true;
    }
  });

  // Action Handlers
  const handleItemSelection = useCallback(async (item: DashboardItem) => {
    try {
      setMergedSchematic(null);
      let schematicData;
      if (item.type === "Harness") schematicData = await getHarnessSchematic(item.code, selectedModelId);
      else if (item.type === "System") schematicData = await getSystemFormula(item.code, selectedModelId);
      else if (item.type === "Supply") schematicData = await getSupplyFormula(item.code, selectedModelId);
      else if (item.type === "DTC") schematicData = await getDtcSchematic(item.code, selectedModelId);
      else if (item.type === "wire") {
        const wireDetails = await getWireDetailsByWireCode(item.code, selectedModelId);
        schematicData = { name: `Wire ${item.code}`, wires: wireDetails };
      } else schematicData = await getComponentSchematic(item.code, selectedModelId);

      const converted = normalizeSchematic(schematicData);
      setSelectedItem({ ...item, schematicData: converted });
    } catch (err) {
      console.error("Failed to select item:", err);
    }
  }, [selectedModelId]);

  const handleViewSchematic = useCallback(async (codes: string[]) => {
    try {
      if (codes.length === 0) {
        setMergedSchematic(null);
        setSelectedItem(null);
        return;
      }

      if (activeTab === "harnesses") {
        const data = await getHarnessSchematic(codes[0], selectedModelId);
        setMergedSchematic(normalizeSchematic(data));
        setSelectedItem(null);
        return;
      }

      const fetchResults = await Promise.all(codes.map(async (code) => {
        const item = dashboardItems.find(i => i.code === code);
        let data;
        if (item?.type === "Supply") data = await getSupplyFormula(code, selectedModelId);
        else if (item?.type === "DTC") data = await getDtcSchematic(code, selectedModelId);
        else if (item?.type === "System") data = await getSystemFormula(code, selectedModelId);
        else data = await getComponentSchematic(code, selectedModelId);
        return normalizeSchematic(data);
      }));

      const merged = mergeSchematicConfigs(fetchResults, undefined, activeTab);
      setMergedSchematic(merged);
      setSelectedItem(null);
    } catch (err) {
      console.error("Error merging schematics:", err);
    }
  }, [activeTab, selectedModelId, dashboardItems]);

  const handleComponentRightClick = useCallback(async (component: any) => {
    const componentCode = component.id;
    const dashboardItem = dashboardItems.find(i => i.code === componentCode);
    if (!dashboardItem) return;

    let targetTab = 'components';
    if (dashboardItem.type === 'System') targetTab = 'systems';
    if (dashboardItem.type === 'Harness') targetTab = 'harnesses';
    if (dashboardItem.type === 'DTC') targetTab = 'DTC';
    if (dashboardItem.type === 'Supply') targetTab = 'voltage';

    trace.enterTrace(targetTab, componentCode, component.label || component.id, activeTab, selectedItem, mergedSchematic);
    setActiveTab(targetTab);

    try {
      let rawData;
      if (targetTab === 'harnesses') rawData = await getHarnessSchematic(componentCode, selectedModelId);
      else if (targetTab === 'voltage') rawData = await getSupplyFormula(componentCode, selectedModelId);
      else if (targetTab === 'DTC') rawData = await getDtcSchematic(componentCode, selectedModelId);
      else if (targetTab === 'systems') rawData = await getSystemFormula(componentCode, selectedModelId);
      else rawData = await getComponentSchematic(componentCode, selectedModelId);

      setMergedSchematic(null);
      setSelectedItem({ ...dashboardItem, schematicData: normalizeSchematic(rawData) });
    } catch (error) {
      console.error("Trace error:", error);
    }
  }, [dashboardItems, activeTab, selectedItem, mergedSchematic, trace, selectedModelId]);

  const handleSpliceExpand = useCallback(async (splice: any) => {
    try {
      const extraDataRaw = await getComponentSchematic(splice.id, selectedModelId);
      const extraData = normalizeSchematic(extraDataRaw);
      const currentData = mergedSchematic || selectedItem?.schematicData;
      if (!currentData) return;
      const merged = mergeSchematics(currentData, extraData);
      setMergedSchematic(merged);
    } catch (err) {
      console.error("Failed to expand splice:", err);
    }
  }, [mergedSchematic, selectedItem, selectedModelId]);

  return (
    <div className="sa-schematic-viewer">
      <div className="sa-selection-bar">
        <div className="sa-select-group">
          <label className="sa-select-label">Company</label>
          <select 
            className="sa-select-input" 
            value={selectedCompanyId} 
            onChange={handleCompanyChange}
          >
            <option value="">Select a Company</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="sa-select-group">
          <label className="sa-select-label">Vehicle Model</label>
          <select 
            className="sa-select-input" 
            value={selectedModelId} 
            onChange={handleModelChange}
            disabled={!selectedCompanyId}
          >
            <option value="">Select a Model</option>
            {filteredModels.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sa-viewer-content">
        {!selectedModelId ? (
          <div className="sa-no-selection">
            <FiLayers className="sa-no-selection-icon" />
            <h3>No Model Selected</h3>
            <p>Please select a company and a vehicle model to view schematics.</p>
          </div>
        ) : (
          <>
            <NavigationTabs 
              activeTab={activeTab} 
              onTabChange={(id) => {
                if (trace.isTraceMode) trace.exitTrace();
                setActiveTab(id);
                setSelectedItem(null);
                setMergedSchematic(null);
                setSelectedCodes([]);
              }}
              user={user}
              onLogout={onLogout}
              hideLogout hideLogo hideSearch hideModelSelector
            />
            
            <div className="sa-schematic-area">
              <LeftPanel 
                activeTab={activeTab}
                data={filteredItems}
                onItemSelect={handleItemSelection}
                selectedItem={selectedItem}
                selectedCodes={selectedCodes}
                setSelectedCodes={setSelectedCodes}
                onViewSchematic={handleViewSchematic}
                isMobile={false}
                traceMode={trace.isTraceMode}
              />

              <div className="sa-main-panel-container">
                <MainPanel 
                  selectedItem={mergedSchematic ? {
                    code: "MERGED", name: "Merged Schematic", type: "Merged", status: "Active", voltage: "12V",
                    description: "Merged view", schematicData: mergedSchematic
                  } : selectedItem}
                  activeTab={activeTab}
                  isMultipleComponents={!!mergedSchematic}
                  isMobile={false}
                  onComponentRightClick={handleComponentRightClick}
                  onSpliceRightClick={handleSpliceExpand}
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
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
