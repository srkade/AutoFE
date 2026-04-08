import React, { useState, useEffect, useRef } from "react";
import "../Styles/NavigationTabs.css"
import SearchBar from "../components/SearchBar";
import ModelSelector from "../components/ModelSelector";
import {
  Wrench,
  Cpu,
  Layers,
  Zap,
  AlertTriangle,
  Cable
} from "lucide-react";
import { FiLogOut, FiSun, FiMoon, FiDroplet, FiBriefcase, FiEye } from "react-icons/fi";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useTheme } from "../components/ThemeContext";

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  hideLogout?: boolean;
  hideLogo?: boolean;
  hideSearch?: boolean;
  hideModelSelector?: boolean;
  selectedModelId?: string | null;
  onModelChange?: (modelId: string | null) => void;
}

const tabs = [
  { id: "components", label: "Components", icon: Wrench },
  { id: "controllers", label: "Control Unit", icon: Cpu },
  { id: "systems", label: "Systems", icon: Layers },
  { id: "voltage", label: "Supply", icon: Zap },
  { id: "DTC", label: "Trouble Code", icon: AlertTriangle },
  { id: "wire", label: "Wires", icon: Cable },
  { id: "harnesses", label: "Harnesses", icon: Cable },
];

export default function NavigationTabs({
  activeTab,
  onTabChange,
  onLogout,
  user,
  hideLogout = false,
  hideLogo,
  hideSearch = false,
  hideModelSelector = false,
  selectedModelId,
  onModelChange
}: NavigationTabsProps) {
  const { theme, setTheme, logo } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallMobile = useMediaQuery("(max-width: 480px)");

  return (

    <div className="nav-tabs-wrapper" style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      background: "var(--bg-secondary)",
      borderBottom: "1px solid var(--border-color)",
      padding: isMobile ? "0 12px" : "0 24px",
      minHeight: isMobile ? "68px" : "80px",
      position: "relative",
      gap: "10px"
    }}>
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      
      {/* LOGO AND BRANDING */}
      {!hideLogo && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
            cursor: "pointer"
          }}
          onClick={() => onTabChange("components")}
        >
          <img
            className="logo-crisp"
            style={{
              width: isMobile ? "40px" : "50px",
              height: isMobile ? "40px" : "50px",
              flexShrink: 0
            }}
            src={logo}
            alt="Logo"
          />
          {!isSmallMobile && (
            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? "16px" : "20px",
                color: "var(--text-primary)",
                fontWeight: "bold",
                whiteSpace: "nowrap"
              }}
            >
              CRAZYBEES
            </h1>
          )}
        </div>
      )}

      <nav
        className={`nav-tabs ${menuOpen ? "open" : ""}`}
        style={{
          display: "flex",
          gap: "2px",
          flex: 1,
          justifyContent: isMobile ? "flex-start" : "center",
          height: "100%"
        }}>

        {/* MODEL SELECTOR */}
        {onModelChange && !hideModelSelector && (
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            <ModelSelector
              selectedModelId={selectedModelId || null}
              onModelChange={onModelChange}
              isAuthor={user?.role === 'superadmin' || user?.role === 'author'}
            />
          </div>
        )}

        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => {
                onTabChange(tab.id);
                setMenuOpen(false);
              }}
            >
              <span><Icon size={18} /></span>
              <span>{tab.label}</span>
            </button>
          );
        })}      </nav>

      {/* SEARCH AND USER MENU */}
      <div
        className="nav-actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0
        }}
      >
        {!hideSearch && (
          <div
            className="nav-search-bar"
            style={{
              display: "flex",
              alignItems: "center",
              margin: isMobile ? "0 10px" : "0 20px",
            }}
          >
            <SearchBar />
          </div>
        )}

        {!hideLogout && (
          <div
            ref={userMenuRef}
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--accent-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-on-accent)",
                transition: "all 0.2s ease",
                boxShadow: userMenuOpen ? "0 0 0 2px var(--accent-primary)" : "none",
                userSelect: "none",
              }}
              title="User Account"
            >
              {user?.name ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) : "U"}
            </div>

            {userMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  boxShadow: 'var(--card-shadow)',
                  zIndex: 1000,
                  minWidth: "260px",
                  padding: "16px",
                }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ 
                    fontSize: "14px", 
                    fontWeight: "700", 
                    color: "var(--text-primary)",
                    marginBottom: "4px" 
                  }}>
                    {user?.name || "User Profile"}
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "var(--text-secondary)" 
                  }}>
                    {user?.email || ""}
                  </div>
                </div>

                <div style={{ 
                  padding: "10px", 
                  background: "var(--bg-primary)", 
                  borderRadius: "6px", 
                  marginBottom: "16px" 
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>Role</span>
                    <span style={{ 
                      fontSize: "11px", 
                      padding: "2px 8px", 
                      borderRadius: "12px", 
                      background: "var(--accent-primary)", 
                      color: "var(--text-on-accent)",
                      fontWeight: "700"
                    }}>
                      {user?.role?.toUpperCase() || "USER"}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "8px" }}>Theme</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                    {[
                      { id: 'light', icon: FiSun, label: 'Light', color: '#f8f9fa' },
                      { id: 'dark', icon: FiMoon, label: 'Dark', color: '#1e293b' },
                      { id: 'blue', icon: FiDroplet, label: 'Blue', color: '#0284c7' },
                      { id: 'corporate', icon: FiBriefcase, label: 'Corporate', color: '#475569' },
                      { id: 'high-contrast', icon: FiEye, label: 'High Contrast', color: '#000000' }
                    ].map((t) => {
                      const TIcon = t.icon;
                      const isSelected = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTheme(t.id as any);
                            setUserMenuOpen(false);
                          }}
                          style={{
                            padding: "8px",
                            background: isSelected ? "#007bff" : "#f1f3f5",
                            color: isSelected ? "white" : "#495057",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            boxShadow: isSelected ? "0 2px 4px rgba(0, 123, 255, 0.3)" : "none"
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
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#c82333")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#dc3545")}
                >
                  <FiLogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
