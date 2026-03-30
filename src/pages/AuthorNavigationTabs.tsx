import React, { useState, useEffect, useRef } from "react";
import "../Styles/AuthorNavigationTabs.css";
import { FiUsers, FiUpload, FiCpu, FiUser, FiImage, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import logo from "../assets/Images/logo.png";
import SearchBar from "../components/SearchBar";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const userIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { id: "manage-users", label: "Manage Users", icon: FiUsers },
    { id: "import-files", label: "Import Files", icon: FiUpload },
    { id: "import-images", label: "Asset Management", icon: FiImage },
    { id: "view-schematic", label: "View Schematic", icon: FiCpu },
  ];

  useEffect(() => {
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showPopup && userIconRef.current && !userIconRef.current.contains(target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);


  return (
    <div className="author-nav-wrapper">
      <div className="admin-topbar">
        {isMobile && (
          <button 
            className="hamburger-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        )}

        <div className="topbar-logo-mobile">
          <img className="logo-crisp" src={logo} alt="Logo" style={{ width: 32, height: 32 }} />
        </div>

        {/* Search Bar in Topbar */}
        <div style={{ flex: "1", maxWidth: "500px", margin: isMobile ? "0 10px" : "0 20px" }}>
          <SearchBar />
        </div>

        <div
          ref={userIconRef}
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            position: "relative",
            cursor: "pointer"
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowPopup(prev => !prev);
          }}
        >
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "600",
            color: "white",
            transition: "all 0.2s ease",
            boxShadow: showPopup ? "0 0 0 2px rgba(59, 130, 246, 0.4)" : "none",
          }}>
            {user?.name ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) : "A"}
          </div>

          {showPopup && (
            <div 
              className="user-popup-new"
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                right: 0,
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                width: "260px",
                padding: "16px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "0",
                zIndex: 1002,
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "2px" }}>
                  {user?.name || "Author Profile"}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {user?.email || ""}
                </div>
              </div>

              <div style={{ 
                padding: "8px 12px", 
                background: "#f8fafc", 
                borderRadius: "6px", 
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Role</span>
                <span style={{ 
                  fontSize: "11px", 
                  padding: "2px 8px", 
                  borderRadius: "12px", 
                  background: "#dbeafe", 
                  color: "#2563eb",
                  fontWeight: "700"
                }}>
                  {user?.role?.toUpperCase() || "AUTHOR"}
                </span>
              </div>

              <button 
                onClick={onLogout} 
                className="popup-logout-btn"
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background 0.2s ease"
                }}
              >
                <FiLogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`admin-nav ${isMobile ? 'mobile-drawer' : ''} ${isMenuOpen ? 'open' : ''}`}>
        {isMobile && (
          <button className="close-drawer" onClick={() => setIsMenuOpen(false)}>
            <FiX size={24} />
          </button>
        )}
        {/* Logo */}
        <div
          style={{
            width: "100%",
            display: "flex",
            height: "80px",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <img className="logo-crisp" src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
          <h1 style={{ marginLeft: 10, fontSize: 20, color: "white" }}>CRAZYBEES</h1>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                className={`tab-item ${active === t.id ? "active" : ""}`}
                onClick={() => {
                  onChange(t.id);
                  if (isMobile) setIsMenuOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      {isMobile && isMenuOpen && (
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)} />
      )}
    </div>
  );
}
