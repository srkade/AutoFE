import React, { useState, useEffect } from "react";
import { Search, XCircle, Download, FileText, FileImage } from "lucide-react";

import { DashboardItem } from "../App";

import "../Styles/LeftPanel.css";

import Schematic from "../components/Schematic/Schematic";
import { SchematicData } from "../components/Schematic/SchematicTypes";

interface LeftPanelProps {
  activeTab: string;
  data: DashboardItem[];
  onItemSelect: (item: DashboardItem) => void;
  selectedItem: DashboardItem | null;
  selectedCodes: string[];
  setSelectedCodes: React.Dispatch<React.SetStateAction<string[]>>;
  onViewSchematic: (selectedCodes: string[]) => void;
  isMobile: boolean;
  traceMode?: boolean;
  schematicData?: SchematicData | null;
  onHighlightElement?: (id: string | null) => void;
  onExportPDF?: (codes: string[]) => void;
  onExportImages?: (codes: string[]) => void;
}

export default function LeftPanel({
  activeTab,
  data,
  onItemSelect,
  selectedItem,
  selectedCodes,
  setSelectedCodes,
  onViewSchematic,
  isMobile,
  traceMode = false,
  schematicData,
  onHighlightElement,
  onExportPDF,
  onExportImages,
}: LeftPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activePanelTab, setActivePanelTab] = useState<"index" | "legend">("index");
  const [highlightedLegendId, setHighlightedLegendId] = useState<string | null>(null);
  const [exportQueue, setExportQueue] = useState<Set<string>>(new Set());
  const [showExportMode, setShowExportMode] = useState(false);

  const search = searchTerm.trim().toLowerCase();

  const getName = (item: DashboardItem) =>
    (item?.name || "").toLowerCase();

  const getCode = (item: DashboardItem) =>
    (item?.code || "").toString().toLowerCase();

  const uniqueData = Array.from(
    new Map(data.map((item) => [item.code, item])).values()
  );

  const sortedData = uniqueData.sort((a, b) => {
    // If code is numeric
    return Number(a.code) - Number(b.code);
  });

  const filtered = sortedData.filter((item) => {
    const name = getName(item);
    const code = getCode(item);

    if (!search) return true;
    return name.includes(search) || code.includes(search);
  });

  useEffect(()=>{
    setSearchTerm("");
  },[activeTab]);

  useEffect(() => {
    if (selectedCodes.length === 0) {
      setActivePanelTab("index");
    }
  }, [selectedCodes]);

  const selectedSet = new Set(selectedCodes);

  const checkedData = filtered.filter(item => selectedSet.has(item.code));
  const unCheckedData = filtered.filter(item => !selectedSet.has(item.code));

  const handleItemClick = (item: DashboardItem) => {
    if (showCheckbox && selectedCodes.length > 0) {
      if (!selectedCodes.includes(item.code)) {
        handleCheckboxChange(item);
      }
    } else {
      onItemSelect(item);
    }
  };

  const handleCheckboxChange = (item: DashboardItem) => {
    const code = item.code;
    if (selectedCodes.includes(code)) {
      const newSelectedCodes = selectedCodes.filter((c) => c !== code);
      setSelectedCodes(newSelectedCodes);

      // Update merged view real-time
      onViewSchematic(newSelectedCodes);
      return;
    }

    //  LIMIT CHECK: Max selection 15
    // if (selectedCodes.length >= 15) {
    //   alert("You can select maximum 15 components only.");
    //   return;
    // }

    // Add the new item
    const newSelectedCodes = [...selectedCodes, code];
    setSelectedCodes(newSelectedCodes);

    // Auto-merge for real-time sync
    onViewSchematic(newSelectedCodes);
  };

  const handleExportCheckboxChange = (item: DashboardItem) => {
    const code = item.code;
    const newExportQueue = new Set(exportQueue);
    
    if (newExportQueue.has(code)) {
      newExportQueue.delete(code);
    } else {
      newExportQueue.add(code);
    }
    
    setExportQueue(newExportQueue);
  };

  const handleExportPDF = () => {
    if (exportQueue.size > 0 && onExportPDF) {
      onExportPDF(Array.from(exportQueue));
    }
  };

  const handleExportImages = () => {
    if (exportQueue.size > 0 && onExportImages) {
      onExportImages(Array.from(exportQueue));
    }
  };

  const toggleExportMode = () => {
    setShowExportMode(!showExportMode);
    if (!showExportMode) {
      setExportQueue(new Set());
    }
  };

  const showCheckbox =
    activeTab === "components" ||
    activeTab === "DTC" ||
    activeTab === "voltage";

  return (
    <div
      className="left_panel"
      style={{
        width: isMobile ? "100%" : "320px",
        minWidth: isMobile ? "100%" : "320px",
        background: "white",
        borderRight: "1px solid #e9ecef",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >

      {/* Header */}
      <div style={{ padding: "20px", borderBottom: "1px solid #e9ecef" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2
            style={{
              margin: 0,
              color: "#212529",
              fontSize: "18px",
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {showExportMode ? "Export Mode" : (activeTab === "DTC" ? "SPN/FMI" : activeTab.replace(/([A-Z])/g, " $1").trim())}
          </h2>
          <button
            onClick={toggleExportMode}
            style={{
              padding: "8px 12px",
              background: showExportMode ? "#28a745" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = showExportMode ? "#218838" : "#0056b3"}
            onMouseLeave={(e) => e.currentTarget.style.background = showExportMode ? "#28a745" : "#007bff"}
          >
            <Download size={14} />
            {showExportMode ? "Exit Export" : "Export Mode"}
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder={activeTab === "DTC" ? "Search SPN/FMI..." : `Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              border: "1px solid #dee2e6",
              borderRadius: "10px",
              fontSize: "14px",
              background: "#f8f9fa",
              color: "#212529",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
          />
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#adb5bd",
            }}
          />
        </div>

        {selectedCodes.length > 0 && !showExportMode && (
          <div style={{ marginTop: "16px" }}>
            <button
              onClick={() => {
                setSelectedCodes([]);
                onViewSchematic([]);
                onHighlightElement?.(null);
                setHighlightedLegendId(null);
                setActivePanelTab("index");
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "white",
                border: "1px solid #dee2e6",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#495057",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff5f5";
                e.currentTarget.style.borderColor = "#feb2b2";
                e.currentTarget.style.color = "#c53030";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.borderColor = "#dee2e6";
                e.currentTarget.style.color = "#495057";
              }}
            >
              <XCircle size={16} />
              Clear Selection ({selectedCodes.length})
            </button>
            
            {isMobile && (
              <button
                onClick={() => onViewSchematic(selectedCodes)}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "10px 12px",
                  background: "#0d6efd",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 6px -1px rgba(13, 110, 253, 0.2)"
                }}
              >
                👁️ View ({selectedCodes.length})
              </button>
            )}
          </div>
        )}

        {showExportMode && exportQueue.size > 0 && (
          <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
            <button
              onClick={handleExportPDF}
              style={{
                flex: 1,
                padding: "10px 12px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#0056b3"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#007bff"}
            >
              <FileText size={16} />
              Export PDF ({exportQueue.size})
            </button>
            <button
              onClick={handleExportImages}
              style={{
                flex: 1,
                padding: "10px 12px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#218838"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#28a745"}
            >
              <FileImage size={16} />
              Export Images ({exportQueue.size})
            </button>
          </div>
        )}
      </div>

      {/* Items List */}
      <div
        className="panel-scroll-area"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          paddingBottom: "30px",
        }}
      >
        {/* SECTION 1: Checked Items (Always visible if any) */}
        {checkedData.map((item) => {
          const isSelected = selectedItem?.code === item.code;
          const isChecked = true; // They are in checkedData
          const isExportChecked = exportQueue.has(item.code);

          return (
            <div key={item.code} style={{ marginBottom: "12px" }}>
              <div
                style={{
                  padding: "16px",
                  border: `2px solid ${isSelected ? "#007bff" : "#007bff"}`,
                  borderRadius: "12px",
                  background: isSelected ? "#f0f8ff" : "#cce5ff",
                  cursor: showExportMode ? "default" : "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
                onClick={() => !showExportMode && handleItemClick(item)}
              >
                {showCheckbox && !showExportMode && (
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(item)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "16px",
                      height: "16px",
                      cursor: "pointer",
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                    }}
                  />
                )}

                {showExportMode && (
                  <input
                    type="checkbox"
                    checked={isExportChecked}
                    onChange={() => handleExportCheckboxChange(item)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      accentColor: "#28a745",
                    }}
                  />
                )}

                <div style={{ marginLeft: (showCheckbox && !showExportMode) || showExportMode ? "24px" : "0px" }}>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#007bff",
                    background: "#e7f3ff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    marginRight: "12px",
                  }}>
                    {item.code}
                  </span>
                  <h4 style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: "600", color: "#212529" }}>
                    {item.name}
                  </h4>
                </div>
              </div>
            </div>
          );
        })}

        {/* SECTION 2: Tabs (Only if items are checked) */}
        {selectedCodes.length > 0 && (
          <div style={{
            position: "sticky",
            top: "-16px",
            zIndex: 10,
            background: "white",
            padding: "8px 16px",
            margin: "0 -16px 24px -16px",
            borderBottom: "1px solid #f1f3f5",
            display: "flex",
            gap: "4px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
          }}>
            {[
              { id: "index", label: "Index" },
              { id: "legend", label: "Legend" }
            ].map((tab) => {
              const isActive = activePanelTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActivePanelTab(tab.id as any);
                    if (tab.id === "index") {
                      onHighlightElement?.(null);
                      setHighlightedLegendId(null);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    fontSize: "13px",
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? "#004085" : "#6c757d",
                    background: isActive ? "#e7f3ff" : "transparent",
                    border: isActive ? "1.5px solid #004085" : "1.5px solid transparent",
                    borderRadius: "10px",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {tab.label}
                  {isActive && (
                    <div style={{
                      position: "absolute",
                      bottom: "0",
                      left: "20%",
                      right: "20%",
                      height: "2px",
                      background: "#004085",
                      borderRadius: "2px 2px 0 0"
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* SECTION 3: Tab Content (Index or Legend) */}
        {activePanelTab === "index" ? (
          <>
            {unCheckedData.length === 0 && checkedData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#6c757d" }}>
                <p style={{ margin: 0, fontSize: "16px" }}>No {activeTab} found</p>
              </div>
            ) : (
              unCheckedData.map((item) => {
                const isSelected = selectedItem?.code === item.code;
                const isChecked = false;
                const isExportChecked = exportQueue.has(item.code);

                return (
                  <div key={item.code} style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        padding: "16px",
                        border: `2px solid ${isSelected ? "#007bff" : "#e9ecef"}`,
                        borderRadius: "12px",
                        background: isSelected ? "#f0f8ff" : "white",
                        cursor: showExportMode ? "default" : "pointer",
                        transition: "all 0.2s ease",
                        position: "relative",
                      }}
                      onClick={() => !showExportMode && handleItemClick(item)}
                    >
                      {showCheckbox && !showExportMode && (
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(item)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                          }}
                        />
                      )}

                      {showExportMode && (
                        <input
                          type="checkbox"
                          checked={isExportChecked}
                          onChange={() => handleExportCheckboxChange(item)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            accentColor: "#28a745",
                          }}
                        />
                      )}

                      <div style={{ marginLeft: (showCheckbox && !showExportMode) || showExportMode ? "24px" : "0px" }}>
                        <span style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#007bff",
                          background: "#e7f3ff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          marginRight: "12px",
                        }}>
                          {item.code}
                        </span>
                        <h4 style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: "600", color: "#212529" }}>
                          {item.name}
                        </h4>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        ) : (
          <div className="legend-tab">
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#343a40" }}>Legend</h3>
            {schematicData ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Selected Components */}
                {schematicData?.components?.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => {
                      onHighlightElement?.(comp.id);
                      setHighlightedLegendId(comp.id);
                    }}
                    style={{
                      padding: "10px 12px",
                      background: highlightedLegendId === comp.id ? "#e7f3ff" : "#f8f9fa",
                      border: highlightedLegendId === comp.id ? "1px solid #007bff" : "1px solid #dee2e6",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ 
                      width: "10px", 
                      height: "10px", 
                      borderRadius: "2px", 
                      background: comp.componentType?.toLowerCase() === "splice" ? "black" : "#007bff" 
                    }}></span>
                    <span style={{ fontWeight: "600", color: "#495057" }}>{comp.label || comp.id}</span>
                    <span style={{ fontSize: "12px", color: "#6c757d" }}>({comp.componentType || "Component"})</span>
                  </div>
                ))}
                
                {/* Connectors */}
                {Array.from(new Set(schematicData?.components?.flatMap(c => c.connectors || []).map(conn => conn.id) || [])).map(connId => {
                  const conn = schematicData?.components?.flatMap(c => c.connectors || []).find(c => c.id === connId);
                  if (!conn) return null;
                  return (
                    <div
                      key={conn.id}
                      onClick={() => {
                        onHighlightElement?.(conn.id);
                        setHighlightedLegendId(conn.id);
                      }}
                      style={{
                        padding: "10px 12px",
                        background: highlightedLegendId === conn.id ? "#e7f3ff" : "#f8f9fa",
                        border: highlightedLegendId === conn.id ? "1px solid #007bff" : "1px solid #dee2e6",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span style={{ 
                        width: "10px", 
                        height: "10px", 
                        borderRadius: "2px", 
                        background: "lightgreen",
                        border: "1px solid #28a745"
                      }}></span>
                      <span style={{ fontWeight: "600", color: "#495057" }}>{conn.label || conn.id}</span>
                      <span style={{ fontSize: "12px", color: "#6c757d" }}>(Connector)</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "#6c757d", fontSize: "14px" }}>No schematic data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
