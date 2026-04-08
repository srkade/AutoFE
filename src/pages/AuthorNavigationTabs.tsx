import React, { useState, useEffect, useRef } from "react";
import "../Styles/AuthorNavigationTabs.css";
import { FiUsers, FiUpload, FiCpu, FiUser, FiImage, FiMenu, FiX, FiLogOut, FiSun, FiMoon, FiDroplet, FiBriefcase, FiEye } from "react-icons/fi";
import SearchBar from "../components/SearchBar";
import ModelSelector from "../components/ModelSelector";
import { useTheme } from "../components/ThemeContext";

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
  selectedModelId?: string | null;
  onModelChange?: (modelId: string | null) => void;
  isPanelHidden?: boolean;
  onPanelToggle?: (hidden: boolean) => void;
}

export default function AuthorNavigationTabs({
  active,
  onChange,
  onLogout,
  user,
  selectedModelId,
  onModelChange,
  isPanelHidden: parentIsPanelHidden,
  onPanelToggle,
}: AuthorNavigationTabsProps) {
  const { theme, setTheme, logo } = useTheme();
  const [showPopup, setShowPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [internalPanelHidden, setInternalPanelHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [modelCount, setModelCount] = useState<number | null>(null);
  const userIconRef = useRef<HTMLDivElement>(null);

  // Use parent state if provided, otherwise use internal state
  const isPanelHidden = parentIsPanelHidden !== undefined ? parentIsPanelHidden : internalPanelHidden;
  const setIsPanelHidden = onPanelToggle ? onPanelToggle : setInternalPanelHidden;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
        // Auto-hide panel on desktop when switching to mobile
        if (mobile) setIsPanelHidden(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { id: "manage-users", label: "Manage Users", icon: FiUsers },
    { id: "manage-models", label: "Model Management", icon: FiBriefcase },
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
    <>
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
          <img className="logo-crisp" src={logo} alt="Logo" style={{ width: 70, height: 70, borderRadius: "8px", objectFit: "contain" }} />
          <h1 style={{ marginLeft: 12, fontSize: 22, color: "var(--sidebar-text)", fontWeight: "700" }}>CRAZYBEES</h1>
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
                  if (isMobile) {
                    setIsMenuOpen(false);
                  } else {
                    // Auto-hide panel on desktop when switching tabs
                    setIsPanelHidden(true);
                  }
                }}
              >
                <Icon size={18} />
                <span>{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="admin-topbar">
        {/* Show Panel Toggle - Only visible when panel is hidden */}
        {isPanelHidden && !isMobile && (
          <button 
            className="toggle-panel-btn" 
            onClick={() => setIsPanelHidden(false)}
            aria-label="Show Navigation"
            title="Show Navigation"
          >
            <FiMenu size={20} />
          </button>
        )}
        
        {/* Hide Panel Button - Only visible when panel is shown */}
        {!isPanelHidden && !isMobile && (
          <button 
            className="toggle-panel-btn" 
            onClick={() => setIsPanelHidden(true)}
            aria-label="Hide Navigation"
            title="Hide Navigation"
          >
            <FiMenu size={20} />
          </button>
        )}
        
        {isMobile && (
          <button 
            className="hamburger-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <FiMenu size={24} />
          </button>
        )}

        <div className="topbar-logo-mobile">
          <img className="logo-crisp" src={logo} alt="Logo" style={{ width: 32, height: 32 }} />
        </div>

        {/* Search Bar in Topbar */}
        <div style={{ flex: "1", maxWidth: "500px", margin: isMobile ? "0 10px" : "0 20px", display: 'flex', alignItems: 'center' }}>
          <SearchBar />
          {onModelChange && (
            <div style={{ marginLeft: '20px' }}>
              <ModelSelector
                selectedModelId={selectedModelId || null}
                onModelChange={onModelChange}
                isAuthor={user?.role === 'author' || user?.role === 'admin'}
                onModelsLoaded={setModelCount}
              />
            </div>
          )}
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
            background: "var(--accent-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--text-on-accent)",
            transition: "all 0.2s ease",
            boxShadow: showPopup ? "0 0 0 2px var(--accent-primary)" : "none",
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
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                width: "260px",
                padding: "16px",
                boxShadow: "var(--card-shadow)",
                display: "flex",
                flexDirection: "column",
                gap: "0",
                zIndex: 1002,
                color: "var(--text-primary)"
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "2px" }}>
                  {user?.name || "Author Profile"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {user?.email || ""}
                </div>
              </div>

              <div style={{ 
                padding: "8px 12px", 
                background: "var(--bg-primary)", 
                borderRadius: "6px", 
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>Role</span>
                <span style={{ 
                  fontSize: "11px", 
                  padding: "2px 8px", 
                  borderRadius: "12px", 
                  background: "var(--accent-primary)", 
                  color: "var(--text-on-accent)",
                  fontWeight: "700"
                }}>
                  {user?.role?.toUpperCase() || "AUTHOR"}
                </span>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "8px" }}>Theme</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {[
                    { id: 'light', icon: FiSun, label: 'Light' },
                    { id: 'dark', icon: FiMoon, label: 'Dark' },
                    { id: 'blue', icon: FiDroplet, label: 'Blue' },
                    { id: 'corporate', icon: FiBriefcase, label: 'Corporate' },
                    { id: 'high-contrast', icon: FiEye, label: 'High Contrast' }
                  ].map((t) => {
                    const TIcon = t.icon;
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTheme(t.id as any);
                          setShowPopup(false);
                        }}
                        style={{
                          padding: "8px",
                          background: isSelected ? "#3b82f6" : "#f1f5f9",
                          color: isSelected ? "white" : "#475569",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease",
                          boxShadow: isSelected ? "0 2px 4px rgba(59, 130, 246, 0.3)" : "none"
                        }}
                        title={t.label}
                      >
                        <TIcon size={16} />
                      </button>
                    );
                  })}
                </div>
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
      
      {isMobile && isMenuOpen && (
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* No Access Overlay for regular users with 0 models */}
      {modelCount === 0 && user?.role !== 'author' && user?.role !== 'admin' && (
        <div style={{
          position: "fixed",
          top: "80px", // Below topbar
          left: isPanelHidden ? "0" : "280px",
          right: 0,
          bottom: 0,
          background: "var(--bg-primary)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "40px",
          textAlign: "center",
          transition: "left 0.3s ease"
        }}>
          <div style={{
            padding: "40px",
            background: "var(--bg-secondary)",
            borderRadius: "16px",
            boxShadow: "var(--card-shadow)",
            maxWidth: "600px",
            border: "1px solid var(--border-color)"
          }}>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              borderRadius: "50%", 
              background: "#fee2e2", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              margin: "0 auto 24px",
              color: "#ef4444"
            }}>
              <FiX size={40} />
            </div>
            <h2 style={{ fontSize: "24px", color: "var(--text-primary)", marginBottom: "16px", fontWeight: "700" }}>Access Restricted</h2>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "0" }}>
              You don't have access of model. Please contact with your respective admin for assistance.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
