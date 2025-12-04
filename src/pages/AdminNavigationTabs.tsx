import React from "react";
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
    { id: "manage-users", label: "Manage Users" },
    { id: "import-files", label: "Import Files" },
    // { id: "uploaded-files", label: "Uploaded Files" },
    { id: "view-schematic", label: "View Schematic" }
  ];

  return (
    <div style={{ 
      display: "flex", 
      background: "#343a40", 
      padding: "10px", 
      color: "white",
      gap: "20px"
    }}>
      
      {tabs.map(t => (
        <div
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "6px",
            background: active === t.id ? "#007bff" : "transparent"
          }}
        >
          {t.label}
        </div>
      ))}

      {/* Logout button right side */}
      <div style={{ marginLeft: "auto", cursor: "pointer" }} onClick={onLogout}>
        Logout
      </div>
    </div>
  );
}
