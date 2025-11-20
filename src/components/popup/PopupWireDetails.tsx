import React, { useState } from "react";
import { WirePopupType } from "../Schematic/SchematicTypes";

interface PopupWireDetailsProps {
  popupWire: WirePopupType | null;
  onClose: (e: React.MouseEvent) => void;
}

export default function PopupWireDetails({
  popupWire,
  onClose,
}: PopupWireDetailsProps) {
  // Add local state to handle active tab
  const [activeTab, setActiveTab] = useState<"wire" | "connection">("wire");

  if (!popupWire) return null;

  // ---------- Internal CSS Styles ----------
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0, // start from the top of SVG
    right: 0, // stick to top-right corner
    width: "350px",
    maxHeight: "92%", // same height as SVG
    background: "#ffffff",
    borderRadius: "12px 0 0 12px",
    boxShadow: "0px 6px 24px rgba(0,0,0,0.15)",
    padding: "24px",
    zIndex: 1000,
    overflowY: "auto", // scrollable if content too long
    fontFamily: "'Segoe UI', Arial, sans-serif",
    lineHeight: "1.6",
    overflow: "visible",
  };

  const headerStyle: React.CSSProperties = {
    borderBottom: "3px solid #007bff",
    paddingBottom: "10px",
    marginBottom: "20px",
    color: "#333",
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
  };
  const headerWrapperStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    borderBottom: "3px solid #007bff",
    padding: "16px 16px 10px 16px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "18px",
    color: "#333",
  };
  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "0 24px 24px 24px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "24px",
    fontSize: "14px",
  };

  const thStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "10px",
    fontWeight: 600,
    backgroundColor: "#007bff",
    color: "white",
  };

  const tdLabelStyle: React.CSSProperties = {
    fontWeight: 600,
    padding: "10px 8px",
    backgroundColor: "#f8f9fa",
    color: "#555",
    border: "1px solid #ddd",
  };

  const tdValueStyle: React.CSSProperties = {
    padding: "10px 8px",
    color: "#333",
    border: "1px solid #ddd",
  };

  const closeButtonStyle: React.CSSProperties = {
    width: "28px",
    height: "28px",
    //backgroundColor: "red",
    color: "black",
    fontWeight: "bold",
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    borderRadius: "4px",
  };

  // ---------- Component JSX ----------
  return (
    <div style={{ position: "relative", zIndex: 1000 }}>
      <div style={containerStyle}>
        <div
          style={{
            ...closeButtonStyle,
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 2000, // ensures it stays above everything
          }}
          title="Close"
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ×
        </div>


        {/*  Fixed Header with Tabs */}
        <div style={headerWrapperStyle}>
          <div style={{ marginBottom: "10px" }}>Wire Information</div>

          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px" }}>
            <button
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                cursor: "pointer",
                background: activeTab === "wire" ? "#007bff" : "#f0f0f0",
                color: activeTab === "wire" ? "#fff" : "#333",
                border: "none",
                borderRadius: "6px",
                margin: "0 4px",
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
              onClick={() => setActiveTab("wire")}
            >
              Wire Details
            </button>

            <button
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                cursor: "pointer",
                background: activeTab === "connection" ? "#007bff" : "#f0f0f0",
                color: activeTab === "connection" ? "#fff" : "#333",
                border: "none",
                borderRadius: "6px",
                margin: "0 4px",
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
              onClick={() => setActiveTab("connection")}
            >
              Connection Details
            </button>
          </div>
        </div>

        {/* WIRE DETAILS TABLE */}
        {activeTab === "wire" && (
          <table style={tableStyle}>
            <tbody>
              <tr>
                <td style={tdLabelStyle}>Wire Color</td>
                <td style={tdValueStyle}>
                  {popupWire.color ||
                    popupWire.wire?.wireDetails?.wireColor ||
                    "N/A"}
                </td>
              </tr>

              {popupWire.wire?.wireDetails?.circuitNumber && (
                <tr>
                  <td style={tdLabelStyle}>Circuit Number</td>
                  <td style={tdValueStyle}>
                    {popupWire.wire.wireDetails.circuitNumber}
                  </td>
                </tr>
              )}

              {popupWire.wire?.wireDetails?.wireSize && (
                <tr>
                  <td style={tdLabelStyle}>Wire Size</td>
                  <td style={tdValueStyle}>
                    {popupWire.wire.wireDetails.wireSize} mm
                  </td>
                </tr>
              )}

              {popupWire.wire?.wireDetails?.wireLength !== undefined &&
                popupWire.wire?.wireDetails?.wireLength !== null &&
                popupWire.wire?.wireDetails?.wireLength !== 0 && (
                  <tr>
                    <td style={tdLabelStyle}>Wire Length</td>
                    <td style={tdValueStyle}>
                      {popupWire.wire.wireDetails.wireLength} mm
                    </td>
                  </tr>
                )}


              {popupWire.wire?.wireDetails?.wireType && (
                <tr>
                  <td style={tdLabelStyle}>Wire Type</td>
                  <td style={tdValueStyle}>
                    {popupWire.wire.wireDetails.wireType}
                  </td>
                </tr>
              )}

              {popupWire.wire?.wireDetails?.twistId && (
                <tr>
                  <td style={tdLabelStyle}>Twist ID</td>
                  <td style={tdValueStyle}>
                    {popupWire.wire.wireDetails.twistId}
                  </td>
                </tr>
              )}

              {popupWire.wire?.wireDetails?.shieldId && (
                <tr>
                  <td style={tdLabelStyle}>Shield ID</td>
                  <td style={tdValueStyle}>
                    {popupWire.wire.wireDetails.shieldId}
                  </td>
                </tr>
              )}

              {/* Wire Option */}
              {popupWire.wire?.wireDetails?.wireOption && (
                <tr>
                  <td style={tdLabelStyle}>Wire Option</td>
                  <td style={tdValueStyle}>{popupWire.wire.wireDetails.wireOption}</td>
                </tr>
              )}

              {/* Mark */}
              {popupWire.wire?.wireDetails?.mark && (
                <tr>
                  <td style={tdLabelStyle}>Mark</td>
                  <td style={tdValueStyle}>{popupWire.wire.wireDetails.mark}</td>
                </tr>
              )}


              {popupWire.fromComponent?.harness_name && (
                <tr>
                  <td style={tdLabelStyle}>Harness Name</td>
                  <td style={tdValueStyle}>
                    {popupWire.fromComponent.harness_name}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* CONNECTION DETAILS */}
        {activeTab === "connection" && (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Property</th>
                <th style={thStyle}>From</th>
                <th style={thStyle}>To</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdLabelStyle}>Component</td>
                <td style={tdValueStyle}>
                  {popupWire.fromComponent?.label ||
                    popupWire.wire?.wireDetails?.from?.devName ||
                    popupWire.wire?.from?.componentId ||
                    "N/A"}
                </td>
                <td style={tdValueStyle}>
                  {popupWire.toComponent?.label ||
                    popupWire.wire?.wireDetails?.to?.devName ||
                    popupWire.wire?.to?.componentId ||
                    "N/A"}
                </td>
              </tr>

              <tr>
                <td style={tdLabelStyle}>Connector</td>
                <td style={tdValueStyle}>
                  {popupWire.fromConnector?.label ||
                    popupWire.wire?.wireDetails?.from?.connectorNumber ||
                    popupWire.wire?.from?.connectorId ||
                    "N/A"}
                </td>
                <td style={tdValueStyle}>
                  {popupWire.toConnector?.label ||
                    popupWire.wire?.wireDetails?.to?.connectorNumber ||
                    popupWire.wire?.to?.connectorId ||
                    "N/A"}
                </td>
              </tr>

              <tr>
                <td style={tdLabelStyle}>Connector Part Number</td>
                <td style={tdValueStyle}>
                  {popupWire.wire?.wireDetails?.from?.connPartNumber || "N/A"}
                </td>
                <td style={tdValueStyle}>
                  {popupWire.wire?.wireDetails?.to?.connPartNumber || "N/A"}
                </td>
              </tr>

              <tr>
                <td style={tdLabelStyle}>Terminal Part Number</td>
                <td style={tdValueStyle}>
                  {popupWire.wire?.wireDetails?.from?.termPartNo || "N/A"}
                </td>
                <td style={tdValueStyle}>
                  {popupWire.wire?.wireDetails?.to?.termPartNo || "N/A"}
                </td>
              </tr>

              <tr>
                <td style={tdLabelStyle}>Seal Part Number</td>
                <td style={tdValueStyle}>
                  {popupWire.wire?.wireDetails?.from?.sealPartNo || "N/A"}
                </td>
                <td style={tdValueStyle}>
                  {popupWire.wire?.wireDetails?.to?.sealPartNo || "N/A"}
                </td>
              </tr>

              <tr>
                <td style={tdLabelStyle}>Gender</td>
                <td style={tdValueStyle}>
                  {popupWire.fromConnector?.gender ||
                    popupWire.wire?.from?.gender ||
                    "N/A"}
                </td>
                <td style={tdValueStyle}>
                  {popupWire.toConnector?.gender ||
                    popupWire.wire?.to?.gender ||
                    "N/A"}
                </td>
              </tr>

              <tr>
                <td style={tdLabelStyle}>Cavity</td>
                <td style={tdValueStyle}>
                  {popupWire.wire?.wireDetails?.from?.cavity ||
                    popupWire.wire?.from?.cavity ||
                    "N/A"}
                </td>
                <td style={tdValueStyle}>
                  {popupWire.wire?.wireDetails?.to?.cavity ||
                    popupWire.wire?.to?.cavity ||
                    "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
          
        )}
      </div>
      <div>
    <img
      src={`/images/wires/${popupWire.wire?.wireDetails?.circuitNumber}.png?.jpg?`}
      alt={popupWire.wire?.wireDetails?.circuitNumber}
      style={{ maxWidth: '160px', width: '100%', borderRadius: '8px' }}
      
    />
  </div>
    </div>
  );
}
