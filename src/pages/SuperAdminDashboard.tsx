import React, { useState, useEffect, useRef } from "react";
import SuperAdminNavigationTabs from "./SuperAdminNavigationTabs";
import SystemSettings from "./SystemSettings";
import SecurityLogs from "./SecurityLogs";
import DatabaseManagement from "./DatabaseManagement";
import UserAnalytics from "./UserAnalytics";
import SystemMonitoring from "./SystemMonitoring";
import SuperAdminHomePage from "./SuperAdminHomePage";
import "../Styles/AdminNavigationTabs.css";

export default function SuperAdminDashboard({ token }: { token: string | null }) {
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
        switch(activeTab) {
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
        
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showUserPopup]);
    
    const handleLogout = () => {
        console.log("Super Admin logout clicked");
        sessionStorage.clear();
        window.location.href = "/login";
    };
    
    const handleTabChange = (tabId: string) => {
        //console.log("Tab clicked:", tabId);
        setActiveTab(tabId);
        //console.log("Active tab updated to:", tabId);
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
                        
                        {/* User Icon */}
                        <div style={{ position: "relative", display: "inline-block" }}>
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
                                        top: "100%",  
                                        left: "auto",
                                        right: "0",  
                                        zIndex: 1000,
                                        background: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        padding: "16px",
                                        width: "260px",
                                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                                        marginTop: "8px", 
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div style={{ marginBottom: "12px" }}>
                                        <div style={{ marginBottom: "8px" }}><strong style={{ color: "#64748b" }}>Name:</strong> <span style={{ color: "#1e293b" }}>{userInfo?.name || "Super Admin"}</span></div>
                                        <div style={{ marginBottom: "8px" }}><strong style={{ color: "#64748b" }}>Email:</strong> <span style={{ color: "#1e293b" }}>{userInfo?.email || "superadmin@company.com"}</span></div>
                                        <div><strong style={{ color: "#64748b" }}>Role:</strong> <span style={{ color: "#1e293b" }}>{userInfo?.role || "Super Admin"}</span></div>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            background: "#ef4444",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "500",
                                            fontSize: "14px",
                                            transition: "background 0.2s"
                                        }}
                                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = "#dc2626"}
                                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = "#ef4444"}
                                    >
                                        <span style={{ marginRight: "8px" }}></span> Logout
                                    </button>
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