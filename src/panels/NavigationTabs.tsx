import React, { useState, useEffect, useRef } from "react";
import "../Styles/NavigationTabs.css"
import logo from "../assets/Images/logo.png";
import SearchBar from "../components/SearchBar";
import {
  Wrench,
  Cpu,
  Layers,
  Zap,
  AlertTriangle,
  Cable
} from "lucide-react";
import { FiLogOut } from "react-icons/fi";
import { useMediaQuery } from "../hooks/useMediaQuery";

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

export default function NavigationTabs({ activeTab, onTabChange, onLogout, user, hideLogout = false, hideLogo, hideSearch = false }: NavigationTabsProps) {
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

    <div className="nav-tabs-wrapper" style={{ position: "relative" }}>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      <nav
        className={`nav-tabs ${menuOpen ? "open" : ""}`}
        style={{
          background: "white",
          borderBottom: "1px solid #e9ecef",
          padding: "0 24px",
          display: "flex",
          gap: "2px"

        }}>
        {/* LOGO AND BRANDING */}
        {!hideLogo && (
          <div
            style={{
              width: isMobile ? "auto" : "320px",
              display: "flex",
              height: isMobile ? "60px" : "80px",
              alignItems: "center",
              padding: isMobile ? "0 10px" : "0",
            }}
          >
            <img
              className="logo-crisp"
              style={{
                width: isMobile ? "50px" : "70px",
                height: isMobile ? "50px" : "70px",
              }}
              src={logo}
              alt="Logo"
            />
            {!isSmallMobile && (
              <h1
                style={{
                  marginRight: isMobile ? "10px" : "40px",
                  marginLeft: "10px",
                  fontSize: isMobile ? "16px" : "20px",
                }}
              >
                CRAZYBEES
              </h1>
            )}
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                border: "none",
                background: activeTab === tab.id ? "#a4cefcff" : "transparent",
                //color: activeTab === tab.id ? "#495057" : "#6c757d",
                color: activeTab === tab.id ? "black" : "black",
                borderBottom: activeTab === tab.id ? "3px solid #007bff" : "3px solid transparent",
                borderTop: activeTab === tab.id ? "3px solid #007bff" : "3px solid transparent",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "bold",
                borderRadius: "8px 8px 0 0",
                transition: "all 0.2s ease",
                height: "60px",
                justifyContent: "center",
                outline: "none",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  (e.currentTarget as HTMLElement).style.background = "#eaebeeff";
                  (e.currentTarget as HTMLElement).style.color = "black";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "black";
                }
              }}
            >
              <span><Icon size={18} /></span>
              <span>{tab.label}</span>
            </button>
          );
        })}      </nav>

      {/* SEARCH AND USER MENU (OUTSIDE NAV FOR MOBILE ACCESSIBILITY) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "auto",
          paddingRight: "24px",
          height: isMobile ? "60px" : "80px",
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 101, // Above nav menu
        }}
      >
        {!hideSearch && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: isMobile ? "0 10px" : "0 20px",
              maxWidth: "400px",
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
                background: "#007bff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "white",
                transition: "all 0.2s ease",
                boxShadow: userMenuOpen ? "0 0 0 2px rgba(0, 123, 255, 0.25)" : "none",
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
                  background: "white",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  zIndex: 1000,
                  minWidth: "260px",
                  padding: "16px",
                }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ 
                    fontSize: "14px", 
                    fontWeight: "700", 
                    color: "#212529",
                    marginBottom: "4px" 
                  }}>
                    {user?.name || "User Profile"}
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#6c757d" 
                  }}>
                    {user?.email || ""}
                  </div>
                </div>

                <div style={{ 
                  padding: "10px", 
                  background: "#f8f9fa", 
                  borderRadius: "6px", 
                  marginBottom: "16px" 
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#6c757d", textTransform: "uppercase" }}>Role</span>
                    <span style={{ 
                      fontSize: "11px", 
                      padding: "2px 8px", 
                      borderRadius: "12px", 
                      background: "#e7f1ff", 
                      color: "#007bff",
                      fontWeight: "700"
                    }}>
                      {user?.role?.toUpperCase() || "USER"}
                    </span>
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