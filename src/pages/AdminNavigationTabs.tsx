import React, { useState, useEffect } from "react";
import "../Styles/AdminNavigationTabs.css";
import { FiUsers, FiUpload, FiCpu, FiUser } from "react-icons/fi";
import logo from "../assets/Images/logo.png";

interface AdminNavigationTabsProps {
  active: string;
  onChange: (tabId: string) => void;
  onLogout: () => void;
  user?: { name: string; username: string; role: string } | null;
}

export default function AdminNavigationTabs({
  active,
  onChange,
  onLogout,
  user,
}: AdminNavigationTabsProps) {
  const [showPopup, setShowPopup] = useState(false);

  const tabs = [
    { id: "manage-users", label: "Manage Users", icon: FiUsers },
    { id: "import-files", label: "Import Files", icon: FiUpload },
    { id: "view-schematic", label: "View Schematic", icon: FiCpu },
  ];
  console.log("AdminNavigationTabs render → user prop:", user);

  useEffect(() => {
    console.log("User prop updated:", user);
  }, [user]);


  return (
    <div className="admin-nav">
      {/* Logo */}
      <div
        style={{
          width: "320px",
          display: "flex",
          height: "80px",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
        <h1 style={{ marginLeft: 10, fontSize: 20 }}>CRAZYBEES</h1>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              className={`tab-item ${active === t.id ? "active" : ""}`}
              onClick={() => onChange(t.id)}
            >
              <Icon size={18} />
              <span>{t.label}</span>
            </div>
          );
        })}
      </div>

      {/* User Icon */}
      <div
        className="logout"
        onClick={() => {
          console.log("User icon clicked");
          console.log("showPopup BEFORE:", showPopup);
          console.log("user at click time:", user);
          setShowPopup(prev => !prev);
        }}
      >
        <FiUser size={24} />

        {/* POPUP */}
        {showPopup && (
          <div className="user-popup">
            <div><span><b>Name:</b>{user?.name ?? "Loading..."}</span></div>
            <div><span><b>Username:</b>{user?.username ?? "loadnig..."}</span></div>
            <div><span><b>Role:</b>{user?.role ?? "loading..."}</span></div>

            <button onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
