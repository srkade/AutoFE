import React, { useState, useEffect } from "react";
import { FiShield, FiSearch, FiFilter, FiDownload, FiActivity, FiUser, FiClock, FiMapPin, FiCpu } from "react-icons/fi";
import { getRecentActivity } from "../services/superAdminApi";

interface UserActivity {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export default function SecurityLogs() {
  const [logs, setLogs] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getRecentActivity(100);
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch security logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    if (filteredLogs.length === 0) return;
    
    // Create CSV content
    const headers = ["Timestamp", "Target User (Email)", "User ID", "Action Performed", "IP Address", "User Agent"];
    const rows = filteredLogs.map(log => [
      new Date(log.createdAt).toLocaleString(),
      log.userEmail || "System",
      log.userId || "N/A",
      log.action,
      log.ipAddress,
      log.userAgent.replace(/,/g, ';') // Escape commas in user agent
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `security_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '0 10px', animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .log-table { width: 100%; border-collapse: separate; border-spacing: 0; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
        .log-table th { background: #f8fafc; padding: 16px; text-align: left; font-size: 14px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
        .log-table td { padding: 16px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
        .log-row:hover { background: #f8fafc; }
        .action-badge { padding: 4px 10px; borderRadius: 4px; fontSize: 12px; fontWeight: 600; }
        .search-input { width: 100%; padding: 12px 16px 12px 42px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>Security & Audit Logs</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Review all system actions and access logs across the environment.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={fetchLogs} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}>
            <FiActivity size={18} /> Refresh
          </button>
          <button 
            onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}
          >
            <FiDownload size={18} /> Export Data
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Filter logs by action, IP, or user ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="log-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Target User</th>
              <th>Action Performed</th>
              <th>IP Address</th>
              <th>Platform / User Agent</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>Loading secure activities...</td></tr>
            ) : filteredLogs.map((log) => (
              <tr key={log.id} className="log-row">
                <td style={{ color: '#64748b', fontWeight: '500' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiClock size={16} /> {new Date(log.createdAt).toLocaleString()}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiUser size={16} /> {log.userEmail || log.userId || "System"}
                  </div>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    fontWeight: '700',
                    background: log.action.includes('ERROR') || log.action.includes('FAILED') ? '#fee2e2' : '#dcfce7',
                    color: log.action.includes('ERROR') || log.action.includes('FAILED') ? '#991b1b' : '#166534'
                  }}>
                    {log.action}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontFamily: 'monospace' }}>
                    <FiMapPin size={16} /> {log.ipAddress}
                  </div>
                </td>
                <td style={{ maxWidth: '300px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '12px', color: '#94a3b8' }}>
                  <FiCpu size={14} style={{ marginRight: '6px' }} /> {log.userAgent}
                </td>
              </tr>
            ))}
            {!loading && filteredLogs.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>No logs matching your search criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}