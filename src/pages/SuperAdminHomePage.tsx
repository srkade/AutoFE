import React from "react";
import { FiServer, FiShield, FiDatabase, FiUsers, FiActivity, FiBarChart2, FiSettings } from "react-icons/fi";

export default function SuperAdminHomePage() {
    return (
        <div>
            <div style={{
                marginBottom: "30px"
            }}>
                <h1 style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#212529",
                    margin: "0 0 10px 0"
                }}>
                    Super Admin Dashboard
                </h1>
                <p style={{
                    fontSize: "16px",
                    color: "#6c757d",
                    margin: 0
                }}>
                    Welcome back! Here's an overview of system performance and activities.
                </p>
            </div>
            
            {/* Quick Stats */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                marginBottom: "30px"
            }}>
                <div style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#d1ecf1",
                        borderRadius: "0 0 0 60px",
                        opacity: 0.3
                    }}></div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 1
                    }}>
                        <div style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            backgroundColor: "#d1ecf1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "15px"
                        }}>
                            <FiServer size={24} color="#0c5460" />
                        </div>
                        <div>
                            <h3 style={{
                                margin: "0 0 5px 0",
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#007bff"
                            }}>99.98%</h3>
                            <p style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#6c757d"
                            }}>Schematic Engine Uptime</p>
                        </div>
                    </div>
                </div>
                
                <div style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#f8d7da",
                        borderRadius: "0 0 0 60px",
                        opacity: 0.3
                    }}></div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 1
                    }}>
                        <div style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            backgroundColor: "#f8d7da",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "15px"
                        }}>
                            <FiShield size={24} color="#721c24" />
                        </div>
                        <div>
                            <h3 style={{
                                margin: "0 0 5px 0",
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#dc3545"
                            }}>0</h3>
                            <p style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#6c757d"
                            }}>Active Alerts</p>
                        </div>
                    </div>
                </div>
                
                <div style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#d4edda",
                        borderRadius: "0 0 0 60px",
                        opacity: 0.3
                    }}></div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 1
                    }}>
                        <div style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            backgroundColor: "#d4edda",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "15px"
                        }}>
                            <FiUsers size={24} color="#155724" />
                        </div>
                        <div>
                            <h3 style={{
                                margin: "0 0 5px 0",
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#28a745"
                            }}>1,245</h3>
                            <p style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#6c757d"
                            }}>Total Users</p>
                        </div>
                    </div>
                </div>
                
                <div style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#fff3cd",
                        borderRadius: "0 0 0 60px",
                        opacity: 0.3
                    }}></div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        zIndex: 1
                    }}>
                        <div style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            backgroundColor: "#fff3cd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "15px"
                        }}>
                            <FiDatabase size={24} color="#856404" />
                        </div>
                        <div>
                            <h3 style={{
                                margin: "0 0 5px 0",
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#ffc107"
                            }}>2.4 GB</h3>
                            <p style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#6c757d"
                            }}>Database Size</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Quick Actions */}
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
                padding: "25px",
                marginBottom: "30px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
                <h2 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#212529",
                    marginBottom: "20px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #e9ecef"
                }}>
                    Quick Actions
                </h2>
                
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px"
                }}>
                    <div 
                        style={{
                            padding: "20px",
                            border: "1px solid #e9ecef",
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "15px"
                        }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                backgroundColor: "#e7f1ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "15px"
                            }}>
                                <FiSettings size={20} color="#004085" />
                            </div>
                            <h3 style={{
                                margin: 0,
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#212529"
                            }}>System Settings</h3>
                        </div>
                        <p style={{
                            margin: 0,
                            color: "#6c757d",
                            fontSize: "14px",
                            lineHeight: "1.5"
                        }}>
                            Configure system-wide settings and parameters for the application.
                        </p>
                    </div>
                    
                    <div 
                        style={{
                            padding: "20px",
                            border: "1px solid #e9ecef",
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "15px"
                        }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                backgroundColor: "#fff3cd",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "15px"
                            }}>
                                <FiShield size={20} color="#856404" />
                            </div>
                            <h3 style={{
                                margin: 0,
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#212529"
                            }}>Security Logs</h3>
                        </div>
                        <p style={{
                            margin: 0,
                            color: "#6c757d",
                            fontSize: "14px",
                            lineHeight: "1.5"
                        }}>
                            Monitor and analyze security events across the system.
                        </p>
                    </div>
                    
                    <div 
                        style={{
                            padding: "20px",
                            border: "1px solid #e9ecef",
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "15px"
                        }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                backgroundColor: "#d1ecf1",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "15px"
                            }}>
                                <FiDatabase size={20} color="#0c5460" />
                            </div>
                            <h3 style={{
                                margin: 0,
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#212529"
                            }}>Database Management</h3>
                        </div>
                        <p style={{
                            margin: 0,
                            color: "#6c757d",
                            fontSize: "14px",
                            lineHeight: "1.5"
                        }}>
                            Manage database operations and performance optimization.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Recent Activity */}
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
                padding: "25px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}>
                    <h2 style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#212529",
                        margin: 0,
                        paddingBottom: "10px",
                        borderBottom: "1px solid #e9ecef"
                    }}>
                        Recent System Activity
                    </h2>
                </div>
                
                <div style={{
                    maxHeight: "300px",
                    overflowY: "auto"
                }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "150px 1fr 1fr",
                        backgroundColor: "#f8f9fa",
                        padding: "10px 15px",
                        fontWeight: "600",
                        borderBottom: "1px solid #e9ecef",
                        color: "#495057"
                    }}>
                        <div>Timestamp</div>
                        <div>Event</div>
                        <div>Status</div>
                    </div>
                    
                    {[
                        { time: "2023-06-15 14:30:22", event: "System backup completed successfully", status: "Success" },
                        { time: "2023-06-15 12:15:45", event: "Database optimization completed", status: "Success" },
                        { time: "2023-06-15 10:45:30", event: "Security scan initiated", status: "Running" },
                        { time: "2023-06-15 09:20:15", event: "User login activity spike detected", status: "Warning" },
                        { time: "2023-06-15 08:05:10", event: "System maintenance window started", status: "Info" },
                        { time: "2023-06-15 07:30:05", event: "Daily health check completed", status: "Success" },
                        { time: "2023-06-15 06:00:00", event: "Scheduled system update applied", status: "Success" },
                    ].map((log, index) => (
                        <div 
                            key={index}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "150px 1fr 1fr",
                                padding: "12px 15px",
                                borderBottom: "1px solid #e9ecef",
                                alignItems: "center",
                                transition: "background-color 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "#f8f9fa";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                            }}
                        >
                            <div style={{
                                fontSize: "14px",
                                color: "#495057"
                            }}>{log.time}</div>
                            <div style={{
                                fontSize: "14px",
                                color: "#495057"
                            }}>{log.event}</div>
                            <div>
                                <span 
                                    style={{
                                        padding: "5px 10px",
                                        borderRadius: "12px",
                                        background: 
                                            log.status === "Success" ? "#d4edda" : 
                                            log.status === "Warning" ? "#fff3cd" : 
                                            log.status === "Info" ? "#cce5ff" : 
                                            "#f8d7da",
                                        color: 
                                            log.status === "Success" ? "#155724" : 
                                            log.status === "Warning" ? "#856404" : 
                                            log.status === "Info" ? "#004085" : 
                                            "#721c24",
                                        fontSize: "12px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {log.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}