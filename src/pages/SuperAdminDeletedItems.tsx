import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiRefreshCcw, 
  FiTrash2, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiArchive, 
  FiBriefcase, 
  FiClock, 
  FiUser,
  FiSearch,
  FiArrowRight,
  FiRotateCcw,
  FiDatabase
} from 'react-icons/fi';
import '../Styles/SuperAdminTracking.css';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const SuperAdminDeletedItems = ({ token }: { token: string | null }) => {
  const [deletedModels, setDeletedModels] = useState<any[]>([]);
  const [deletedCompanies, setDeletedCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'companies' | 'models'>('companies');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDeletedItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [modelsRes, companiesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/models/deleted`, config),
        axios.get(`${API_BASE_URL}/companies/deleted`, config)
      ]);
      setDeletedModels(modelsRes.data);
      setDeletedCompanies(companiesRes.data);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch deleted items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDeletedItems();
  }, [token]);

  const handleRestoreModel = async (id: string) => {
    try {
      await axios.put(`${API_BASE_URL}/models/${id}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Model restored successfully');
      fetchDeletedItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to restore model');
    }
  };

  const handleRestoreCompany = async (id: string) => {
    try {
      await axios.put(`${API_BASE_URL}/companies/${id}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Company restored successfully');
      fetchDeletedItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to restore company');
    }
  };

  const filteredCompanies = deletedCompanies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModels = deletedModels.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fadeIn font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-rose-600 rounded-xl text-white shadow-lg shadow-rose-200">
              <FiTrash2 size={24} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trash Recovery
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium ml-12">
            Manage and restore soft-deleted records from across the ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name..."
              className="pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm w-72 text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchDeletedItems}
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
            title="Refresh list"
          >
            <FiRefreshCcw className={loading ? 'animate-spin text-rose-500' : 'text-slate-600'} size={20} />
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center gap-3 border border-rose-100 dark:border-rose-900/30 shadow-sm animate-slideUp">
          <FiAlertCircle size={20} /> <span className="font-bold text-sm">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center gap-3 border border-emerald-100 dark:border-emerald-900/30 shadow-sm animate-slideUp">
          <FiCheckCircle size={20} /> <span className="font-bold text-sm">{success}</span>
        </div>
      )}

      {/* Tabs Section */}
      <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/50 p-1.5 rounded-[1.25rem] mb-8 w-fit shadow-inner border border-slate-200/50 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all ${
            activeTab === 'companies' 
              ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-lg scale-100 ring-1 ring-slate-200 dark:ring-slate-600' 
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50'
          }`}
        >
          <FiBriefcase /> Companies
          <span className={`tab-badge ${
            activeTab === 'companies' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
          }`}>
            {deletedCompanies.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all ${
            activeTab === 'models' 
              ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-lg scale-100 ring-1 ring-slate-200 dark:ring-slate-600' 
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50'
          }`}
        >
          <FiArchive /> Models
          <span className={`tab-badge ${
            activeTab === 'models' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
          }`}>
            {deletedModels.length}
          </span>
        </button>
      </div>

      {/* Content Table Area */}
      <div className="audit-table-container min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-black border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Entity Details</th>
                <th className="px-8 py-5">Deleted By</th>
                <th className="px-8 py-5">Deletion Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-400 font-bold italic">Scanning archive...</p>
                    </div>
                  </td>
                </tr>
              ) : (activeTab === 'companies' ? (
                filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <FiBriefcase size={64} className="mb-6 text-slate-300" />
                        <p className="text-2xl font-black tracking-tight uppercase">Trash is empty</p>
                        <p className="text-sm font-medium mt-1 text-slate-400">No deleted companies found in the archive</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-rose-50/30 dark:hover:bg-rose-900/5 transition-all group">
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-900 dark:text-slate-100 text-base group-hover:text-rose-600 transition-colors">{company.name}</div>
                        <div className="text-slate-400 text-xs mt-1 font-medium italic truncate max-w-xs">{company.description || 'No description provided'}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-bold text-sm">
                          <div className="w-6 h-6 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 text-[10px]">
                            <FiUser size={12} />
                          </div>
                          {company.deletedBy || 'System Administrator'}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-xs">
                          <FiClock size={14} className="text-slate-400" />
                          {company.deletedAt ? new Date(company.deletedAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          }) : 'Date Unknown'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleRestoreCompany(company.id)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                          title="Restore Company"
                        >
                          <FiRotateCcw size={14} />
                          RESTORE
                        </button>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                filteredModels.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <FiArchive size={64} className="mb-6 text-slate-300" />
                        <p className="text-2xl font-black tracking-tight uppercase">No deleted models</p>
                        <p className="text-sm font-medium mt-1 text-slate-400">Everything is clean in the model archive</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredModels.map((model) => (
                    <tr key={model.id} className="hover:bg-rose-50/30 dark:hover:bg-rose-900/5 transition-all group">
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-900 dark:text-slate-100 text-base group-hover:text-rose-600 transition-colors">{model.name}</div>
                        <div className="text-slate-400 text-xs mt-1 font-medium italic">{model.description || 'No description provided'}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-bold text-sm">
                          <div className="w-6 h-6 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 text-[10px]">
                            <FiUser size={12} />
                          </div>
                          {model.deletedBy || 'System Administrator'}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-xs">
                          <FiClock size={14} className="text-slate-400" />
                          {model.deletedAt ? new Date(model.deletedAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          }) : 'Date Unknown'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleRestoreModel(model.id)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                          title="Restore Model"
                        >
                          <FiRotateCcw size={14} />
                          RESTORE
                        </button>
                      </td>
                    </tr>
                  ))
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDeletedItems;
