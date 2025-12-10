import React from "react";
import "../Styles/AdminNavigationTabs.css";
import { FiUsers, FiUpload, FiCpu } from "react-icons/fi";
import logo from "../assets/Images/logo.jpg"

interface AdminNavigationTabsProps {
  active: string;
  onChange: (tabId: string) => void;
  onLogout: () => void;
}

export default function AdminNavigationTabs({
  active,
  onChange,
  onLogout,
}: AdminNavigationTabsProps) {
  const tabs = [
    { id: "manage-users", label: "Manage Users", icon: FiUsers },
    { id: "import-files", label: "Import Files", icon: FiUpload },
    { id: "view-schematic", label: "View Schematic", icon: FiCpu },
  ];


  return (
    <div className="admin-nav">
      <div
        style={{
          width: "320px",
          display: "flex",
          height: "80px",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <img
          style={{
            width: "50px",
            height: "50px",
          }}
          src={logo}
          alt="Logo"
        />
        <h1
          style={{
            marginRight: "50px",
            fontSize: "20px",
          }}
        >
          CRAZYBEES
        </h1>
      </div>
      <div className="tabs">
        {tabs.map((t) => {
          const Icon = t.icon; // get icon component
          return (
            <div
              key={t.id}
              className={`tab-item ${active === t.id ? "active" : ""}`}
              onClick={() => onChange(t.id)}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Icon size={18} /> {/* Icon size */}
              <span>{t.label}</span>
            </div>
          );
        })}
      </div>
      <div className="logout" onClick={onLogout}>
        Logout
      </div>
    </div>
  );
}
