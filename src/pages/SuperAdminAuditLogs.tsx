import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiList, 
  FiSearch, 
  FiFileText, 
  FiFilter, 
  FiUser, 
  FiClock, 
  FiDatabase,
  FiX,
  FiEye,
  FiBox,
  FiLayers,
  FiCpu,
  FiAlertCircle
} from 'react-icons/fi';
import '../Styles/SuperAdminTracking.css';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const SuperAdminAuditLogs = ({ token }: { token: string | null }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const fetchLogs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const url = typeFilter === 'ALL' 
        ? `${API_BASE_URL}/audit-logs` 
        : `${API_BASE_URL}/audit-logs/entity/${typeFilter}`;
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLogs();
  }, [typeFilter, token]);

  const filteredLogs = logs.filter(log => 
    log.entityId.toLowerCase().includes(filter.toLowerCase()) ||
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.entityType.toLowerCase().includes(filter.toLowerCase())
  );

  const getEntityIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'COMPANY': return <FiBox size={16} />;
      case 'MODEL': return <FiLayers size={16} />;
      case 'USER': return <FiUser size={16} />;
      default: return <FiCpu size={16} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'DELETE': return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30';
      case 'RESTORE': return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'CREATE': return 'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30';
      case 'UPDATE': return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30';
      default: return 'text-slate-600 bg-slate-50 border-slate-100 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-900/30';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fadeIn relative font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <FiList size={24} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              System Audit Logs
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium ml-12">
            Monitor all critical system actions and historical data changes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs by ID or action..."
              className="pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm w-72 text-sm font-medium"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 shadow-sm">
            <FiFilter className="text-slate-400" />
            <select 
              className="bg-transparent focus:outline-none text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer appearance-none pr-4"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Entities</option>
              <option value="MODEL">Models Only</option>
              <option value="COMPANY">Companies Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="audit-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-black border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Action Type</th>
                <th className="px-8 py-5">Target Entity</th>
                <th className="px-8 py-5">Performed By</th>
                <th className="px-8 py-5">Time Occurred</th>
                <th className="px-8 py-5 text-right">View Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-400 font-bold italic">Synchronizing audit history...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center text-slate-400">
                    <div className="flex flex-col items-center opacity-30">
                      <FiDatabase size={64} className="mb-6 text-slate-300" />
                      <p className="text-2xl font-black tracking-tight">NO LOGS FOUND</p>
                      <p className="text-sm font-medium mt-1">Try adjusting your filters or search query</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-900/5 transition-all group">
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-[10px] font-black tracking-widest border shadow-sm ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm border border-slate-50 dark:border-slate-800">
                          {getEntityIcon(log.entityType)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-200 text-sm">{log.entityType}</div>
                          <div className="text-slate-400 text-[10px] font-mono mt-1 tracking-tight">{log.entityId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-bold text-sm">
                        <div className="w-6 h-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-[10px]">
                          <FiUser size={12} />
                        </div>
                        {log.performedBy || 'System Process'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-xs">
                        <FiClock size={14} className="text-slate-400" />
                        {new Date(log.performedAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white rounded-xl transition-all font-bold text-xs border border-indigo-100 dark:border-indigo-900/30 shadow-sm"
                      >
                        <FiEye size={14} />
                        Snapshot
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-slideUp">
            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200">
                  <FiFileText size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Data Snapshot
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{selectedLog.entityType}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{selectedLog.action}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{new Date(selectedLog.performedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="flex-1 p-10 overflow-y-auto snapshot-viewer">
              {selectedLog.oldData ? (
                <div className="relative group">
                  <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none group-hover:text-indigo-600 transition-colors">
                    JSON SNAPSHOT
                  </div>
                  <div className="json-viewer shadow-inner dark:bg-slate-950 dark:border-slate-800">
                    <pre className="text-indigo-600 dark:text-indigo-400 font-mono text-sm whitespace-pre-wrap">
                      {JSON.stringify(JSON.parse(selectedLog.oldData), null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-20 opacity-30 text-center">
                  <FiAlertCircle size={64} className="mb-6 text-slate-300" />
                  <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">NO SNAPSHOT DATA</p>
                  <p className="text-sm font-medium mt-2">Historical data record is empty for this specific action</p>
                </div>
              )}
            </div>

            <div className="px-10 py-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-8 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-black text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
              >
                Dismiss Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminAuditLogs;
