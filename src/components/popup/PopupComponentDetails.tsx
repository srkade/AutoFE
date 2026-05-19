import React, { useState, useEffect } from "react";
import { ComponentType } from "../Schematic/SchematicTypes";
import { API_BASE_URL as CONFIG_API_BASE_URL } from "../../config";

const API_BASE_URL = process.env.REACT_APP_API_URL || CONFIG_API_BASE_URL;

import DtcStepsSection from "./DtcStepsSection";

interface PopupComponentDetailsProps {
  popupComponent: ComponentType | null;
  onClose: () => void;
  dtcCode?: string | null;
}

export default function PopupComponentDetails({
  popupComponent,
  onClose,
  dtcCode,
}: PopupComponentDetailsProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!popupComponent?.id) return;
    
    // Reset image while fetching
    setImageUrl(null);
    const defaultUrl = `/images/components/${popupComponent.id}.png`;

    fetch(`${API_BASE_URL}/assets/images/code/${popupComponent.id}`, {
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
  }, [popupComponent]);

  if (!popupComponent) return null; // If no component selected, render nothing

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "100%",
        maxWidth: "350px",
        maxHeight: "100%",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        boxShadow: "var(--card-shadow)",
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
          background: "var(--bg-secondary)",
          borderBottom: "3px solid var(--accent-primary)",
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
            color: "var(--text-primary)",
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
            color: "var(--text-primary)",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: "pointer",
            marginLeft: "12px",
            userSelect: "none",
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
            src={imageUrl || `/images/components/${popupComponent.id}.png`}
            alt={popupComponent.label}
            style={{ maxWidth: '160px', width: '100%', borderRadius: '8px', minHeight: '100px', objectFit: 'contain' }}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.endsWith('.png') && target.src.includes('/images/')) {
                target.src = target.src.replace('.png', '.jpg');
              } else if (target.src.endsWith('.jpg') && target.src.includes('/images/')) {
                target.src = target.src.replace('.jpg', '.jpeg');
              }
            }}
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
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    width: "45%",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  ID
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.id}
                </td>
              </tr>
            )}

            {/* Label */}
            {popupComponent.label && popupComponent.label !== popupComponent.id && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Label
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.label}
                </td>
              </tr>
            )}

            {/* Engineering Component Name */}
            {(popupComponent.engineering_component_name || popupComponent.label) && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Engineering Component Name
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.engineering_component_name || popupComponent.label}
                </td>
              </tr>
            )}

            {/* Category */}
            {popupComponent.category && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Category
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.category}
                </td>
              </tr>
            )}

            {/* Shape */}
            {popupComponent.shape && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
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
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Engineering Manufacturer
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.engineering_manufacturer}
                </td>
              </tr>
            )}

            {/* Manufacturer */}
            {popupComponent.manufacturer && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Manufacturer
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.manufacturer}
                </td>
              </tr>
            )}

            {/* Primary Part Number */}
            {popupComponent.primary_part_number && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Primary Part Number
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.primary_part_number}
                </td>
              </tr>
            )}

            {/* Connector Part Number */}
            {popupComponent.connector_part_number && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Connector Part Number
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.connector_part_number}
                </td>
              </tr>
            )}

            {/* Harness Name */}
            {popupComponent.harness_name && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Harness Name
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.harness_name}
                </td>
              </tr>
            )}

            {/* Component Type */}
            {popupComponent.componentType && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Component Type
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.componentType}
                </td>
              </tr>
            )}

            {/* Connector Type */}
            {popupComponent.connector_type && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Connector Type
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.connector_type}
                </td>
              </tr>
            )}

            {/* Gender */}
            {popupComponent.gender && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Gender
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.gender}
                </td>
              </tr>
            )}

            {/* Remove Status */}
            {popupComponent.remove !== undefined && (
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td
                  style={{
                    fontWeight: "600",
                    padding: "10px 8px",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Remove Status
                </td>
                <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                  {popupComponent.remove ? "Yes" : "No"}
                </td>
              </tr>
            )}

            {/* Connectors */}
            {popupComponent.connectors &&
              popupComponent.connectors.length > 0 && (
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td
                    style={{
                      fontWeight: "600",
                      padding: "10px 8px",
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Connectors
                  </td>
                  <td style={{ padding: "10px 8px", color: "var(--text-primary)" }}>
                    {popupComponent.connectors.map((c) => c.label).join(", ")}
                  </td>
                </tr>
              )}
          </tbody>
        </table>
        
        {dtcCode && (
          <DtcStepsSection 
            dtcCode={dtcCode}
            contextData={{
              componentCode: popupComponent.id,
              componentName: popupComponent.label || popupComponent.engineering_component_name,
              harnessName: popupComponent.harness_name,
              connectorCode: popupComponent.connectors?.map(c => c.label).join(", ")
            }}
          />
        )}

        <img src="" alt="" />

      </div>
    </div>
  );
}
