import React, { useState, useEffect } from "react";
import { FiUser, FiHome, FiSettings, FiShield, FiDatabase, FiBarChart2, FiActivity, FiLogOut } from "react-icons/fi";
import logo from "../assets/Images/logo.png";

interface SuperAdminNavigationTabsProps {
  active: string;
  onChange: (tabId: string) => void;
  onLogout: () => void;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function SuperAdminNavigationTabs({
  active,
  onChange,
  onLogout,
  user,
}: SuperAdminNavigationTabsProps) {

  const tabs = [
    { id: "home", label: "Home", icon: FiHome },
    { id: "system-settings", label: "System Settings", icon: FiSettings },
    { id: "security-logs", label: "Security Logs", icon: FiShield },
    { id: "database-management", label: "Database Management", icon: FiDatabase },
    { id: "user-analytics", label: "User Analytics", icon: FiBarChart2 },
    { id: "system-monitoring", label: "System Monitoring", icon: FiActivity },
  ];

  return (
    <div className="admin-nav-container" style={{ display: "flex", height: "100vh", width: "300px", background: "#1e293b", borderRight: "1px solid #334155", flexDirection: "column" }}>
      
      <div className="admin-nav" style={{ padding: "20px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Logo */}
        <div
          style={{
            width: "100%",
            display: "flex",
            height: "70px",
            alignItems: "center",
            marginBottom: "32px",
            justifyContent: "center",
            borderBottom: "1px solid #334155",
            paddingBottom: "20px"
          }}
        >
          <img src={logo} alt="Logo" style={{ width: 48, height: 48, borderRadius: "8px" }} />
          <h1 style={{ marginLeft: 12, fontSize: 22, color: "#f1f5f9", fontWeight: "700" }}>CRAZYBEES</h1>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <div
                key={tab.id}
                className={`tab-item ${active === tab.id ? "active" : ""}`}
                data-tab-id={tab.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: active === tab.id ? "#3b82f6" : "transparent",
                  color: active === tab.id ? "white" : "#cbd5e1",
                  fontWeight: active === tab.id ? "600" : "500",
                  transition: "all 0.2s ease",
                  border: active === tab.id ? "none" : "1px solid transparent",
                  margin: "2px 0"
                }}
                onClick={() => {
                  //console.log("Navigation tab clicked:", tab.id);
                  onChange(tab.id);
                }}
                onMouseEnter={(e) => {
                  if (active !== tab.id) {
                    (e.currentTarget as HTMLElement).style.background = "#334155";
                    (e.currentTarget as HTMLElement).style.color = "#f1f5f9";
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== tab.id) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#cbd5e1";
                  }
                }}
              >
                <Icon size={20} style={{ marginRight: "12px" }} />
                <span style={{ fontSize: "15px" }}>{tab.label}</span>
              </div>
            );
          })}
        </div>
        
        {/* Super Admin Badge */}
        <div style={{
          textAlign: "center",
          padding: "16px 0",
          fontSize: "14px",
          color: "#3b82f6",
          fontWeight: "600",
          borderTop: "1px solid #334155",
          background: "transparent",
          marginTop: "auto"
        }}>
          SUPER ADMIN
        </div>
      </div>
    </div>
  );
}