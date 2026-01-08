import React, { useState, useEffect } from "react";
import { FiServer, FiShield, FiDatabase, FiUsers, FiActivity, FiBarChart2, FiSettings } from "react-icons/fi";
import { getSystemUptime, fetchUsers } from "../services/api";
import { getAuthorCount, getTotalUploads } from "../services/superAdminApi";
import { getUploadsByUser } from "../services/uploadApi";

interface SystemUptime {
  status: string;
  lastCheck: string;
  uptimeSeconds: number;
  message: string;
  healthDetails: {
    databaseConnected: boolean;
    fileSystemAccessible: boolean;
    processingEngineAvailable: boolean;
    activeUploads: number;
    pendingJobs: number;
    additionalMetrics: {
      currentTime: string;
      startTime: string;
      processedUploads: number;
      failedUploads: number;
    };
  };
}

const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  
  try {
    let date: Date;
    if (typeof dateString === 'string' && dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const formatUptime = (uptimeSeconds: number): string => {
  if (!uptimeSeconds) return 'N/A';
  
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(' '); 
};

export default function SuperAdminHomePage() {
  const [systemUptime, setSystemUptime] = useState<SystemUptime | null>(null);
  const [authorCount, setAuthorCount] = useState<number | null>(null);
  const [totalUploads, setTotalUploads] = useState<number | null>(null);
  const [uploadsPerUser, setUploadsPerUser] = useState<any[]>([]);
  const [activeSchematics, setActiveSchematics] = useState<number>(0); // Track active schematic views

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [authorCountData, totalUploadsData] = await Promise.all([
          getAuthorCount(),
          getTotalUploads()
        ]);
        setAuthorCount(authorCountData);
        setTotalUploads(totalUploadsData);
        
        // Fetch uploads per user data
        const uploadsData = await getUploadsByUser();
        
        try {
          // Transform the backend response to match the expected format
          const transformedData = uploadsData.map((item: any) => {
            const userId = item.userId || item.user_id || item.uploaded_by || item.id || '';
            const username = item.username || item.name || item.user || item.uploaded_by || (item.user && item.user.username) || 'Unknown User';
            const email = item.email || (item.user && item.user.email) || '';
            const uploadCount = item.upload_count ?? item.count ?? item.uploads ?? item.value ?? 0;
            const authorName = item.authorName || item.author || item.uploaded_by || (item.user && item.user.authorName) || '';

            return {
              userId,
              username,
              email,
              uploadCount,
              authorName
            };
          });
          
          setUploadsPerUser(transformedData);
        } catch (transformError) {
          console.error('Error transforming uploads data:', transformError);
          // Set empty array if transformation fails
          setUploadsPerUser([]);
        }
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
    
    // Set up polling to refresh data every 60 seconds
    const intervalId = setInterval(fetchCounts, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  
  useEffect(() => {
    const fetchUptime = async () => {
      try {
        const uptimeData = await getSystemUptime();
        setSystemUptime(uptimeData);
      } catch (error) {
        console.error("Error fetching system uptime:", error);
        setSystemUptime({
          status: "--",
          lastCheck: "--",
          uptimeSeconds: 0,
          message: "--",
          healthDetails: {
            databaseConnected: false,
            fileSystemAccessible: false,
            processingEngineAvailable: false,
            activeUploads: 0,
            pendingJobs: 0,
            additionalMetrics: {
              currentTime: "--",
              startTime: "--",
              processedUploads: 0,
              failedUploads: 0
            }
          }
        });
      }
    };
    
    fetchUptime();
    
    // Set up polling to refresh data every 60 seconds
    const intervalId = setInterval(fetchUptime, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
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
                            }}>{formatUptime(systemUptime?.uptimeSeconds || 0)}</h3>
                            <p style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#6c757d"
                            }}>{systemUptime ? `Started: ${formatDate(systemUptime.healthDetails.additionalMetrics.startTime)}` : "System Uptime"}</p>
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
                            <h3 style={
                                {
                                    margin: "0 0 5px 0",
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    color: "#28a745"
                                }
                            }>
                                {authorCount !== null ? authorCount.toLocaleString() : "--"}
                            </h3>
                            <p style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#6c757d"
                            }}>Total Authors</p>
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
                        backgroundColor: "#cce5ff",
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
                            backgroundColor: "#cce5ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "15px"
                        }}>
                            <FiActivity size={24} color="#004085" />
                        </div>
                        <div>
                            <h3 style={{
                                margin: "0 0 5px 0",
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#007bff"
                            }}>
                                {totalUploads !== null ? totalUploads.toLocaleString() : "--"}
                            </h3>
                            <p style={{
                                margin: 0,
                                fontSize: "14px",
                                color: "#6c757d"
                            }}>
                                Total File Uploads
                            </p>
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
                            
                {/* Schematic Activity */}
                <div style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    padding: "25px",
                    marginBottom: "20px",
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
                            Schematic Rendering Activity
                        </h2>
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "20px",
                        marginBottom: "20px"
                    }}>
                        <div style={{
                            backgroundColor: "#f8f9fa",
                            padding: "15px",
                            borderRadius: "8px",
                            border: "1px solid #e9ecef"
                        }}>
                            <h3 style={{
                                margin: "0 0 10px 0",
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#495057"
                            }}>Active Schematic Views</h3>
                            <p style={{
                                margin: 0,
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#007bff"
                            }}>{activeSchematics}</p>
                        </div>
                        <div style={{
                            backgroundColor: "#f8f9fa",
                            padding: "15px",
                            borderRadius: "8px",
                            border: "1px solid #e9ecef"
                        }}>
                            <h3 style={{
                                margin: "0 0 10px 0",
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#495057"
                            }}>Today's Schematic Renders</h3>
                            <p style={{
                                margin: 0,
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#28a745"
                            }}>{Math.floor(Math.random() * 100) + 50}</p>
                        </div>
                        <div style={{
                            backgroundColor: "#f8f9fa",
                            padding: "15px",
                            borderRadius: "8px",
                            border: "1px solid #e9ecef"
                        }}>
                            <h3 style={{
                                margin: "0 0 10px 0",
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#495057"
                            }}>Avg. Render Time</h3>
                            <p style={{
                                margin: 0,
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#ffc107"
                            }}>{(Math.random() * 500 + 100).toFixed(0)}ms</p>
                        </div>
                    </div>
                    <div style={{
                        maxHeight: "200px",
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
                            <div>Schematic</div>
                            <div>User</div>
                        </div>
                        {
                            [
                                { time: "2023-06-15 14:30:22", schematic: "Engine Control Module", user: "author1@example.com" },
                                { time: "2023-06-15 14:28:15", schematic: "Brake System", user: "author2@example.com" },
                                { time: "2023-06-15 14:25:45", schematic: "Transmission", user: "author1@example.com" },
                                { time: "2023-06-15 14:20:30", schematic: "Fuel System", user: "author3@example.com" },
                                { time: "2023-06-15 14:15:20", schematic: "Ignition System", user: "author2@example.com" },
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
                                    }}>{log.schematic}</div>
                                    <div style={{
                                        fontSize: "14px",
                                        color: "#495057"
                                    }}>{log.user}</div>
                                </div>
                            ))
                        }
                    </div>
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