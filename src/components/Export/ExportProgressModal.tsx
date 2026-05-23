import React from 'react';
import { X, Download, FileImage, FileText, Loader2 } from 'lucide-react';
import { ExportProgress } from './ExportQueueManager';

interface ExportProgressModalProps {
  isOpen: boolean;
  progress: ExportProgress | null;
  onClose: () => void;
  onAbort: () => void;
}

export default function ExportProgressModal({
  isOpen,
  progress,
  onClose,
  onAbort
}: ExportProgressModalProps) {
  if (!isOpen) return null;

  const getProgressPercentage = () => {
    if (!progress) return 0;
    return Math.round((progress.current / progress.total) * 100);
  };

  const getStatusMessage = () => {
    if (!progress) return '';
    switch (progress.status) {
      case 'processing':
        return 'Rendering schematic...';
      case 'capturing':
        return 'Capturing image...';
      case 'generating':
        return 'Generating output...';
      case 'complete':
        return 'Export complete!';
      case 'error':
        return 'Export failed';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    if (!progress) return '#007bff';
    switch (progress.status) {
      case 'complete':
        return '#28a745';
      case 'error':
        return '#dc3545';
      default:
        return '#007bff';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          width: '90%',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {progress?.status === 'complete' ? (
              <Download size={24} color="#28a745" />
            ) : progress?.status === 'error' ? (
              <X size={24} color="#dc3545" />
            ) : (
              <Loader2 size={24} color="#007bff" style={{ animation: 'spin 1s linear infinite' }} />
            )}
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: '#212529'
              }}
            >
              {progress?.status === 'complete' ? 'Export Complete' : 'Exporting Schematics'}
            </h2>
          </div>
          {progress?.status !== 'complete' && progress?.status !== 'error' && (
            <button
              onClick={onAbort}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6c757d',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {progress && progress.status !== 'complete' && progress.status !== 'error' && (
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#495057'
              }}
            >
              <span>{getStatusMessage()}</span>
              <span style={{ fontWeight: '600' }}>
                {progress.current} / {progress.total}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: '#e9ecef',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${getProgressPercentage()}%`,
                  height: '100%',
                  background: getStatusColor(),
                  transition: 'width 0.3s ease',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div
              style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#6c757d'
              }}
            >
              Processing: <strong>{progress.currentItem}</strong>
            </div>
          </div>
        )}

        {/* Complete Message */}
        {progress?.status === 'complete' && (
          <div
            style={{
              textAlign: 'center',
              padding: '24px',
              background: '#d4edda',
              borderRadius: '8px',
              marginBottom: '24px'
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '16px',
                color: '#155724',
                fontWeight: '500'
              }}
            >
              Successfully exported {progress.total} schematic(s)
            </p>
          </div>
        )}

        {/* Error Message */}
        {progress?.status === 'error' && (
          <div
            style={{
              textAlign: 'center',
              padding: '24px',
              background: '#f8d7da',
              borderRadius: '8px',
              marginBottom: '24px'
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '16px',
                color: '#721c24',
                fontWeight: '500'
              }}
            >
              Export failed. Please try again.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}
        >
          {progress?.status === 'complete' || progress?.status === 'error' ? (
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#0056b3'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#007bff'}
            >
              Close
            </button>
          ) : (
            <button
              onClick={onAbort}
              style={{
                padding: '12px 24px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#c82333'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
            >
              Cancel Export
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
