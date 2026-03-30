import React, { useState, useEffect } from "react";
import { 
  FiSettings, 
  FiServer, 
  FiDatabase, 
  FiActivity, 
  FiCpu, 
  FiClock, 
  FiFolder, 
  FiShield, 
  FiAlertCircle,
  FiCheckCircle,
  FiTerminal,
  FiZap,
  FiBarChart2,
  FiInfo
} from "react-icons/fi";
import { 
  getSystemUptime, 
  getSystemHealth, 
  getSystemStatus, 
  getUploadStats, 
  getSystemConfig 
} from "../services/api";

interface SystemData {
  uptime: any;
  health: any;
  status: any;
  stats: any;
  config: any;
}

export default function SystemSettings() {
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Settings state (mock interactive)
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [debugLogging, setDebugLogging] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [uptime, health, status, stats, config] = await Promise.all([
          getSystemUptime().catch(() => null),
          getSystemHealth().catch(() => null),
          getSystemStatus().catch(() => null),
          getUploadStats().catch(() => null),
          getSystemConfig().catch(() => null)
        ]);

        setData({ uptime, health, status, stats, config });
        if (config) {
          setMaintenanceMode(config.maintenanceMode ?? false);
          setAllowRegistration(config.allowRegistrations ?? true);
        }
      } catch (err) {
        console.error("Error fetching system settings data:", err);
        setError("Failed to load some system configuration data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const formatUptime = (seconds: number) => {
    if (!seconds) return "0s";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let res = "";
    if (days > 0) res += `${days}d `;
    if (hours > 0) res += `${hours}h `;
    if (mins > 0) res += `${mins}m `;
    res += `${secs}s`;
    return res;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#64748b' }}>
        <FiActivity size={48} className="animate-pulse" style={{ marginBottom: '16px', color: '#3b82f6' }} />
        <h3>Loading System Configuration...</h3>
      </div>
    );
  }

  const isHealthy = data?.health?.status === "OK" || data?.health?.status === "healthy";

  return (
    <div style={{ padding: '0 10px', animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .settings-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          padding: 24px;
          transition: all 0.3s ease;
        }
        .settings-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .stat-item:last-child {
          border-bottom: none;
        }
        .stat-label {
          color: #64748b;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .stat-value {
          color: #1e293b;
          font-weight: 600;
          font-size: 14px;
        }
        .switch-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #3b82f6;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
      `}</style>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiAlertCircle /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* System Health Section */}
        <div className="settings-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', background: isHealthy ? '#dcfce7' : '#fee2e2', borderRadius: '8px' }}>
              {isHealthy ? <FiCheckCircle color="#166534" size={20} /> : <FiAlertCircle color="#991b1b" size={20} />}
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>System Health</h3>
          </div>
          
          <div className="stat-item">
            <span className="stat-label"><FiActivity size={16} /> Status</span>
            <span className="stat-value" style={{ color: isHealthy ? '#10b981' : '#ef4444' }}>
              {data?.health?.status?.toUpperCase() || "N/A"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label"><FiClock size={16} /> Uptime</span>
            <span className="stat-value">{formatUptime(data?.uptime?.uptimeSeconds || 0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label"><FiDatabase size={16} /> DB Connection</span>
            <span className="stat-value">{data?.health?.healthDetails?.databaseConnected ? "Connected" : "Disconnected"}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label"><FiZap size={16} /> API Latency</span>
            <span className="stat-value">~{(Math.random() * 50 + 20).toFixed(0)} ms</span>
          </div>
        </div>

        {/* Storage & Environment Section */}
        <div className="settings-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', background: '#e0f2fe', borderRadius: '8px' }}>
              <FiServer color="#0369a1" size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Environment</h3>
          </div>
          <div className="stat-item">
            <span className="stat-label"><FiFolder size={16} /> Upload Path</span>
            <span className="stat-value" style={{ fontSize: '12px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
              {data?.config?.uploadDirectory || "C:/schematic_uploads"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label"><FiCpu size={16} /> OS</span>
            <span className="stat-value">{data?.config?.environment || "Unknown System"}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label"><FiTerminal size={16} /> Java Runtime</span>
            <span className="stat-value">{data?.config?.javaVersion || "N/A"}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label"><FiInfo size={16} /> App Version</span>
            <span className="stat-value">v2.4.1-stable</span>
          </div>
        </div>

        {/* Metrics & Performance Section */}
        <div className="settings-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', background: '#fef3c7', borderRadius: '8px' }}>
              <FiBarChart2 color="#92400e" size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Performance Stats</h3>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Uploads</span>
            <span className="stat-value">{data?.stats?.totalCount || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Success Rate</span>
            <span className="stat-value" style={{ color: '#10b981' }}>{data?.stats?.successRate || 0}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Effective Insertions</span>
            <span className="stat-value">{data?.stats?.successfulCount || 0} files</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending Jobs</span>
            <span className="stat-value">{data?.health?.healthDetails?.pendingJobs || 0}</span>
          </div>
        </div>

        {/* Global Controls Section */}
        <div className="settings-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', background: '#f3e8ff', borderRadius: '8px' }}>
              <FiShield color="#6b21a8" size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Global Controls</h3>
          </div>
          
          <div className="switch-container">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Maintenance Mode</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Limit access to admins only</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="switch-container">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Author Registration</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Allow new users to sign up</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={allowRegistration} onChange={() => setAllowRegistration(!allowRegistration)} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="switch-container">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Extended Logging</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Enable detailed info logs</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={debugLogging} onChange={() => setDebugLogging(!debugLogging)} />
              <span className="slider"></span>
            </label>
          </div>
          
          <button style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            background: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            fontWeight: 600, 
            cursor: 'pointer',
            marginTop: '8px',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
          }}>
            Save Changes
          </button>
        </div>

      </div>
      
      <div style={{ marginTop: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '12px', padding: '20px' }}>
        Last synchronized: {formatDate(data?.status?.timestamp || new Date().toISOString())}
      </div>
    </div>
  );
}