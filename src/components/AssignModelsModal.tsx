import React, { useState, useEffect } from 'react';
import { 
  getModels, 
  getModelsForUser, 
  assignModelsToUser, 
  Model 
} from '../services/api';
import { FiX, FiCheck, FiPlus, FiAlertCircle } from 'react-icons/fi';

interface Props {
  userId: string;
  userName: string;
  onClose: () => void;
  onSave?: () => void;
}

const AssignModelsModal: React.FC<Props> = ({ userId, userName, onClose, onSave }) => {
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const models = await getModels();
      const assigned = await getModelsForUser(userId);
      setAllModels(models);
      setSelectedIds(assigned);
    } catch (err) {
      console.error("Failed to load assignment data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      await assignModelsToUser(userId, selectedIds);
      if (onSave) onSave();
      onClose();
    } catch (err) {
      alert("Failed to save model assignments");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{maxWidth: '500px'}}>
        <div className="modal-header">
          <h2>Assign Models to {userName}</h2>
          <button onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body" style={{maxHeight: '450px', overflowY: 'auto'}}>
          <div style={{
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px', 
            background: 'var(--bg-secondary)', 
            borderRadius: '6px', 
            marginBottom: '15px', 
            fontSize: '14px',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)'
          }}>
            <FiAlertCircle style={{marginRight: '10px', color: '#4a90e2'}} />
            Select models this user should have access to. 
            All other models will be hidden from their dashboard.
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '20px'}}>Loading models...</div>
          ) : allModels.length === 0 ? (
            <div style={{textAlign: 'center', padding: '20px'}}>No models available to assign.</div>
          ) : (
            allModels.map(model => (
              <div 
                key={model.id}
                className={`user-selection-item ${selectedIds.includes(model.id) ? 'selected' : ''}`}
                onClick={() => handleToggle(model.id)}
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px', 
                  marginBottom: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  background: selectedIds.includes(model.id) ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 'bold'}}>{model.name}</div>
                  <div style={{fontSize: '12px', color: '#888', marginTop: '2px'}}>{model.description || 'No description'}</div>
                </div>
                {selectedIds.includes(model.id) ? (
                  <FiCheck color="#4a90e2" size={20} />
                ) : (
                  <div style={{width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ccc'}} />
                )}
              </div>
            ))
          )}
        </div>
        <div className="modal-footer" style={{padding: '15px', borderTop: '1px solid var(--border-color)'}}>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave} disabled={loading}>
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModelsModal;
