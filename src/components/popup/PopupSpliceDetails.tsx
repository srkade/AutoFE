import React from "react";
import { SplicePopupType } from "../Schematic/SchematicTypes";

interface PopupSpliceDetailsProps {
  popupSplice: SplicePopupType | null;
  isLoading?: boolean;
  error?: string | null;
  onClose: (e: React.MouseEvent) => void;
}

export default function PopupSpliceDetails({
  popupSplice,
  isLoading,
  error,
  onClose,
}: PopupSpliceDetailsProps) {
  if (!popupSplice && !isLoading) return null;

  // ---------- Internal CSS Styles (Matching other popups) ----------
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    maxWidth: "350px",
    maxHeight: "100%",
    background: "#ffffff",
    borderRadius: "12px 0 0 12px",
    boxShadow: "0px 6px 24px rgba(0,0,0,0.15)",
    padding: "24px",
    zIndex: 1000,
    overflowY: "auto",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    lineHeight: "1.6",
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

  return (
      <div style={containerStyle}>
        <div
          style={{
            ...closeButtonStyle,
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 2000,
          }}
          title="Close"
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ×
        </div>

        {/* Fixed Header */}
        <div style={headerWrapperStyle}>
          <div style={{ marginBottom: "10px" }}>Splice Information</div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#007bff" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #007bff",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 10px",
              }}
            />
            <span style={{ fontSize: "14px" }}>Fetching details...</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div style={{ padding: "16px", color: "red", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Content */}
        {popupSplice && !isLoading && (
          <div style={{ marginTop: "20px" }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={tdLabelStyle}>Splice Code</td>
                  <td style={{ ...tdValueStyle, fontWeight: "bold" }}>
                    {popupSplice.spliceId}
                  </td>
                </tr>
                {popupSplice.label && (
                  <tr>
                    <td style={tdLabelStyle}>Label</td>
                    <td style={tdValueStyle}>{popupSplice.label}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Connected Wires */}
            {popupSplice.connections && popupSplice.connections.length > 0 ? (
              <>
                <div style={{ fontWeight: "bold", marginBottom: "10px", color: "#333", fontSize: "16px" }}>
                  Connected Wires ({popupSplice.connections.length})
                </div>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={{...thStyle, padding: "8px 6px", fontSize: "12px"}}>Color</th>
                      <th style={{...thStyle, padding: "8px 6px", fontSize: "12px"}}>From</th>
                      <th style={{...thStyle, padding: "8px 6px", fontSize: "12px"}}>To</th>
                      <th style={{...thStyle, padding: "8px 6px", fontSize: "12px"}}>Cavity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popupSplice.connections.map((conn, idx) => (
                      <tr key={idx}>
                        <td style={{...tdValueStyle, textAlign: "center", fontSize: "12px"}}>
                          {conn.wireColor || "—"}
                        </td>
                        <td style={{...tdValueStyle, fontSize: "12px"}}>
                          <strong>{conn.fromComponentLabel || conn.fromComponentId || "—"}</strong>
                          <br/>
                          <span style={{ color: "#777" }}>{conn.fromConnectorId}</span>
                        </td>
                        <td style={{...tdValueStyle, fontSize: "12px"}}>
                          <strong>{conn.toComponentLabel || conn.toComponentId || "—"}</strong>
                          <br/>
                          <span style={{ color: "#777" }}>{conn.toConnectorId}</span>
                        </td>
                        <td style={{...tdValueStyle, textAlign: "center", fontSize: "12px"}}>
                          {conn.fromCavity || "—"} → {conn.toCavity || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                No connection details available.
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
