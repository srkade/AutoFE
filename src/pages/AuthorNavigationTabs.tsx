import React, { useState, useEffect, useRef } from "react";
import "../Styles/AuthorNavigationTabs.css";
import { FiUsers, FiUpload, FiCpu, FiUser, FiImage, FiMenu, FiX, FiLogOut, FiSun, FiMoon, FiDroplet, FiBriefcase, FiEye, FiLock, FiEyeOff, FiCheck } from "react-icons/fi";
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
  isMenuOpen?: boolean;
  setIsMenuOpen?: (isOpen: boolean) => void;
  isPanelHidden?: boolean;
  onPanelToggle?: (hidden: boolean) => void;
  isPanelCollapsed?: boolean;
  onPanelCollapse?: (collapsed: boolean) => void;
}

export default function AuthorNavigationTabs({
  active,
  onChange,
  onLogout,
  user,
  selectedModelId,
  onModelChange,
  isMenuOpen: parentIsMenuOpen,
  setIsMenuOpen: parentSetIsMenuOpen,
  isPanelHidden: parentIsPanelHidden,
  onPanelToggle,
  isPanelCollapsed: parentIsPanelCollapsed,
  onPanelCollapse,
}: AuthorNavigationTabsProps) {
  const { logo } = useTheme();
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const [internalPanelHidden, setInternalPanelHidden] = useState(false);
  const [internalPanelCollapsed, setInternalPanelCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [modelCount, setModelCount] = useState<number | null>(null);
  const userIconRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [showPopup, setShowPopup] = useState(false);

  // Use parent state if provided, otherwise use internal state
  const isMenuOpen = parentIsMenuOpen !== undefined ? parentIsMenuOpen : internalMenuOpen;
  const setIsMenuOpen = parentSetIsMenuOpen ? parentSetIsMenuOpen : setInternalMenuOpen;
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
    { id: "manage-users", label: "Manage Users", icon: FiUsers },
    { id: "manage-models", label: "Model Management", icon: FiBriefcase },
    { id: "import-files", label: "Import Files", icon: FiUpload },
    { id: "import-images", label: "Asset Management", icon: FiImage },
    { id: "view-schematic", label: "View Schematic", icon: FiCpu },
  ];

  return (
    <>
      <div className={`admin-nav ${isMobile ? 'mobile-drawer' : ''} ${isMenuOpen ? 'open' : ''} ${!isMobile && isPanelCollapsed ? 'collapsed' : ''}`}>
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
            marginBottom: isPanelCollapsed ? "16px" : "40px",
            justifyContent: isPanelCollapsed ? "center" : "flex-start"
          }}
        >
          <img className="logo-crisp" src={logo} alt="Logo" style={{ width: isPanelCollapsed ? 45 : 70, height: isPanelCollapsed ? 45 : 70, borderRadius: "8px", objectFit: "contain" }} />
          {!isPanelCollapsed && <h1 style={{ marginLeft: 12, fontSize: 22, color: "var(--sidebar-text)", fontWeight: "700" }}>CRAZYBEES</h1>}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                className={`tab-item ${active === t.id ? "active" : ""}`}
                style={{
                  justifyContent: isPanelCollapsed ? "center" : "flex-start",
                  padding: isPanelCollapsed ? "10px 8px" : "10px",
                  position: "relative"
                }}
                onClick={() => {
                  onChange(t.id);
                  if (isMobile) {
                    setIsMenuOpen(false);
                  }
                }}
                title={isPanelCollapsed ? t.label : ""}
              >
                <Icon size={18} style={{ marginRight: isPanelCollapsed ? "0" : "10px" }} />
                {!isPanelCollapsed && <span>{t.label}</span>}

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
                    className="nav-tooltip"
                  >
                    {t.label}
                  </div>
                )}
              </div>
            );
          })}
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

