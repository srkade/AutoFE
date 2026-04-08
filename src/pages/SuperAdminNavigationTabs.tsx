import React, { useState, useEffect } from "react";
import ModelSelector from "../components/ModelSelector";
import { FiUser, FiHome, FiSettings, FiShield, FiDatabase, FiBarChart2, FiActivity, FiLogOut, FiMenu, FiX } from "react-icons/fi";
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
  selectedModelId?: string | null;
  onModelChange?: (modelId: string | null) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isPanelHidden?: boolean;
  onPanelToggle?: (hidden: boolean) => void;
  isPanelCollapsed?: boolean;
  onPanelCollapse?: (collapsed: boolean) => void;
}

export default function SuperAdminNavigationTabs({
  active,
  onChange,
  onLogout,
  user,
  selectedModelId,
  onModelChange,
  isMenuOpen,
  setIsMenuOpen,
  isPanelHidden: parentIsPanelHidden,
  onPanelToggle,
  isPanelCollapsed: parentIsPanelCollapsed,
  onPanelCollapse,
}: SuperAdminNavigationTabsProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [internalPanelHidden, setInternalPanelHidden] = useState(false);
  const [internalPanelCollapsed, setInternalPanelCollapsed] = useState(false);

  // Use parent state if provided, otherwise use internal state
  const isPanelHidden = parentIsPanelHidden !== undefined ? parentIsPanelHidden : internalPanelHidden;
  const setIsPanelHidden = onPanelToggle ? onPanelToggle : setInternalPanelHidden;
  
  const isPanelCollapsed = parentIsPanelCollapsed !== undefined ? parentIsPanelCollapsed : internalPanelCollapsed;
  const setIsPanelCollapsed = onPanelCollapse ? onPanelCollapse : setInternalPanelCollapsed;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
        // Reset panel hidden state when switching to mobile
        if (mobile) {
          setIsPanelHidden(false);
          setIsPanelCollapsed(false);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { id: "home", label: "Home", icon: FiHome },
    { id: "system-settings", label: "System Settings", icon: FiSettings },
    { id: "security-logs", label: "Security Logs", icon: FiShield },
    { id: "database-management", label: "Database Management", icon: FiDatabase },
    { id: "user-analytics", label: "User Analytics", icon: FiBarChart2 },
    { id: "system-monitoring", label: "System Monitoring", icon: FiActivity },
  ];

  return (
    <>
      <div className={`admin-nav sa-nav ${isMobile ? 'mobile-drawer' : ''} ${isMenuOpen ? 'open' : ''} ${!isMobile && isPanelCollapsed ? 'collapsed' : ''}`}>
        {isMobile && (
          <button className="close-drawer" onClick={() => setIsMenuOpen(false)}>
            <FiX size={24} />
          </button>
        )}

        <div style={{ padding: isPanelCollapsed ? "20px 8px" : "20px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Logo */}
          <div className="nav-logo" style={{ justifyContent: isPanelCollapsed ? "center" : "center", marginBottom: isPanelCollapsed ? "16px" : "32px" }}>
            <img className="logo-crisp" src={logo} alt="Logo" style={{ width: isPanelCollapsed ? 40 : 60, height: isPanelCollapsed ? 40 : 60, borderRadius: "8px", objectFit: "contain" }} />
            {!isPanelCollapsed && <h1 style={{ marginLeft: 12, fontSize: 22, color: "#f1f5f9", fontWeight: "700" }}>CRAZYBEES</h1>}
          </div>

          {/* MODEL SELECTOR FOR SUPER ADMIN */}
          {onModelChange && (
            <div style={{ padding: '0 16px 20px 16px', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
              <ModelSelector
                selectedModelId={selectedModelId || null}
                onModelChange={onModelChange}
                isAuthor={true}
              />
            </div>
          )}

          {/* Tabs */}
          <div className="tabs" style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <div
                  key={tab.id}
                  className={`tab-item ${active === tab.id ? "active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isPanelCollapsed ? "center" : "flex-start",
                    padding: isPanelCollapsed ? "14px 8px" : "14px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: active === tab.id ? "#3b82f6" : "transparent",
                    color: active === tab.id ? "white" : "#cbd5e1",
                    fontWeight: active === tab.id ? "600" : "500",
                    transition: "all 0.2s ease",
                    border: active === tab.id ? "none" : "1px solid transparent",
                    margin: "2px 0",
                    position: "relative"
                  }}
                  onClick={() => {
                    onChange(tab.id);
                    if (isMobile) {
                      setIsMenuOpen(false);
                    } else {
                      // Collapse panel instead of hiding
                      setIsPanelCollapsed(!isPanelCollapsed);
                    }
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
                  title={isPanelCollapsed ? tab.label : ""}
                >
                  <Icon size={20} style={{ marginRight: isPanelCollapsed ? "0" : "12px" }} />
                  {!isPanelCollapsed && <span style={{ fontSize: "15px" }}>{tab.label}</span>}
                  
                  {/* Tooltip on hover when collapsed */}
                  {isPanelCollapsed && (
                    <div
                      style={{
                        position: "absolute",
                        left: "100%",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#1e293b",
                        color: "#f1f5f9",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                        opacity: 0,
                        pointerEvents: "none",
                        transition: "opacity 0.2s ease",
                        marginLeft: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                        zIndex: 1003
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                    >
                      {tab.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Super Admin Badge */}
          {!isPanelCollapsed && (
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
          )}

        </div>
      </div>
      
      {/* Toggle Panel Button - Desktop Only */}
      {!isMobile && (
        <button 
          className="toggle-panel-btn"
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          aria-label={isPanelCollapsed ? "Expand Navigation" : "Collapse Navigation"}
          title={isPanelCollapsed ? "Expand Navigation" : "Collapse Navigation"}
          style={{
            position: 'fixed',
            top: '20px',
            left: isPanelCollapsed ? '80px' : '310px',
            zIndex: 1002,
            transition: 'left 0.3s ease',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px'
          }}
        >
          <FiMenu size={20} />
        </button>
      )}
      
      {isMobile && isMenuOpen && (
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)} />
      )}
    </>
  );
}