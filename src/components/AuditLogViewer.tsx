import React, { useState, useEffect } from 'react';
import { useAuditLog } from '../context/AuditLogContext';

interface AuditLogViewerProps {
  currentUserEmail?: string;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ currentUserEmail }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { logs, clearLogs } = useAuditLog();

  // Only allow specific user to see audit logs
  if (currentUserEmail !== 'srk.ade766@gmail.com') {
    return null;
  }

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          padding: '8px 12px',
          backgroundColor: '#ff9800',
          color: '#000',
          border: '2px solid #000',
          borderRadius: '4px',
          zIndex: 999999,
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '12px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }}
      >
        Show Audit Logs
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      width: '400px',
      maxHeight: '500px',
      backgroundColor: '#1e1e1e',
      color: '#fff',
      border: '1px solid #444',
      borderRadius: '8px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      fontFamily: 'monospace',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '10px',
        backgroundColor: '#333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #444'
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Audit Logs</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => {
              const text = logs.map(l => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.message}`).join('\n');
              navigator.clipboard.writeText(text);
              alert('Logs copied to clipboard!');
            }} 
            style={{ fontSize: '10px', padding: '2px 8px', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: '1px solid #666', borderRadius: '3px' }}
          >
            Copy
          </button>
          <button onClick={clearLogs} style={{ fontSize: '10px', padding: '2px 8px', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: '1px solid #666', borderRadius: '3px' }}>Clear</button>
          <button onClick={() => setIsVisible(false)} style={{ fontSize: '10px', padding: '2px 8px', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: '1px solid #666', borderRadius: '3px' }}>Hide</button>
        </div>
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
        fontSize: '11px'
      }}>
        {logs.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic' }}>No logs yet...</div>
        ) : (
          logs.slice().reverse().map((log, index) => (
            <div key={index} style={{
              marginBottom: '8px',
              paddingBottom: '4px',
              borderBottom: '1px solid #2a2a2a',
              color: log.type === 'error' ? '#ff6b6b' : log.type === 'action' ? '#51cf66' : '#fff'
            }}>
              <div style={{ fontSize: '9px', color: '#888' }}>
                {new Date(log.timestamp).toLocaleTimeString()} [{log.type.toUpperCase()}]
              </div>
              <div style={{ wordBreak: 'break-all' }}>{log.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
