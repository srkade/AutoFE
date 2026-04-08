import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface LogEntry {
  timestamp: string;
  type: 'action' | 'error' | 'info';
  message: string;
  details?: any;
}

interface AuditLogContextType {
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, 'timestamp'>) => void;
  clearLogs: () => void;
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

export const AuditLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((entry: Omit<LogEntry, 'timestamp'>) => {
    const newEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [...prev.slice(-100), newEntry]); // Keep last 100 logs
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  // Intercept console errors
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      addLog({
        type: 'error',
        message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
      });
      originalError.apply(console, args);
    };

    // Track global clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const label = target.innerText || target.getAttribute('aria-label') || target.tagName;
      addLog({
        type: 'action',
        message: `Clicked: ${label.substring(0, 50)}`,
        details: { id: target.id, className: target.className }
      });
    };

    window.addEventListener('click', handleClick);

    return () => {
      console.error = originalError;
      window.removeEventListener('click', handleClick);
    };
  }, [addLog]);

  return (
    <AuditLogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </AuditLogContext.Provider>
  );
};

export const useAuditLog = () => {
  const context = useContext(AuditLogContext);
  if (!context) {
    throw new Error('useAuditLog must be used within an AuditLogProvider');
  }
  return context;
};
