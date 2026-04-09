import React, { useEffect, useState } from 'react';
import { Model, getModels, createModel } from '../services/api';

interface ModelSelectorProps {
  selectedModelId: string | null;
  onModelChange: (modelId: string | null) => void;
  isAuthor?: boolean;
  onModelsLoaded?: (count: number) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModelId, onModelChange, isAuthor, onModelsLoaded }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newModelName, setNewModelName] = useState('');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const data = await getModels();
      setModels(data);
      if (onModelsLoaded) onModelsLoaded(data.length);
      
      // AUTO-SELECT FIRST MODEL IF NONE SELECTED
      if (!selectedModelId && data.length > 0) {
        onModelChange(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch models:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newModelName.trim()) return;
    try {
      const newModel = await createModel(newModelName);
      setModels([...models, newModel]);
      setNewModelName('');
      setShowCreateModal(false);
      onModelChange(newModel.id);
    } catch (err) {
      console.error("Failed to create model:", err);
    }
  };

  // IF SINGLE MODEL, JUST SHOW NAME
  if (models.length === 1 && !isAuthor) {
    return (
      <div className="model-selector-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Model:</span>
        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-primary)' }}>{models[0].name}</span>
      </div>
    );
  }

  return (
    <div className="model-selector-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label htmlFor="model-select" style={{ fontSize: '14px', fontWeight: 'bold' }}>Model:</label>
      <select
        id="model-select"
        value={selectedModelId || ''}
        onChange={(e) => onModelChange(e.target.value || null)}
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '14px',
          background: 'white',
          color: '#333'
        }}
      >
        {!selectedModelId && <option value="">Select Model</option>}
        {models.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      {isAuthor && (
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: 'none',
            background: '#007bff',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          + New
        </button>
      )}

      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          zIndex: 1000,
          borderRadius: '8px'
        }}>
          <h3>Create New Model</h3>
          <input
            type="text"
            value={newModelName}
            onChange={(e) => setNewModelName(e.target.value)}
            placeholder="Model Name"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={() => setShowCreateModal(false)}>Cancel</button>
            <button onClick={handleCreate}>Create</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
