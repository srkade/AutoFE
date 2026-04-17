import React, { useState, useEffect } from "react";
import { FiServer, FiShield, FiDatabase, FiUsers, FiActivity, FiBarChart2, FiSettings, FiCheckCircle, FiAlertCircle, FiInfo, FiZap } from "react-icons/fi";
import { getSystemUptime, fetchUsers } from "../services/api";
import { 
  getAuthorCount, 
  getTotalUploads, 
  getRecentActivity, 
  getActivityDistribution 
} from "../services/superAdminApi";
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

interface UserActivity {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString();
  } catch (error) {
    return dateString;
  }
};

const formatUptime = (uptimeSeconds: number): string => {
  if (!uptimeSeconds) return '0s';
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' '); 
};

export default function SuperAdminHomePage() {
  const [systemUptime, setSystemUptime] = useState<SystemUptime | null>(null);
  const [authorCount, setAuthorCount] = useState<number | null>(null);
  const [totalUploads, setTotalUploads] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [activityStats, setActivityStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uptime, authCount, uploads, recent, distribution] = await Promise.all([
        getSystemUptime(),
        getAuthorCount(),
        getTotalUploads(),
        getRecentActivity(10),
        getActivityDistribution()
      ]);

      setSystemUptime(uptime);
      setAuthorCount(authCount);
      setTotalUploads(uploads);
      setRecentActivities(recent);
      setActivityStats(distribution);
    } catch (error) {
      console.error("Dashboard primary fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Polling every minute
    return () => clearInterval(interval);
  }, []);

  const failedUploads = systemUptime?.healthDetails?.additionalMetrics?.failedUploads || 0;
  
  let systemAlertsCount = 0;
  if (systemUptime?.healthDetails) {
    if (!systemUptime.healthDetails.databaseConnected) systemAlertsCount++;
    if (!systemUptime.healthDetails.fileSystemAccessible) systemAlertsCount++;
    if (!systemUptime.healthDetails.processingEngineAvailable) systemAlertsCount++;
  }
  systemAlertsCount += failedUploads;

  const dbStatus = systemUptime?.healthDetails?.databaseConnected ? "Healthy" : "Unreachable";

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08); }
        .action-card {
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .action-card:hover { background: #f1f5f9; border-color: #3b82f6; }
      `}</style>

      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", margin: "0 0 8px 0" }}>
          Super Admin Dashboard
        </h1>
        <p style={{ fontSize: "16px", color: "#64748b", margin: 0 }}>
          Welcome back! Here's an overview of real-time system performance and activities.
        </p>
      </div>
      
      {/* Quick Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiServer size={24} color="#0369a1" />
            </div>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: "700", color: "#1e293b" }}>
                {formatUptime(systemUptime?.uptimeSeconds || 0)}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>System Uptime</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: systemAlertsCount > 0 ? "#fee2e2" : "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiShield size={24} color={systemAlertsCount > 0 ? "#991b1b" : "#166534"} />
            </div>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: "700", color: systemAlertsCount > 0 ? "#dc2626" : "#16a34a" }}>
                {systemAlertsCount}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>System Alerts</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiUsers size={24} color="#166534" />
            </div>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: "700", color: "#16a34a" }}>
                {authorCount !== null ? authorCount.toLocaleString() : "--"}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Total Authors</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiActivity size={24} color="#92400e" />
            </div>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: "700", color: "#d97706" }}>
                {totalUploads !== null ? totalUploads.toLocaleString() : "--"}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Total Uploads</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Tables Group */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        {/* Recent Activity Table */}
        <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", overflowX: 'hidden' }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
            Recent System Activity
          </h2>
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {recentActivities.map((log, index) => (
              <div key={index} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                    {log.action} <span style={{ fontWeight: '400', fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>by {log.userEmail || log.userId || "System"}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>{formatDate(log.createdAt)}</div>
                </div>
                <div style={{ fontSize: "12px", background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", color: "#475569", fontFamily: "monospace" }}>
                  {log.ipAddress}
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>No recent activity records.</p>}
          </div>
        </div>

        {/* Action Type Distribution */}
        <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
            Feature Usage Statistics
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(activityStats).sort((a: any, b: any) => b[1] - a[1]).slice(0, 6).map(([action, count]: [string, any]) => (
              <div key={action}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#475569" }}>{action}</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>{count}</span>
                </div>
                <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min((count / 100) * 100, 100)}%`, background: "#3b82f6", borderRadius: "4px" }} />
                </div>
              </div>
            ))}
            {Object.keys(activityStats).length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>No usage stats available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}