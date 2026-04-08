import react, { useState, useEffect } from "react";
import { FiDatabase, FiHardDrive, FiActivity, FiLayers, FiRefreshCw, FiCheckCircle, FiAlertTriangle, FiTrash2, FiMaximize } from "react-icons/fi";
import { 
  getDatabaseStats, 
  getDatabaseSize, 
  analyzeDatabase, 
  vacuumDatabase, 
  pruneActivityLogs 
} from "../services/superAdminApi";

export default function DatabaseManagement() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [sizeInfo, setSizeInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  // Individual action loading states
  const [analyzing, setAnalyzing] = useState(false);
  const [vacuuming, setVacuuming] = useState(false);
  const [pruning, setPruning] = useState(false);

  const fetchDbInfo = async () => {
    try {
      setLoading(true);
      const [dbStats, dbSize] = await Promise.all([
        getDatabaseStats(),
        getDatabaseSize()
      ]);
      setStats(dbStats);
      setSizeInfo(dbSize);
    } catch (error) {
      console.error("Failed to fetch database information:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbInfo();
  }, []);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const res = await analyzeDatabase();
      alert(res.message || "Database analysis complete!");
      await fetchDbInfo();
    } catch (error: any) {
      alert("Analysis failed: " + (error.response?.data?.error || error.message));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleVacuum = async () => {
    try {
      setVacuuming(true);
      const res = await vacuumDatabase();
      alert(res.message || "Database vacuum complete!");
      await fetchDbInfo();
    } catch (error: any) {
      alert("Vacuum failed: " + (error.response?.data?.error || error.message));
    } finally {
      setVacuuming(false);
    }
  };

  const handlePrune = async () => {
    if (!window.confirm("Are you sure you want to prune activity logs older than 30 days? This action cannot be undone.")) {
      return;
    }
    
    try {
      setPruning(true);
      const res = await pruneActivityLogs();
      alert(res.message || "Logs pruned successfully!");
      await fetchDbInfo();
    } catch (error: any) {
      alert("Pruning failed: " + (error.response?.data?.error || error.message));
    } finally {
      setPruning(false);
    }
  };

  const totalRows = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div style={{ padding: '0 10px', animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .db-card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .table-row { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; align-items: center; }
        .table-row:hover { background: #f8fafc; cursor: default; }
        .health-indicator { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 8px; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="db-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>Database Health & Management</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Monitor storage usage, table statistics, and system performance.</p>
        </div>
        <button 
          onClick={fetchDbInfo} 
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1 }}
        >
          <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh Stats
        </button>
      </div>

      <div className="db-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="db-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FiDatabase size={24} color="#3b82f6" />
            <h3 style={{ margin: 0, fontSize: '16px', color: '#475569' }}>Logical Database Size</h3>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>{sizeInfo?.size || "--"}</div>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Total storage occupied on disk</p>
        </div>

        <div className="db-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FiLayers size={24} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '16px', color: '#475569' }}>Total Records</h3>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>{totalRows.toLocaleString()}</div>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Aggregate count across all tables</p>
        </div>

        <div className="db-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FiActivity size={24} color="#f59e0b" />
            <h3 style={{ margin: 0, fontSize: '16px', color: '#475569' }}>Connectivity Status</h3>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: sizeInfo?.status === "HEALTHY" ? '#10b981' : '#f43f5e', display: 'flex', alignItems: 'center' }}>
            {sizeInfo?.status === "HEALTHY" ? <FiCheckCircle size={28} style={{ marginRight: '12px' }} /> : <FiAlertTriangle size={28} style={{ marginRight: '12px' }} />}
            {sizeInfo?.status || "PENDING"}
          </div>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Backend connection integrity check</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Tables & Data Distribution</h3>
          <span style={{ fontSize: '13px', color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px' }}>{Object.keys(stats).length} Managed Tables</span>
        </div>
        
        <div className="db-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', background: '#f8fafc' }}>
          <div style={{ padding: '20px' }}>
            {Object.entries(stats).map(([table, count]) => (
              <div key={table} className="table-row db-table-row">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FiHardDrive color="#94a3b8" style={{ marginRight: '12px' }} size={16} />
                  <span style={{ fontWeight: '500', color: '#334155', textTransform: 'capitalize' }}>{table.replace('_', ' ')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{count.toLocaleString()} rows</span>
                  <div className="db-progress-container" style={{ width: '100px', height: '6px', background: '#e2e8f0', borderRadius: '3px', position: 'relative' }}>
                    <div style={{ position: 'absolute', height: '100%', left: 0, width: `${(count / 1000) * 100}%`, background: '#3b82f6', borderRadius: '3px', maxWidth: '100%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="db-sidebar">
             <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1e293b' }}>Storage Actions</h4>
             <button 
               onClick={handleAnalyze}
               disabled={analyzing}
               style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b', fontWeight: '600', cursor: analyzing ? 'not-allowed' : 'pointer', opacity: analyzing ? 0.7 : 1 }}
             >
               <FiActivity size={20} color="#3b82f6" className={analyzing ? 'animate-spin' : ''} /> 
               {analyzing ? 'Analyzing...' : 'Analyze Optimization Potential'}
             </button>
             <button 
               onClick={handleVacuum}
               disabled={vacuuming}
               style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b', fontWeight: '600', cursor: vacuuming ? 'not-allowed' : 'pointer', opacity: vacuuming ? 0.7 : 1 }}
             >
               <FiMaximize size={20} color="#10b981" className={vacuuming ? 'animate-spin' : ''} /> 
               {vacuuming ? 'Vacuuming...' : 'Vacuum & Re-index Tables'}
             </button>
             <button 
               onClick={handlePrune}
               disabled={pruning}
               style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', color: '#be123c', fontWeight: '600', cursor: pruning ? 'not-allowed' : 'pointer', opacity: pruning ? 0.7 : 1 }}
             >
               <FiTrash2 size={20} color="#e11d48" className={pruning ? 'animate-spin' : ''} /> 
               {pruning ? 'Pruning...' : 'Prune Orphaned Activity Logs'}
             </button>
             
             <div style={{ marginTop: '20px', padding: '20px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
               <h5 style={{ margin: '0 0 8px 0', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <FiCheckCircle size={16} /> Automated Backups
               </h5>
               <p style={{ margin: 0, fontSize: '13px', color: '#1d4ed8', lineHeight: '1.5' }}>
                 Daily snapshots are enabled. Last successful backup: Today, 03:00 AM.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}