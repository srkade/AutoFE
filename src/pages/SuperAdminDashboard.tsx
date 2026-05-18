import React, { useState, useEffect, useRef } from "react";
import SuperAdminNavigationTabs from "./SuperAdminNavigationTabs";
import SystemSettings from "./SystemSettings";
import SecurityLogs from "./SecurityLogs";
import DatabaseManagement from "./DatabaseManagement";
import UserAnalytics from "./UserAnalytics";
import SystemMonitoring from "./SystemMonitoring";
import SuperAdminHomePage from "./SuperAdminHomePage";
import CompanyManagement from "./CompanyManagement";
import SuperAdminSchematicViewer from "./SuperAdminSchematicViewer";
import SuperAdminDeletedItems from "./SuperAdminDeletedItems";
import SuperAdminAuditLogs from "./SuperAdminAuditLogs";
import VideoManagement from "./VideoManagement";
import { FiLogOut, FiMenu, FiPlay } from "react-icons/fi";
import "../Styles/AuthorNavigationTabs.css";

export default function SuperAdminDashboard({
    token,
    onLogout,
    onShowDemo
}: {
    token: string | null;
    onLogout: () => void;
    onShowDemo?: () => void;
}) {
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
            case "company-management": title = "Company Management"; break;
            case "schematic-viewer": title = "Schematic Viewer"; break;
            case "deleted-items": title = "Deleted Items Tracking"; break;
            case "audit-logs": title = "System Audit Logs"; break;
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
                <div className="sa-mobile-header">
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
                                {activeTab === "schematic-viewer" && "Schematic Viewer"}
                                {activeTab === "deleted-items" && "Deleted Items Tracking"}
                                {activeTab === "audit-logs" && "System Audit Logs"}
                                {activeTab === "demo-videos" && "Demo Video Management"}
                            </h1>
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
                                    <div style={{ padding: '0 16px', marginBottom: '12px' }}>
                                        {onShowDemo && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onShowDemo();
                                                    setShowUserPopup(false);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    background: 'rgba(59, 130, 246, 0.1)',
                                                    color: '#3b82f6',
                                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '13px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#3b82f6';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                                    e.currentTarget.style.color = '#3b82f6';
                                                }}
                                            >
                                                <FiPlay size={14} /> Watch Demo
                                            </button>
                                        )}
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
                            {activeTab === "company-management" && (
                                <div key="company-management" style={{ height: '100%' }}>
                                    <CompanyManagement token={token} />
                                </div>
                            )}
                            {activeTab === "schematic-viewer" && (
                                <div key="schematic-viewer" style={{ height: '100%' }}>
                                    <SuperAdminSchematicViewer user={userInfo} onLogout={onLogout} />
                                </div>
                            )}
                            {activeTab === "deleted-items" && (
                                <div key="deleted-items" style={{ height: '100%' }}>
                                    <SuperAdminDeletedItems token={token} />
                                </div>
                            )}
                            {activeTab === "audit-logs" && (
                                <div key="audit-logs" style={{ height: '100%' }}>
                                    <SuperAdminAuditLogs token={token} />
                                </div>
                            )}
                            {activeTab === "demo-videos" && (
                                <div key="demo-videos" style={{ height: '100%' }}>
                                    <VideoManagement />
                                </div>
                            )}
                            {!["home", "system-settings", "security-logs", "database-management", "user-analytics", "system-monitoring", "company-management", "schematic-viewer", "deleted-items", "audit-logs", "demo-videos"].includes(activeTab) && (
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