export function AuthorTopbar({
  onLogout,
  user,
  selectedModelId,
  onModelChange,
  isPanelCollapsed,
  onPanelCollapse,
  setIsMenuOpen,
  token
}: {
  onLogout: () => void;
  user: any;
  selectedModelId?: string | null;
  onModelChange?: (modelId: string | null) => void;
  isPanelCollapsed?: boolean;
  onPanelCollapse?: (collapsed: boolean) => void;
  setIsMenuOpen?: (open: boolean) => void;
  token?: string | null;
}) {
  const { theme, setTheme, logo } = useTheme();
  const [showPopup, setShowPopup] = useState(false);
  const userIconRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Change Password modal state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [cpForm, setCpForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [cpShowCurrent, setCpShowCurrent] = useState(false);
  const [cpShowNew, setCpShowNew] = useState(false);
  const [cpLoading, setCpLoading] = useState(false);
  const [cpMessage, setCpMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showPopup && userIconRef.current && !userIconRef.current.contains(target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cpForm.newPassword !== cpForm.confirmPassword) {
      setCpMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (cpForm.newPassword.length < 6) {
      setCpMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    setCpLoading(true);
    setCpMessage(null);
    try {
      const res = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: cpForm.currentPassword,
          newPassword: cpForm.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCpMessage({ type: 'success', text: 'Password changed successfully!' });
        setCpForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => { setShowChangePassword(false); setCpMessage(null); }, 2000);
      } else {
        setCpMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch {
      setCpMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setCpLoading(false);
    }
  };

  return (
    <>
      <div className="admin-topbar">
        {!isMobile && (
          <button
            className="toggle-panel-btn"
            onClick={() => onPanelCollapse && onPanelCollapse(!isPanelCollapsed)}
            aria-label={isPanelCollapsed ? "Expand Navigation" : "Collapse Navigation"}
            title={isPanelCollapsed ? "Expand Navigation" : "Collapse Navigation"}
            style={{ marginRight: isPanelCollapsed ? "8px" : "12px" }}
          >
            <FiMenu size={20} />
          </button>
        )}

        {isMobile && (
          <button
            className="hamburger-btn"
            onClick={() => setIsMenuOpen && setIsMenuOpen(true)}
            aria-label="Toggle Menu"
          >
            <FiMenu size={24} />
          </button>
        )}

        <div className="topbar-logo-mobile">
          <img className="logo-crisp" src={logo} alt="Logo" style={{ width: 32, height: 32 }} />
        </div>

        <div style={{ flex: "1", maxWidth: "500px", margin: isMobile ? "0 10px" : "0 20px", display: 'flex', alignItems: 'center' }}>
          <SearchBar />
          {onModelChange && (
            <div style={{ marginLeft: '20px' }}>
              <ModelSelector
                selectedModelId={selectedModelId || null}
                onModelChange={onModelChange}
                isAuthor={true}
              />
            </div>
          )}
        </div>

        <div
          ref={userIconRef}
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", position: "relative", cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            setShowPopup(prev => !prev);
          }}
        >
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent-primary)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "600",
            color: "var(--text-on-accent)", boxSizing: "border-box", transition: "all 0.2s ease",
            boxShadow: showPopup ? "0 0 0 2px var(--accent-primary)" : "none",
          }}>
            {user?.name ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) : "A"}
          </div>

          {showPopup && (
            <div className="user-popup-new" style={{
              position: "absolute", top: "calc(100% + 12px)", right: 0, background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)", borderRadius: "10px", width: "260px", padding: "16px",
              boxShadow: "var(--card-shadow)", display: "flex", flexDirection: "column", zIndex: 1002, color: "var(--text-primary)"
            }}>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "2px" }}>
                  {user?.name || "Author Profile"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{user?.email || ""}</div>
              </div>

              <div style={{ padding: "8px 12px", background: "var(--bg-primary)", borderRadius: "6px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>Role</span>
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "12px", background: "var(--accent-primary)", color: "var(--text-on-accent)", fontWeight: "700" }}>
                  {user?.role?.toUpperCase() || "AUTHOR"}
                </span>
              </div>

              {/* Change Password button */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowPopup(false); setShowChangePassword(true); }}
                style={{
                  width: "100%", padding: "9px", background: "var(--bg-primary)", color: "var(--text-primary)",
                  border: "1px solid var(--border-color)", borderRadius: "8px", cursor: "pointer",
                  fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px", transition: "background 0.2s ease", marginBottom: "12px"
                }}
              >
                <FiLock size={14} /> Change Password
              </button>

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
                      <button key={t.id} onClick={(e) => { e.stopPropagation(); setTheme(t.id as any); setShowPopup(false); }}
                        style={{ padding: "8px", background: isSelected ? "#3b82f6" : "#f1f5f9", color: isSelected ? "white" : "#475569", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", boxShadow: isSelected ? "0 2px 4px rgba(59, 130, 246, 0.3)" : "none" }}
                        title={t.label}>
                        <TIcon size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button onClick={onLogout} className="popup-logout-btn" style={{ width: "100%", padding: "10px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s ease" }}>
                <FiLogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}
          onClick={() => { setShowChangePassword(false); setCpMessage(null); setCpForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
        >
          <div style={{
            background: 'var(--bg-secondary, white)', borderRadius: '14px', width: '100%',
            maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden'
          }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                <FiLock size={20} />
                <strong style={{ fontSize: '16px' }}>Change Password</strong>
              </div>
              <button
                onClick={() => { setShowChangePassword(false); setCpMessage(null); setCpForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleChangePassword} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cpMessage && (
                <div style={{
                  padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                  background: cpMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                  color: cpMessage.type === 'success' ? '#065f46' : '#991b1b',
                  border: `1px solid ${cpMessage.type === 'success' ? '#6ee7b7' : '#fca5a5'}`
                }}>
                  {cpMessage.text}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary, #475569)', marginBottom: '6px' }}>
                  Current Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={cpShowCurrent ? 'text' : 'password'}
                    value={cpForm.currentPassword}
                    onChange={e => setCpForm({ ...cpForm, currentPassword: e.target.value })}
                    placeholder="Enter your current password"
                    required
                    style={{ width: '100%', paddingRight: '44px', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setCpShowCurrent(p => !p)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                    {cpShowCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary, #475569)', marginBottom: '6px' }}>
                  New Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={cpShowNew ? 'text' : 'password'}
                    value={cpForm.newPassword}
                    onChange={e => setCpForm({ ...cpForm, newPassword: e.target.value })}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    style={{ width: '100%', paddingRight: '44px', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setCpShowNew(p => !p)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                    {cpShowNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary, #475569)', marginBottom: '6px' }}>
                  Confirm New Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="password"
                  value={cpForm.confirmPassword}
                  onChange={e => setCpForm({ ...cpForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
                {cpForm.confirmPassword && cpForm.newPassword !== cpForm.confirmPassword && (
                  <small style={{ color: '#ef4444', marginTop: '4px', display: 'block' }}>Passwords do not match</small>
                )}
              </div>

              <button
                type="submit"
                disabled={cpLoading || !cpForm.currentPassword || !cpForm.newPassword || cpForm.newPassword !== cpForm.confirmPassword}
                style={{
                  padding: '12px', background: '#1e40af', color: 'white', border: 'none',
                  borderRadius: '8px', cursor: cpLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600', fontSize: '14px', opacity: cpLoading ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {cpLoading ? 'Changing…' : <><FiCheck size={16} /> Update Password</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
