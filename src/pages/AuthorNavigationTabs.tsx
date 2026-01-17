import React, { useState, useEffect } from "react";
import "../Styles/AuthorNavigationTabs.css";
import { FiUsers, FiUpload, FiCpu, FiUser, FiImage } from "react-icons/fi";
import logo from "../assets/Images/logo.png";

interface AuthorNavigationTabsProps {
  active: string;
  onChange: (tabId: string) => void;
  onLogout: () => void;
  user?:
  {
    name: string;
    email: string;
    role: string
  } | null;
}

export default function AuthorNavigationTabs({
  active,
  onChange,
  onLogout,
  user,
}: AuthorNavigationTabsProps) {
  const [showPopup, setShowPopup] = useState(false);

  const tabs = [
    { id: "manage-users", label: "Manage Users", icon: FiUsers },
    { id: "import-files", label: "Import Files", icon: FiUpload },
    {id:"import-images", label:"Asset Management", icon: FiImage},
    { id: "view-schematic", label: "View Schematic", icon: FiCpu },
  ];
  console.log("AuthorNavigationTabs render → user prop:", user);

  useEffect(() => {
    console.log("User prop updated:", user);
  }, [user]);


  return (
    <div>
      <div className="admin-topbar">
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
          {/* <FiUser size={24} /> */}
          👤
          {/* POPUP */}
          {showPopup && (
            <div className="user-popup">
              <div><span><b>Name:</b>{user?.name ?? "Loading..."}</span></div>
              <div><span><b>Email:</b>{user?.email ?? "loadnig..."}</span></div>
              <div><span><b>Role:</b>{user?.role ?? "loading..."}</span></div>

              <button onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
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
          <h1 style={{ marginLeft: 10, fontSize: 20, color:"white" }}>CRAZYBEES</h1>
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
      </div>
    </div>
  );
}
