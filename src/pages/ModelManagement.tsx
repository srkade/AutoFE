import React, { useState, useEffect } from 'react';
import {
  getModels,
  createModel,
  updateModel,
  deleteModel,
  Model,
  getAssignedUserCount,
  getUsersForModel,
  assignUsersToModel,
  fetchUsers
} from '../services/api';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiSearch,
  FiX,
  FiCheck,
  FiPackage
} from 'react-icons/fi';
import '../Styles/ModelManagement.css';

const ModelManagement: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);

  // Form states
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Assignment states
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const modelList = await getModels();
      setModels(modelList);

      const counts: Record<string, number> = {};
      for (const m of modelList) {
        counts[m.id] = await getAssignedUserCount(m.id);
      }
      setUserCounts(counts);
    } catch (err) {
      console.error('Failed to load models', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setCurrentModel(null);
    setFormData({ name: '', description: '' });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (model: Model) => {
    setCurrentModel(model);
    setFormData({ name: model.name, description: model.description || '' });
    setIsEditModalOpen(true);
  };

  const handleSaveModel = async () => {
    if (!formData.name.trim()) return;
    try {
      if (currentModel) {
        await updateModel(currentModel.id, formData.name, formData.description);
      } else {
        await createModel(formData.name, formData.description);
      }
      setIsEditModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save model');
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await deleteModel(id);
        loadData();
      } catch (err) {
        alert('Failed to delete model');
      }
    }
  };

  const handleOpenAssign = async (model: Model) => {
    setCurrentModel(model);
    setUserSearch('');
    try {
      const users = await fetchUsers();
      const assigned = await getUsersForModel(model.id);
      setAllUsers(users);
      setAssignedUserIds(assigned);
      setIsAssignModalOpen(true);
    } catch (err) {
      alert('Failed to load user data');
    }
  };

  const handleToggleUser = (userId: string) => {
    setAssignedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSaveAssignments = async () => {
    if (!currentModel) return;
    try {
      await assignUsersToModel(currentModel.id, assignedUserIds);
      setIsAssignModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save assignments');
    }
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';

  const filteredModels = models.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const totalAssigned = Object.values(userCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="model-mgmt-page">

      {/* Header */}
      <div className="model-mgmt-header">
        <div>
          <h1 className="model-mgmt-title">Model Management</h1>
          <p className="model-mgmt-subtitle">
            Create vehicle models and control which users can access their schematics.
          </p>
        </div>
        <button className="btn-new-model" onClick={handleOpenCreate}>
          <FiPlus size={16} /> New Model
        </button>
      </div>

      {/* Stats bar */}
      <div className="model-stats-bar">
        <div className="model-stat-card">
          <div className="model-stat-value">{models.length}</div>
          <div className="model-stat-label">Total Models</div>
        </div>
        <div className="model-stat-card">
          <div className="model-stat-value">{totalAssigned}</div>
          <div className="model-stat-label">Total Assigned Users</div>
        </div>
        <div className="model-stat-card">
          <div className="model-stat-value">
            {models.filter(m => (userCounts[m.id] || 0) > 0).length}
          </div>
          <div className="model-stat-label">Active Models</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="model-mgmt-toolbar">
        <div className="model-search-box">
          <FiSearch size={15} />
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="model-table-wrapper">
        <table className="model-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Description</th>
              <th>Created</th>
              <th>Assigned Users</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <div className="model-loading">Loading models...</div>
                </td>
              </tr>
            ) : filteredModels.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="model-empty-state">
                    <FiPackage size={40} />
                    <p>
                      {searchTerm
                        ? `No models matching "${searchTerm}"`
                        : 'No models yet. Create your first model.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredModels.map(model => (
                <tr key={model.id}>
                  <td>
                    <div className="model-name-cell">
                      <span className="model-name">{model.name}</span>
                      <span className="model-id-label">#{model.id.slice(0, 8)}</span>
                    </div>
                  </td>
                  <td>
                    {model.description
                      ? <span className="model-desc">{model.description}</span>
                      : <span className="model-desc empty">No description</span>
                    }
                  </td>
                  <td>
                    {model.createdAt
                      ? new Date(model.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })
                      : '—'}
                  </td>
                  <td>
                    <span className="user-badge">
                      <FiUsers size={12} />
                      {userCounts[model.id] ?? 0} Users
                    </span>
                  </td>
                  <td>
                    <div className="model-actions-cell">
                      <button
                        className="model-action-btn assign"
                        title="Assign Users"
                        onClick={() => handleOpenAssign(model)}
                      >
                        <FiUsers size={15} />
                      </button>
                      <button
                        className="model-action-btn edit"
                        title="Edit Model"
                        onClick={() => handleOpenEdit(model)}
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        className="model-action-btn delete"
                        title="Delete Model"
                        onClick={() => handleDeleteModel(model.id)}
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== CREATE / EDIT MODAL ===== */}
      {isEditModalOpen && (
        <div className="mm-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="mm-modal" onClick={e => e.stopPropagation()}>
            <div className="mm-modal-header">
              <h2>{currentModel ? 'Edit Model' : 'Create New Model'}</h2>
              <button className="mm-modal-close" onClick={() => setIsEditModalOpen(false)}>
                <FiX size={16} />
              </button>
            </div>

            <div className="mm-modal-body">
              <div className="mm-form-group">
                <label>Model Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Toyota Hilux 2024"
                  autoFocus
                />
              </div>
              <div className="mm-form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hardware version, region, notes..."
                  rows={4}
                />
              </div>
            </div>

            <div className="mm-modal-footer">
              <button className="mm-btn-cancel" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button
                className="mm-btn-save"
                onClick={handleSaveModel}
                disabled={!formData.name.trim()}
              >
                {currentModel ? 'Save Changes' : 'Create Model'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ASSIGN USERS MODAL ===== */}
      {isAssignModalOpen && (
        <div className="mm-modal-overlay" onClick={() => setIsAssignModalOpen(false)}>
          <div className="mm-modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="mm-modal-header">
              <div>
                <h2>Assign Users</h2>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {currentModel?.name}
                </p>
              </div>
              <button className="mm-modal-close" onClick={() => setIsAssignModalOpen(false)}>
                <FiX size={16} />
              </button>
            </div>

            <div className="mm-modal-body" style={{ maxHeight: 460 }}>
              <p className="mm-assign-hint">
                Selected users will have access to this model's schematics.
              </p>

              {/* Search inside modal */}
              <div className="model-search-box" style={{ marginBottom: 14 }}>
                <FiSearch size={14} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                />
              </div>

              <div className="mm-user-list">
                {filteredUsers.map(user => {
                  const isSelected = assignedUserIds.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      className={`mm-user-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleUser(user.id)}
                    >
                      <div className="mm-user-avatar">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div className="mm-user-info">
                        <div className="mm-user-name">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="mm-user-meta">
                          {user.email} · {user.role}
                        </div>
                      </div>
                      <div className={`mm-check-circle ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <FiCheck size={11} />}
                      </div>
                    </div>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px 0' }}>
                    No users found.
                  </p>
                )}
              </div>
              <div className="mm-assign-count">
                {assignedUserIds.length} user{assignedUserIds.length !== 1 ? 's' : ''} selected
              </div>
            </div>

            <div className="mm-modal-footer">
              <button className="mm-btn-cancel" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </button>
              <button className="mm-btn-save" onClick={handleSaveAssignments}>
                Save Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelManagement;
