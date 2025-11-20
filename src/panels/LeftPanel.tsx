import React, { useState } from "react";

import { DashboardItem } from "../App";

import "../Styles/LeftPanel.css";

import Schematic from "../components/Schematic/Schematic";
import { Layers, CheckSquare } from "lucide-react";


interface LeftPanelProps {
  activeTab: string;
  data: DashboardItem[];
  onItemSelect: (item: DashboardItem) => void;
  selectedItem: DashboardItem | null;
  selectedCodes: string[];
  setSelectedCodes: React.Dispatch<React.SetStateAction<string[]>>;
  onViewSchematic: (selectedCodes: string[]) => void;
  isMobile: boolean;
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
}: LeftPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Filter and sort data
  const filteredData = data
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Sort: selected components first
    .sort((a, b) => {
      const aSelected = selectedCodes.includes(a.code);
      const bSelected = selectedCodes.includes(b.code);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

  // Handle item click (for regular selection)
  const handleItemClick = (item: DashboardItem) => {
    onItemSelect(item);
    if (isMobile) setIsPanelOpen(false);
  };

  // Handle checkbox change
  const handleCheckboxChange = (item: DashboardItem) => {
    const code = item.code;
    let newSelectedCodes: string[];

    if (selectedCodes.includes(code)) {
      newSelectedCodes = selectedCodes.filter((c) => c !== code);
    } else {
      newSelectedCodes = [...selectedCodes, code];
    }

    setSelectedCodes(newSelectedCodes);

    // Automatically view schematic with updated selection
    if (newSelectedCodes.length > 0) {
      onViewSchematic(newSelectedCodes);
    }
  };

  // decide if checkboxes should be shown for this tab
  const showCheckbox = activeTab === "components" || activeTab === "DTC" || activeTab === "voltage";

  return (
    <div
      className="left_panel"
      style={{
        width: "320px",
        minWidth: "320px",
        background: "white",
        borderRight: "1px solid #e9ecef",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px", borderBottom: "1px solid #e9ecef" }}>
        <h2
          style={{
            margin: "0 0 16px 0",
            color: "#212529",
            fontSize: "18px",
            fontWeight: "600",
            textTransform: "capitalize",
          }}
        >
          {activeTab.replace(/([A-Z])/g, " $1").trim()}
        </h2>

        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "80%",
              padding: "10px 12px 10px 40px",
              border: "1px solid #ced4da",
              borderRadius: "8px",
              fontSize: "14px",
              background: "#f8f9fa",
              color: "#495057",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6c757d",
              fontSize: "16px",
            }}
          >
            🔍
          </span>
        </div>
      </div>
      {showCheckbox && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
            borderBottom: "1px solid #e9ecef",
            gap: "8px",
          }}
        >


          {selectedCodes.length > 0 && (
            <button
              onClick={() => setSelectedCodes([])}
              title="Clear Selection"
              style={{
                width: "40px",
                height: "40px",
                background: "#f1f3f5",
                border: "1px solid #ced4da",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "#495057",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#e9ecef")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#f1f3f5")
              }
            >
              🧹
            </button>
          )}
        </div>
      )}

      {/* Items List */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        {filteredData.map((item) => {
          const isSelected = selectedItem?.code === item.code;
          const isChecked = selectedCodes.includes(item.code);

          return (
            <div key={item.code}>
              <div
                style={{
                  padding: "16px",
                  marginBottom: "12px",
                  border: `2px solid ${isSelected ? "#007bff" : isChecked ? "#007bff" : "#e9ecef"}`, borderRadius: "12px",
                  background: isSelected ? "#f0f8ff" : isChecked ? "#cce5ff" : "white", cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected
                    ? "0 4px 12px rgba(0,123,255,0.25)"
                    : isChecked
                      ? "0 4px 12px rgba(0,123,255,0.25)"
                      : "0 2px 4px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && !isChecked) {
                    (e.currentTarget as HTMLElement).style.borderColor = "#007bff";
                    (e.currentTarget as HTMLElement).style.background = "#f8f9fa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected && !isChecked) {
                    (e.currentTarget as HTMLElement).style.borderColor = "#e9ecef";
                    (e.currentTarget as HTMLElement).style.background = "white";
                  }
                }}
              >
                {/* Checkbox */}

                {showCheckbox && (
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
                {/* Item Content */}
                <div
                  onClick={() => handleItemClick(item)}
                  style={{
                    marginLeft: showCheckbox ? "24px" : "0px"
                    // marginLeft: "24px", // Space for checkbox
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#007bff",
                        background: "#e7f3ff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        marginRight: "12px",
                      }}
                    >
                      {item.code}
                    </span>
                  </div>

                  <h4
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#212529",
                    }}
                  >
                    {item.name}
                  </h4>


                </div>

                {/* Mobile Schematic Display */}
                {isMobile && selectedItem?.code === item.code && selectedItem?.schematicData && (
                  <div style={{ marginTop: "16px" }}>
                    <Schematic
                      data={selectedItem.schematicData}

                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredData.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#6c757d",
            }}
          >
            <p style={{ margin: 0, fontSize: "16px" }}>
              No {activeTab} found
            </p>
            {searchTerm && (
              <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
                Try adjusting your search terms
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
