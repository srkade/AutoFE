import React from "react";
import { ComponentType } from "../Schematic/SchematicTypes";

interface PopupComponentDetailsProps {
  popupComponent: ComponentType | null;
  onClose: () => void;
}

export default function PopupComponentDetails({
  popupComponent,
  onClose,
}: PopupComponentDetailsProps) {
  if (!popupComponent) return null; // If no component selected, render nothing

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "350px",
        height: "90%",
        background: "#ffffff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0px 6px 24px rgba(0,0,0,0.15)",
        zIndex: 10,
        fontFamily: "'Segoe UI', Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
    
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#ffffff",
          borderBottom: "3px solid #007bff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          zIndex: 20,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#333",
            fontSize: "20px",
            textAlign: "center",
            flexGrow: 1,
          }}
        >
          Component Details
        </h3>

        <span
          onClick={onClose}
          style={{
            color: "black",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: "pointer",
            marginLeft: "12px",
            userSelect: "none",
           // backgroundColor: "red",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Close"
        >
          ×
        </span>
      </div>


      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "20px",
        }}
      >
         <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <img
        src={`/images/components/${popupComponent.id}.png?.jpg?`}
        alt={popupComponent.label}
        style={{ maxWidth: '160px', width: '100%', borderRadius: '8px' }}
        // onError={e => { e.currentTarget.src = '/images/components/default.jpg'; }}
        />
      </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          <tbody>
            {/* ID */}
            {popupComponent.id && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    width: "45%",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  ID
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.id}
                </td>
              </tr>
            )}

            {/* Engineering Component Name */}
            {popupComponent.engineering_component_name && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Engineering Component Name
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.engineering_component_name}
                </td>
              </tr>
            )}

            {/* Category */}
            {popupComponent.category && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Category
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.category}
                </td>
              </tr>
            )}

            {/* Shape */}
            {popupComponent.shape && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Shape
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    color: "#333",
                    textTransform: "capitalize",
                  }}
                >
                  {popupComponent.shape}
                </td>
              </tr>
            )}

            {/* Engineering Manufacturer */}
            {popupComponent.engineering_manufacturer && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Engineering Manufacturer
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.engineering_manufacturer}
                </td>
              </tr>
            )}

            {/* Manufacturer */}
            {popupComponent.manufacturer && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Manufacturer
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.manufacturer}
                </td>
              </tr>
            )}

            {/* Primary Part Number */}
            {popupComponent.primary_part_number && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Primary Part Number
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.primary_part_number}
                </td>
              </tr>
            )}

            {/* Connector Part Number */}
            {popupComponent.connector_part_number && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Connector Part Number
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.connector_part_number}
                </td>
              </tr>
            )}

            {/* Harness Name */}
            {popupComponent.harness_name && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Harness Name
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.harness_name}
                </td>
              </tr>
            )}

            {/* Component Type */}
            {popupComponent.componentType && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Component Type
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.componentType}
                </td>
              </tr>
            )}

            {/* Connector Type */}
            {popupComponent.connector_type && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Connector Type
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.connector_type}
                </td>
              </tr>
            )}

            {/* Gender */}
            {popupComponent.gender && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Gender
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.gender}
                </td>
              </tr>
            )}

            {/* Remove Status */}
            {popupComponent.remove !== undefined && (
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "#f8f9fa",
                    color: "#555",
                  }}
                >
                  Remove Status
                </td>
                <td style={{ padding: "10px 8px", color: "#333" }}>
                  {popupComponent.remove ? "Yes" : "No"}
                </td>
              </tr>
            )}

            {/* Connectors */}
            {popupComponent.connectors &&
              popupComponent.connectors.length > 0 && (
                <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td
                    style={{
                      fontWeight: "600",
                      padding: "10px 8px",
                      backgroundColor: "#f8f9fa",
                      color: "#555",
                    }}
                  >
                    Connectors
                  </td>
                  <td style={{ padding: "10px 8px", color: "#333" }}>
                    {popupComponent.connectors.map((c) => c.label).join(", ")}
                  </td>
                </tr>
              )}
          </tbody>
          <img src="" alt="" />
        </table>
        
      </div>
    </div>
  );
}
