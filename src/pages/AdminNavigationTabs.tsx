import React from "react";
import "../Styles/AdminNavigationTabs.css";

interface AdminNavigationTabsProps {
  active: string ;
  onChange: (tabId: string) => void;
  onLogout: () => void;
}

export default function AdminNavigationTabs({
  active,
  onChange,
  onLogout,
}: AdminNavigationTabsProps) {
  const tabs = [
    { id: "manage-users", label: "Manage Users" },
    { id: "import-files", label: "Import Files" },
    { id: "view-schematic", label: "View Schematic" },
  ];

  return (
    <div className="admin-nav">
      <div className="tabs">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={`tab-item ${active === t.id ? "active" : ""}`}
            onClick={() => {
              console.log("Admin tab clicked:", t.id); // debug
              onChange(t.id);
            }}
          >
            {t.label}
          </div>
        ))}
      </div>
      <div className="logout" onClick={onLogout}>
        Logout
      </div>
    </div>
  );
}
