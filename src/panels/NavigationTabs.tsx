import React, { useState, useEffect, useRef } from "react";
import "../Styles/NavigationTabs.css"
import logo from "../assets/Images/logo.png";
import {
  Wrench,
  Cpu,
  Layers,
  Zap,
  AlertTriangle,
  Cable
} from "lucide-react";

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

export default function NavigationTabs({ activeTab, onTabChange, onLogout, user, hideLogout = false, hideLogo }: NavigationTabsProps) {
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
              width: "320px",
              display: "flex",
              height: "80px",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: "70px",
                height: "70px",

              }}
              src={logo}
              alt="Logo"
            />
            <h1
              style={{
                marginRight: "40px",
                marginLeft: "10px",
                fontSize: "20px",
              }}
            >
              CRAZYBEES
            </h1>
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
        })}
        {!hideLogout && (
          <div
            ref={userMenuRef}
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto"
            }}
          >
            {/*  User icon (visible always) */}
            <div
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#f1f3f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "20px",
                color: "#343a40",
                transition: "background 0.3s ease",
              }}
              title="User Menu"
              onMouseEnter={(e) => ((e.currentTarget.style.background = "#e9ecef"))}
              onMouseLeave={(e) => ((e.currentTarget.style.background = "#f1f3f5"))}
            >
              👤
            </div>

            {/* Dropdown menu: User info + Logout */}
            {userMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  right: 0,
                  background: "white",
                  border: "1px solid #dee2e6",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  padding: "12px",
                  zIndex: 1000,
                  minWidth: "200px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ fontWeight: "bold", color: "#212529" }}><span>Name:{user?.name}</span></div>
                  <div style={{ fontSize: "bold", color: "#212529" }}><span>Email:{user?.email}</span></div>
                  <div style={{ fontSize: "bold", color: "#212529"}}><span>Role:{user?.role}</span></div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #e9ecef" }} />

                <button
                  onClick={onLogout}
                  style={{
                    background: "#ae8c8fff",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    width: "100%",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.background = "#a74550")
                  }

                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}