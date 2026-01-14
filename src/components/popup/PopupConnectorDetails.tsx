import React, { useState } from "react";
import { PopupConnectorType } from "../Schematic/SchematicTypes";

import { DTC_STEPS_DATA } from "../../utils/DtcStepsData";

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
  
  // Helper function to find a matching DTC code from our map
  const findMatchingDtcCode = (inputCode: string) => {
    if (!inputCode) return null;
    
    // Normalize the input code
    const normalizedInput = inputCode.trim().toUpperCase();
    
    // Check for direct match first
    if (DTC_STEPS_DATA[normalizedInput]) {
      return normalizedInput;
    }
    
    // Check for partial matches starting with ICC
    for (const code in DTC_STEPS_DATA) {
      if (normalizedInput.startsWith(code) || code.startsWith(normalizedInput)) {
        return code;
      }
    }
    
    return null;
  };
  
  if (!popupConnector) return null;

  // ---------- Internal CSS Styles ----------
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0, // starts from top of SVG
    right: 0, // sticks to top-right
    width: "350px",
    maxHeight: "91%", // same height as SVG container
    background: "#ffffff",
    borderRadius: "12px 0 0 12px",
    boxShadow: "0px 6px 24px rgba(0,0,0,0.15)",
    padding: "24px",
    zIndex: 1000,
    overflowY: "auto", // scrollable content
    fontFamily: "'Segoe UI', Arial, sans-serif",
    lineHeight: "1.6",
  };

  const headerContainerStyle: React.CSSProperties = {
    position: "relative",
    top: 0,
    background: "#fff",
    zIndex: 2,
    padding: "16px 16px 10px 16px",
    borderBottom: "3px solid #007bff", // Full-width blue line
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
    color: "#333",
    margin: 0,
  };
  const headerStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
    borderBottom: "3px solid #007bff", // Blue line only below text
    paddingBottom: "6px",
    flexGrow: 1,
  };

  const closeIconStyle: React.CSSProperties = {
    //  backgroundColor: "red",
    position: "absolute",
    top: "-45px",
    right: "-10px",
    color: "black",
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
    background: active ? "#007bff" : "#f0f0f0",
    color: active ? "#fff" : "#333",
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
    backgroundColor: "#f8f9fa",
    color: "#555",
    borderBottom: "1px solid #e0e0e0",
    width: "45%",
  };

  const valueCell: React.CSSProperties = {
    padding: "10px 8px",
    color: "#333",
    borderBottom: "1px solid #e0e0e0",
  };

  const closeButtonStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
    color: "#fff",
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
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <img
          src={`/images/connectors/${popupConnector.connectorCode}.png?.jpg?`}
          alt={popupConnector.connectorCode}
          style={{ maxWidth: '160px', width: '100%', borderRadius: '8px' }}

        />
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
              // If selectedDTC is provided, use it directly
              if (selectedDTC) {
                // Handle selectedDTC as the source of truth
                const dtcInfo = {
                  code: selectedDTC.code || selectedDTC.dtcCode,
                  name: selectedDTC.name || selectedDTC.title || "Diagnostic Trouble Code",
                  steps: selectedDTC.steps || selectedDTC.diagnosticSteps || [],
                  probableCauses: selectedDTC.probableCauses || selectedDTC.causes || [],
                  videoUrl: selectedDTC.videoUrl || selectedDTC.video || null,
                };
                
                if (dtcInfo.steps && dtcInfo.steps.length > 0) {
                  return (
                    <>
                      {/* <h3 style={{ fontWeight: "bold" }}>
                        {dtcInfo.name}
                      </h3>

                      <p style={{ marginBottom: "8px", color: "#666" }}>
                        <b>Code:</b> {dtcInfo.code}
                      </p> */}

                      {/* Probable Causes */}
                      {dtcInfo.probableCauses && dtcInfo.probableCauses.length > 0 && (
                        <div style={{ marginTop: "16px" }}>
                          <h4 style={{ color: "#007bff" }}>Probable Causes:</h4>
                          <ul style={{ paddingLeft: "20px" }}>
                            {dtcInfo.probableCauses.map((cause: string, idx: number) => (
                              <li key={`cause-${idx}`}>
                                {cause}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div style={{ marginTop: "16px" }}>
                        <h4 style={{ color: "#007bff" }}>Diagnostic Steps:</h4>
                        <ol style={{ paddingLeft: "20px" }}>
                          {dtcInfo.steps.map((step: string, index: number) => {
                            // Split step by semicolon or dash to create sub-steps
                            const subSteps = step.includes(';') ? 
                              step.split(';').filter((s: string) => s.trim()) :
                              step.includes(' - ') ?
                                step.split(' - ').filter((s: string) => s.trim()) :
                                [step];
                            
                            return (
                              <li key={index}>
                                {subSteps.map((subStep: string, subIndex: number) => (
                                  <span key={subIndex}>
                                    {subStep.trim()}
                                    {subIndex < subSteps.length - 1 && <br />}
                                  </span>
                                ))}
                              </li>
                            );
                          })}
                        </ol>
                      </div>

                      {/* Video */}
                      {dtcInfo.videoUrl && (
                        <div style={{ marginTop: "16px", textAlign: "center" }}>
                          <iframe
                            width="280"
                            height="160"
                            src={dtcInfo.videoUrl}
                            title="Diagnostic Video"
                            allowFullScreen
                            style={{ borderRadius: "8px", border: "none" }}
                          ></iframe>
                        </div>
                      )}
                    </>
                  );
                }
              }
              
              // Otherwise, try to find data based on dtcCode
              const matchedCode = dtcCode ? findMatchingDtcCode(dtcCode) : null;
              
              if (matchedCode && DTC_STEPS_DATA[matchedCode]) {
                const dtcInfo = DTC_STEPS_DATA[matchedCode];
                return (
                  <>
                    {/* <h3 style={{ fontWeight: "bold" }}>
                      {dtcInfo.name || "Diagnostic Trouble Code"}
                    </h3>

                    <p style={{ marginBottom: "8px", color: "#666" }}>
                      <b>Code:</b> {matchedCode}
                    </p> */}

                    {/* Probable Causes */}
                    {dtcInfo.probableCauses && dtcInfo.probableCauses.length > 0 && (
                      <div style={{ marginTop: "16px" }}>
                        <h4 style={{ color: "#007bff" }}>Probable Causes:</h4>
                        <ul style={{ paddingLeft: "20px" }}>
                          {dtcInfo.probableCauses.map((cause: string, idx: number) => (
                            <li key={`cause-${idx}`}>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div style={{ marginTop: "16px" }}>
                      <h4 style={{ color: "#007bff" }}>Diagnostic Steps:</h4>
                      <ol style={{ paddingLeft: "20px" }}>
                        {dtcInfo.steps.map((step: string, index: number) => {
                          // Split step by semicolon or dash to create sub-steps
                          const subSteps = step.includes(';') ? 
                            step.split(';').filter((s: string) => s.trim()) :
                            step.includes(' - ') ?
                              step.split(' - ').filter((s: string) => s.trim()) :
                              [step];
                          
                          return (
                            <li key={index}>
                              {subSteps.map((subStep: string, subIndex: number) => (
                                <span key={subIndex}>
                                  {subStep.trim()}
                                  {subIndex < subSteps.length - 1 && <br />}
                                </span>
                              ))}
                            </li>
                          );
                        })}
                      </ol>
                    </div>

                    {/* Video */}
                    {dtcInfo.videoUrl && (
                      <div style={{ marginTop: "16px", textAlign: "center" }}>
                        <iframe
                          width="280"
                          height="160"
                          src={dtcInfo.videoUrl}
                          title="Diagnostic Video"
                          allowFullScreen
                          style={{ borderRadius: "8px", border: "none" }}
                        ></iframe>
                      </div>
                    )}
                  </>
                );
              } else {
                return (
                  <p style={{ color: "#999" }}>
                    DTC is not mapped to this connector.
                  </p>
                );
              }
            })()}
        </div>
      )}


    </div>
  );
}
