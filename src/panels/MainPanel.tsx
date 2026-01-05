import React from "react";
import Schematic from "../components/Schematic/Schematic";
import { DashboardItem } from "../App";
import "../Styles/MainPanel.css"

interface MainPanelProps {
  selectedItem: DashboardItem | null;
  activeTab: string;
  isMultipleComponents?: boolean; 
  isMobile: boolean;onComponentRightClick?: (component: any, position: any) => void;
  traceMode?: boolean;
  traceBreadcrumb?: string;
  onBackClick?: () => void;

}

export default function MainPanel({ selectedItem, activeTab, isMobile, onComponentRightClick,
  traceMode = false,
  traceBreadcrumb = '',
  onBackClick  }: MainPanelProps) {

  const placeholderMessages: Record<string, string> = {
    Components: "Choose a component from the left panel to view its schematic diagram with interactive controls.",
    System: "Choose a system from the left panel to view system formula and details.",
    voltage: "Choose a voltage supply/fuse from the left panel to view fuse connections.",
    Wire: "Choose a wire from the left panel to view wire details.",
  };
  console.log("TRACE: MainPanel rendering. Item:", selectedItem?.code, "TraceMode:", traceMode);

  if (!selectedItem) {
    return (
      <div
        className="main-panel empty"
        style={{
          flex: 1,
          background: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "40px"
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px", opacity: 0.3 }}>
            🔧
          </div>

          <h2
            style={{
              color: "#495057",
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "12px"
            }}
          >
            {`Select a ${activeTab}`}
          </h2>

          <p
            style={{
              color: "#6c757d",
              fontSize: "16px",
              lineHeight: "1.5"
            }}
          >
            {placeholderMessages[activeTab] ||
              "Select an item from the left panel to continue."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
    className={`main-panel-wrapper ${selectedItem ? "has-selection" : ""}`}
    style={{
      flex: 1,
      background: "#f8f9fa",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}
  >
    {/* BLUE TRACE HEADER */}
    {traceMode && (
      <div style={{
        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
        color: 'white',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 10
      }}>
        <button 
          onClick={onBackClick}
          style={{
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Back to {activeTab}
        </button>
        <div style={{ fontSize: '16px', fontWeight: '500', letterSpacing: '0.5px' }}>
          {traceBreadcrumb}
        </div>
      </div>
    )}

    {/* RENDER SCHEMATIC - Only one instance needed */}
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
      {selectedItem?.schematicData && (
        <Schematic 
          key={selectedItem.code} // Helps React reset the view when switching components
          data={selectedItem.schematicData} 
          activeTab={activeTab}
          onComponentRightClick={onComponentRightClick} // NOW IT IS PASSED CORRECTLY
        />
      )}
    </div>
  </div>
  );
}