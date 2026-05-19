import React, { useState, useEffect } from "react";
import { PopupConnectorType } from "../Schematic/SchematicTypes";
import { Plug } from "lucide-react";

import { DTC_STEPS_DATA } from "../../utils/DtcStepsData";
import { API_BASE_URL as CONFIG_API_BASE_URL } from "../../config";
import DtcStepsSection from "./DtcStepsSection";

const API_BASE_URL = process.env.REACT_APP_API_URL || CONFIG_API_BASE_URL;

interface PopupConnectorDetailsProps {
  popupConnector: PopupConnectorType | null;
  onClose: (e: React.MouseEvent) => void;
  selectedTab?: string;
  dtcCode?: string;
  selectedDTC?: any;
}

export default function PopupConnectorDetails({
  popupConnector,
  onClose,
  selectedTab,
  dtcCode,
  selectedDTC,
}: PopupConnectorDetailsProps) {
  const [activeTab, setActiveTab] = useState<"connection" | "dtc">("connection");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (selectedTab === "DTC") {
      setActiveTab("dtc");
    } else {
      setActiveTab("connection");
    }
  }, [selectedTab, popupConnector]);

  useEffect(() => {
    if (!popupConnector?.connectorCode) return;

    // Reset image and error while fetching
    setImageUrl(null);
    setImageError(false);
    const defaultUrl = `/images/connectors/${popupConnector.connectorCode}.png`;

    fetch(`${API_BASE_URL}/assets/images/code/${popupConnector.connectorCode}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json) => {
        if (json.data && json.data.imageUrl) {
          setImageUrl(json.data.imageUrl);
        } else {
          setImageUrl(defaultUrl);
        }
      })
      .catch(() => {
        setImageUrl(defaultUrl);
      });
  }, [popupConnector]);

  if (!popupConnector) return null;

  // ---------- Internal CSS Styles ----------
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0, // starts from top of SVG
    right: 0, // sticks to top-right
    width: "100%",
    maxWidth: "350px",
    maxHeight: "100%", // same height as SVG container
    background: "var(--bg-secondary)",
    borderRadius: "12px 0 0 12px",
    boxShadow: "var(--card-shadow)",
    padding: "24px",
    zIndex: 1000,
    overflowY: "auto", // scrollable content
    fontFamily: "'Segoe UI', Arial, sans-serif",
    lineHeight: "1.6",
    border: "2px solid var(--border-color)",
  };

  const headerContainerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    background: "var(--bg-secondary)",
    zIndex: 2,
    padding: "16px 16px 10px 16px",
    borderBottom: "3px solid var(--accent-primary)", // Full-width line
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  };
  const tabWrapperStyle: React.CSSProperties = {
    flex: 1, // make it take up full width
    display: "flex",
    justifyContent: "center", // center by default
  };
  const headerTitleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "var(--text-primary)",
    margin: 0,
  };
  const headerStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "var(--text-primary)",
    margin: 0,
    borderBottom: "3px solid var(--accent-primary)", // Line only below text
    paddingBottom: "6px",
    flexGrow: 1,
  };

  const closeIconStyle: React.CSSProperties = {
    position: "absolute",
    top: "-45px",
    right: "-10px",
    color: "var(--text-primary)",
    border: "none",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
    background: "transparent",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  };

  const tabContainerStyle = (hasDTC: boolean): React.CSSProperties => (
    {
      display: "flex",
      justifyContent: hasDTC ? "flex-end" : "center",
      gap: "8px",
      marginTop: "10px",
    }
  )
  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 12px",
    cursor: "pointer",
    background: active ? "var(--accent-primary)" : "var(--bg-primary)",
    color: active ? "var(--accent-primary-text, #fff)" : "var(--text-secondary)",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    transition: "all 0.3s ease",
  });
  const tableStyle: React.CSSProperties = {
    width: "100%",
    fontSize: "14px",
    borderCollapse: "collapse",
  };

  const labelCell: React.CSSProperties = {
    fontWeight: 600,
    padding: "10px 8px",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-secondary)",
    borderBottom: "1px solid var(--border-color)",
    width: "45%",
  };

  const valueCell: React.CSSProperties = {
    padding: "10px 8px",
    color: "var(--text-primary)",
    borderBottom: "1px solid var(--border-color)",
  };

  const closeButtonStyle: React.CSSProperties = {
    background: "var(--accent-primary)",
    color: "var(--accent-primary-text, #fff)",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    boxShadow: "0px 3px 8px rgba(0,123,255,0.3)",
    transition: "all 0.3s ease",
  };

  // ---------- Component JSX ----------


  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: "10px", fontWeight: "bold", fontSize: "20px", textAlign: "center" }}>Connector Information</div>
      {/* HEADER SECTION */}
      <div style={headerContainerStyle}>
        <div style={tabWrapperStyle}>
          <div style={tabContainerStyle(selectedTab === "DTC")}>
            <button
              style={tabButtonStyle(activeTab === "connection")}
              onClick={() => setActiveTab("connection")}
            >
              Connection Details
            </button>

            {selectedTab === "DTC" && (
              <button
                style={tabButtonStyle(activeTab === "dtc")}
                onClick={() => setActiveTab("dtc")}
              >
                DTC Steps
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          style={closeIconStyle}
          title="Close"
          onMouseOver={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.2)")
          }
          onMouseOut={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")
          }
        >
          ×
        </button>
      </div>

      {/* Popup Connector Image */}
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!imageError ? (
          <img
            src={imageUrl || `/images/connectors/${popupConnector.connectorCode}.png`}
            alt={popupConnector.connectorCode}
            title="Click to open full image"
            style={{
              maxWidth: '160px',
              width: '100%',
              borderRadius: '8px',
              minHeight: '100px',
              objectFit: 'contain',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.2s ease',
              display: 'block',
              margin: '0 auto'
            }}
            onClick={() => {
              window.open(
                imageUrl || `/images/connectors/${popupConnector.connectorCode}.png`,
                "_blank"
              );
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onError={(e) => {
              const target = e.currentTarget;

              if (
                target.src.endsWith('.png') &&
                target.src.includes('/images/')
              ) {
                target.src = target.src.replace('.png', '.jpg');
              } else if (
                target.src.endsWith('.jpg') &&
                target.src.includes('/images/')
              ) {
                target.src = target.src.replace('.jpg', '.jpeg');
              } else {
                setImageError(true);
              }
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '160px',
            height: '120px',
            borderRadius: '8px',
            border: '1px dashed var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-secondary)'
          }}>
            <Plug size={48} style={{ strokeWidth: 1.5, marginBottom: '8px', color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: '11px', fontWeight: 500 }}>No Image Available</span>
          </div>
        )}
      </div>


      {/* DETAILS TABLE */}
      {activeTab === "connection" && (
        <table style={tableStyle}>
          <tbody>
            {popupConnector.componentCode && (
              <tr>
                <td style={labelCell}>Component Code</td>
                <td style={valueCell}>{popupConnector.componentCode}</td>
              </tr>
            )}
            {popupConnector.connectorCode && (
              <tr>
                <td style={labelCell}>Connector Code</td>
                <td style={valueCell}>{popupConnector.connectorCode}</td>
              </tr>
            )}
            {popupConnector.label && (
              <tr>
                <td style={labelCell}>Label</td>
                <td style={valueCell}>{popupConnector.label}</td>
              </tr>
            )}
            {popupConnector.harnessName && (
              <tr>
                <td style={labelCell}>Harness Name</td>
                <td style={valueCell}>{popupConnector.harnessName}</td>
              </tr>
            )}
            {popupConnector.partNumber && (
              <tr>
                <td style={labelCell}>Connector Part Number</td>
                <td style={valueCell}>{popupConnector.partNumber}</td>
              </tr>
            )}
            {popupConnector.gender && (
              <tr>
                <td style={labelCell}>Gender</td>
                <td style={valueCell}>{popupConnector.gender}</td>
              </tr>
            )}
            {popupConnector.cavityCount && (
              <tr>
                <td style={labelCell}>Cavity Count</td>
                <td style={valueCell}>{popupConnector.cavityCount}</td>
              </tr>
            )}
            {popupConnector.color && (
              <tr>
                <td style={labelCell}>Color</td>
                <td style={valueCell}>{popupConnector.color}</td>
              </tr>
            )}
            {popupConnector.connectorType && (
              <tr>
                <td style={labelCell}>Connector Type</td>
                <td style={valueCell}>{popupConnector.connectorType}</td>
              </tr>
            )}
            {popupConnector.manufacturer && (
              <tr>
                <td style={labelCell}>Manufacturer</td>
                <td style={valueCell}>{popupConnector.manufacturer}</td>
              </tr>
            )}
            {popupConnector.termPartNo && (
              <tr>
                <td style={labelCell}>Terminal Part Number</td>
                <td style={valueCell}>{popupConnector.termPartNo}</td>
              </tr>
            )}
            {popupConnector.sealPartNo && (
              <tr>
                <td style={labelCell}>Seal Part Number</td>
                <td style={valueCell}>{popupConnector.sealPartNo}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {activeTab === "dtc" && (
        <div style={{ marginTop: "16px", fontSize: "14px", color: "#333" }}>
          {(() => {
            // If dtcCode is provided, use the DtcStepsSection with dynamic data
            if (dtcCode || (selectedDTC && (selectedDTC.code || selectedDTC.dtcCode))) {
              const code = dtcCode || selectedDTC.code || selectedDTC.dtcCode;
              return (
                <DtcStepsSection
                  dtcCode={code}
                  contextData={{
                    componentCode: popupConnector.componentCode,
                    connectorCode: popupConnector.connectorCode,
                    harnessName: popupConnector.harnessName,
                    cavityCount: popupConnector.cavityCount
                  }}
                />
              );
            }
            // No DTC selected
            return (
              <p style={{ color: "#999" }}>
                No DTC selected.
              </p>
            );
          })()}
        </div>
      )}


    </div>
  );
}
