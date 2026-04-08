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
  FiCheck
} from 'react-icons/fi';
import '../Styles/ManageUsers.css'; // Reuse table styles

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const modelList = await getModels();
      setModels(modelList);
      
      // Load user counts for each model
      const counts: Record<string, number> = {};
      for (const m of modelList) {
        counts[m.id] = await getAssignedUserCount(m.id);
      }
      setUserCounts(counts);
    } catch (err) {
      console.error("Failed to load models", err);
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
    try {
      if (currentModel) {
        await updateModel(currentModel.id, formData.name, formData.description);
      } else {
        await createModel(formData.name, formData.description);
      }
      setIsEditModalOpen(false);
      loadData();
    } catch (err) {
      alert("Failed to save model");
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this model? (Soft delete)")) {
      try {
        await deleteModel(id);
        loadData();
      } catch (err) {
        alert("Failed to delete model");
      }
    }
  };

  const handleOpenAssign = async (model: Model) => {
    setCurrentModel(model);
    try {
      const users = await fetchUsers();
      const assigned = await getUsersForModel(model.id);
      setAllUsers(users);
      setAssignedUserIds(assigned);
      setIsAssignModalOpen(true);
    } catch (err) {
      alert("Failed to load user data");
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
      alert("Failed to save assignments");
    }
  };

  const filteredModels = models.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-users-container">
      <div className="header-section">
        <div>
          <h1>Model Management</h1>
          <p>Create and manage vehicle models and assign user access</p>
        </div>
        <button className="add-user-btn" onClick={handleOpenCreate}>
          <FiPlus /> New Model
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Search models..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Assigned Users</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>Loading models...</td></tr>
            ) : filteredModels.map(model => (
              <tr key={model.id}>
                <td><strong>{model.name}</strong></td>
                <td>{model.description || <em style={{color: '#999'}}>No description</em>}</td>
                <td>{model.createdAt ? new Date(model.createdAt).toLocaleDateString() : '--'}</td>
                <td>
                  <span className="role-badge author">
                    <FiUsers size={12} style={{marginRight: '4px'}}/>
                    {userCounts[model.id] || 0} Users
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons">
                    <button className="edit-btn" title="Assign Users" onClick={() => handleOpenAssign(model)}>
                      <FiUsers />
                    </button>
                    <button className="edit-btn" title="Edit Model" onClick={() => handleOpenEdit(model)}>
                      <FiEdit2 />
                    </button>
                    <button className="delete-btn" title="Delete Model" onClick={() => handleDeleteModel(model.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE/EDIT MODAL */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '450px'}}>
            <div className="modal-header">
              <h2>{currentModel ? 'Edit Model' : 'Create New Model'}</h2>
              <button onClick={() => setIsEditModalOpen(false)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Model Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Tesla Model S 2024"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Hardware version, region, etc."
                  rows={4}
                  style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSaveModel}>Save Model</button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN USERS MODAL */}
      {isAssignModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '500px'}}>
            <div className="modal-header">
              <h2>Assign Users to {currentModel?.name}</h2>
              <button onClick={() => setIsAssignModalOpen(false)}><FiX /></button>
            </div>
            <div className="modal-body" style={{maxHeight: '400px', overflowY: 'auto'}}>
              <p style={{marginBottom: '15px', color: '#666'}}>Users selected below will have access to this model's schematics.</p>
              {allUsers.map(user => (
                <div 
                  key={user.id} 
                  className={`user-selection-item ${assignedUserIds.includes(user.id) ? 'selected' : ''}`}
                  onClick={() => handleToggleUser(user.id)}
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '10px', 
                    marginBottom: '8px', 
                    borderRadius: '6px', 
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    background: assignedUserIds.includes(user.id) ? 'rgba(74, 144, 226, 0.1)' : 'transparent'
                  }}
                >
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 'bold'}}>{user.firstName} {user.lastName}</div>
                    <div style={{fontSize: '12px', color: '#888'}}>{user.email} • {user.role}</div>
                  </div>
                  {assignedUserIds.includes(user.id) ? (
                    <FiCheck color="#4a90e2" />
                  ) : (
                    <div style={{width: '18px', height: '18px', borderRadius: '50%', border: '1px solid #ccc'}} />
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsAssignModalOpen(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSaveAssignments}>Save Assignments</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelManagement;
