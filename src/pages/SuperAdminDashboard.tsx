import React, { useState, useEffect, useRef } from "react";
import SuperAdminNavigationTabs from "./SuperAdminNavigationTabs";
import SystemSettings from "./SystemSettings";
import SecurityLogs from "./SecurityLogs";
import DatabaseManagement from "./DatabaseManagement";
import UserAnalytics from "./UserAnalytics";
import SystemMonitoring from "./SystemMonitoring";
import SuperAdminHomePage from "./SuperAdminHomePage";
import SearchBar from "../components/SearchBar";
import { FiLogOut, FiMenu } from "react-icons/fi";
import "../Styles/AuthorNavigationTabs.css";

export default function SuperAdminDashboard({ token, onLogout }: { token: string | null, onLogout: () => void }) {
    const [activeTab, setActiveTab] = useState("home");
    const [userInfo, setUserInfo] = useState<{
        name: string;
        username: string;
        email: string;
        role: string;
    } | null>(null);
    const [showUserPopup, setShowUserPopup] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPanelHidden, setIsPanelHidden] = useState(false);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
    const userIconRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    // Fetch user info on component mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const mockUser = {
                    name: "Super Admin User",
                    username: "superadmin",
                    email: "superadmin@company.com",
                    role: "Super Admin"
                };
                setUserInfo(mockUser);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        let title = "";
        switch (activeTab) {
            case "home": title = "Welcome.."; break;
            case "system-settings": title = "System Configuration"; break;
            case "security-logs": title = "Security Monitoring"; break;
            case "database-management": title = "Database Management"; break;
            case "user-analytics": title = "User Analytics"; break;
            case "system-monitoring": title = "System Monitoring"; break;
            default: title = " Super Admin Dashboard";
        }
    }, [activeTab]);

    useEffect(() => {
        const handleExternalNav = (e: any) => {
            if (e.detail) {
                setActiveTab(e.detail);
            }
        };

        window.addEventListener('navigateSuperAdminTab', handleExternalNav);
        return () => {
            window.removeEventListener('navigateSuperAdminTab', handleExternalNav);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            const target = event.target as HTMLElement;

            const isInsideIcon = userIconRef.current && userIconRef.current.contains(target);
            const isInsidePopup = popupRef.current && popupRef.current.contains(target);

            if (showUserPopup && !isInsideIcon && !isInsidePopup) {
                setShowUserPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showUserPopup]);


    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <div className={`admin-container ${isPanelHidden ? 'panel-hidden' : ''}`}>
            <SuperAdminNavigationTabs
                active={activeTab}
                onChange={handleTabChange}
                onLogout={onLogout}
                user={userInfo}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isPanelHidden={isPanelHidden}
                onPanelToggle={setIsPanelHidden}
                isPanelCollapsed={isPanelCollapsed}
                onPanelCollapse={setIsPanelCollapsed}
            />
            <div className="content-panel sa-content">
                {/* Mobile Header */}
                <div style={{
                    display: window.innerWidth <= 1024 ? 'flex' : 'none',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#0f172a',
                    color: 'white',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}>
                    <button 
                        onClick={() => setIsMenuOpen(true)}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        <FiMenu size={24} />
                    </button>
                    <span style={{ fontWeight: 700 }}>CRAZYBEES</span>
                    <div style={{ width: 24 }}></div> {/* spacer */}
                </div>

                <div className="sa-wrapper">
                    <div className="sa-topbar">
                        <div className="sa-topbar-left">
                            <h1 className="sa-title">
                                {activeTab === "home" && "Welcome.."}
                                {activeTab === "system-settings" && "System Configuration"}
                                {activeTab === "security-logs" && "Security Monitoring"}
                                {activeTab === "database-management" && "Database Management"}
                                {activeTab === "user-analytics" && "User Analytics"}
                                {activeTab === "system-monitoring" && "System Monitoring"}
                            </h1>
                        </div>

                        {/* Global Search Bar */}
                        <div className="sa-search-container">
                            <SearchBar />
                        </div>

                        {/* User Icon */}
                        <div className="sa-user-container">
                            <div
                                ref={userIconRef}
                                className="sa-user-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowUserPopup(prev => !prev);
                                }}
                            >
                                <div className="sa-avatar">
                                    {userInfo?.name?.charAt(0) || "S"}
                                </div>
                            </div>

                            {/* USER POPUP */}
                            {showUserPopup && (
                                <div ref={popupRef} className="sa-user-popup">
                                    <div className="sa-popup-info">
                                        <div className="sa-popup-item">
                                            <span className="sa-label">User</span>
                                            <div className="sa-value">{userInfo?.name || "Super Admin"}</div>
                                        </div>
                                        <div className="sa-popup-item">
                                            <span className="sa-label">Email</span>
                                            <div className="sa-value">{userInfo?.email || "superadmin@company.com"}</div>
                                        </div>
                                        <div className="sa-popup-item">
                                            <span className="sa-label">Role</span>
                                            <div className="sa-value sa-role">{userInfo?.role || "Super Admin"}</div>
                                        </div>
                                    </div>
                                    <div className="sa-popup-footer">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onLogout();
                                            }} 
                                            className="sa-logout-btn"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <FiLogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="sa-main-card">
                        <div style={{ flex: 1 }}>
                            {activeTab === "home" && (
                                <div key="home" style={{ height: '100%' }}>
                                    <SuperAdminHomePage />
                                </div>
                            )}
                            {activeTab === "system-settings" && (
                                <div key="system-settings" style={{ height: '100%' }}>
                                    <SystemSettings />
                                </div>
                            )}
                            {activeTab === "security-logs" && (
                                <div key="security-logs" style={{ height: '100%' }}>
                                    <SecurityLogs />
                                </div>
                            )}
                            {activeTab === "database-management" && (
                                <div key="database-management" style={{ height: '100%' }}>
                                    <DatabaseManagement />
                                </div>
                            )}
                            {activeTab === "user-analytics" && (
                                <div key="user-analytics" style={{ height: '100%' }}>
                                    <UserAnalytics />
                                </div>
                            )}
                            {activeTab === "system-monitoring" && (
                                <div key="system-monitoring" style={{ height: '100%' }}>
                                    <SystemMonitoring />
                                </div>
                            )}
                            {!["home", "system-settings", "security-logs", "database-management", "user-analytics", "system-monitoring"].includes(activeTab) && (
                                <div key="invalid-tab" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                                    <h3>Please select a valid tab</h3>
                                    <p>Select an option from the navigation menu to view content</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}