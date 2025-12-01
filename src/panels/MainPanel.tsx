import React from "react";
import Schematic from "../components/Schematic/Schematic";
import { ICC, S4, S9, S8, B3 } from "../components/Schematic/tests";
import { DashboardItem } from "../App";
import "../Styles/MainPanel.css"

interface MainPanelProps {
  selectedItem: DashboardItem | null;
  activeTab: string;
  isMultipleComponents?: boolean; 
  isMobile: boolean;
}


export default function MainPanel({ selectedItem, activeTab, isMobile }: MainPanelProps) {

  const placeholderMessages: Record<string, string> = {
    Components: "Choose a component from the left panel to view its schematic diagram with interactive controls.",
    System: "Choose a system from the left panel to view system formula and details.",
    Fuse: "Choose a fuse from the left panel to view fuse connections.",
    Wire: "Choose a wire from the left panel to view wire details.",
  };

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
      {!isMobile && (
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Schematic data={selectedItem.schematicData} />
        </div>
      )}
    </div>
  );
}