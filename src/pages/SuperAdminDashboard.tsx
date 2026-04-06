import React, { useState, useEffect, useRef } from "react";
import SuperAdminNavigationTabs from "./SuperAdminNavigationTabs";
import SystemSettings from "./SystemSettings";
import SecurityLogs from "./SecurityLogs";
import DatabaseManagement from "./DatabaseManagement";
import UserAnalytics from "./UserAnalytics";
import SystemMonitoring from "./SystemMonitoring";
import SuperAdminHomePage from "./SuperAdminHomePage";
import SearchBar from "../components/SearchBar";
import "../Styles/AuthorNavigationTabs.css";

export default function SuperAdminDashboard({
    token,
    selectedModelId,
    onModelChange
}: {
    token: string | null;
    selectedModelId?: string | null;
    onModelChange?: (modelId: string | null) => void;
}) {
    const [activeTab, setActiveTab] = useState("home");
    const [userInfo, setUserInfo] = useState<{
        name: string;
        username: string;
        email: string;
        role: string;
    } | null>(null);
    const [showUserPopup, setShowUserPopup] = useState(false);
    const userIconRef = useRef<HTMLDivElement>(null);

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
        const handleClickOutside = (event: any) => {
            const target = event.target as HTMLElement;

            if (showUserPopup && userIconRef.current && !userIconRef.current.contains(target)) {
                setShowUserPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showUserPopup]);

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <div className="admin-container" style={{
            display: "flex",
            flexDirection: "row",
            height: "100vh",
            backgroundColor: "#f0f4f8",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            overflow: "hidden"
        }}>
            <SuperAdminNavigationTabs
                active={activeTab}
                onChange={handleTabChange}
                onLogout={handleLogout}
                user={userInfo}
                selectedModelId={selectedModelId}
                onModelChange={onModelChange}
            />
            <div
                className="content-panel"
                style={{
                    flex: 1,
                    padding: "24px",
                    backgroundColor: "#f8fafc",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    width: "100%",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                        padding: "16px 0",
                        borderBottom: "1px solid #e2e8f0"
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                color: "#1e293b",
                                margin: 0,
                                lineHeight: "1.3"
                            }}>
                                {activeTab === "home" && "Welcome.."}
                                {activeTab === "system-settings" && "System Configuration"}
                                {activeTab === "security-logs" && "Security Monitoring"}
                                {activeTab === "database-management" && "Database Management"}
                                {activeTab === "user-analytics" && "User Analytics"}
                                {activeTab === "system-monitoring" && "System Monitoring"}
                            </h1>
                            <p style={{
                                color: "#64748b",
                                margin: "8px 0 0 0",
                                fontSize: "16px"
                            }}>
                                {activeTab === "home" && "Welcome to the Super Admin Dashboard"}
                                {activeTab === "system-settings" && "Configure system-wide settings and parameters"}
                                {activeTab === "security-logs" && "Monitor and analyze security events"}
                                {activeTab === "database-management" && "Manage database operations and performance"}
                                {activeTab === "user-analytics" && "Analyze user activity and engagement"}
                                {activeTab === "system-monitoring" && "Monitor system performance and health"}
                            </p>
                        </div>

                        {/* Global Search Bar */}
                        <div style={{ flex: "1", maxWidth: "400px", margin: "0 24px" }}>
                            <SearchBar />
                        </div>

                        {/* User Icon */}
                        <div style={{ position: "relative", display: "inline-block", marginRight: "130px" }}>
                            <div
                                ref={userIconRef}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    background: "white",
                                    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowUserPopup(prev => !prev);
                                }}
                            >
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    background: "#3b82f6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: "bold",
                                    marginRight: "12px",
                                }}>
                                    {userInfo?.name?.charAt(0) || "S"}
                                </div>
                            </div>

                            {/* USER POPUP */}
                            {showUserPopup && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 8px)",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        zIndex: 1001,
                                        background: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        width: "280px",
                                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div style={{ marginBottom: "16px" }}>
                                        <div style={{ marginBottom: "10px" }}><strong style={{ color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>User</strong><div style={{ color: "#1e293b", fontWeight: "600", fontSize: "15px" }}>{userInfo?.name || "Super Admin"}</div></div>
                                        <div style={{ marginBottom: "10px" }}><strong style={{ color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</strong><div style={{ color: "#1e293b", fontSize: "14px" }}>{userInfo?.email || "superadmin@company.com"}</div></div>
                                        <div><strong style={{ color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</strong><div style={{ color: "#3b82f6", fontWeight: "600", fontSize: "14px" }}>{userInfo?.role || "Super Admin"}</div></div>
                                    </div>
                                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: "100%",
                                                padding: "10px",
                                                background: "#ef4444",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "600",
                                                fontSize: "14px",
                                                transition: "all 0.2s"
                                            }}
                                            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = "#dc2626"}
                                            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = "#ef4444"}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.005)",
                        padding: "24px",
                        border: "1px solid #e2e8f0",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column"
                    }}>
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