import React, { useState } from 'react';
import { FiX, FiLock, FiSave, FiUnlock } from 'react-icons/fi';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string, name?: string) => void;
  mode: 'save' | 'load';
  defaultName?: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSubmit, mode, defaultName }) => {
  const [password, setPassword] = useState('');
  const [name, setName] = useState(defaultName || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    if (mode === 'save' && !name) {
      setError('Schematic name is required');
      return;
    }
    
    onSubmit(password, mode === 'save' ? name : undefined);
    setPassword('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-2xl w-full max-w-md border border-[var(--border-color)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
            {mode === 'save' ? <><FiSave className="text-blue-500" /> Save Offline</> : <><FiUnlock className="text-green-500" /> Load Offline Schematic</>}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
            <FiX className="text-[var(--text-secondary)]" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'save' && (
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">Schematic Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter a name for this schematic"
                autoFocus={mode === 'save'}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">
              {mode === 'save' ? 'Encryption Password' : 'Decryption Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter secure password"
                autoFocus={mode === 'load'}
              />
            </div>
            {mode === 'save' && (
              <p className="text-xs text-gray-500 mt-2">
                This password will be required to open the schematic later. Do not lose it!
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center gap-2"
            >
              {mode === 'save' ? 'Encrypt & Save' : 'Decrypt & Load'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
