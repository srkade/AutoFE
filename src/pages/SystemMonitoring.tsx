import React, { useState, useEffect } from "react";
import { getSystemUptime, getSystemHealth, getSystemStatus } from "../services/api";

interface SystemUptime {
  status: string;
  lastCheck: string;
  uptimeSeconds: number;
  message: string;
  healthDetails: {
    databaseConnected: boolean;
    fileSystemAccessible: boolean;
    processingEngineAvailable: boolean;
    activeUploads: number;
    pendingJobs: number;
    additionalMetrics: {
      currentTime: string;
      startTime: string;
      processedUploads: number;
      failedUploads: number;
    };
  };
}

interface SystemHealth {
  status: string;
  timestamp?: string;
  checks?: {
    name: string;
    status: string;
    details?: any;
  }[];
  lastCheck?: string;
  uptimeSeconds?: number;
  message?: string;
  healthDetails?: {
    databaseConnected: boolean;
    fileSystemAccessible: boolean;
    processingEngineAvailable: boolean;
    activeUploads: number;
    pendingJobs: number;
    additionalMetrics: {
      currentTime: string;
      startTime: string;
      processedUploads: number;
      failedUploads: number;
    };
  };
}

interface SystemStatus {
  status: string;
  message: string;
  timestamp: string;
  lastCheck?: string;
  uptimeSeconds?: number;
  healthDetails?: {
    databaseConnected: boolean;
    fileSystemAccessible: boolean;
    processingEngineAvailable: boolean;
    activeUploads: number;
    pendingJobs: number;
    additionalMetrics: {
      currentTime: string;
      startTime: string;
      processedUploads: number;
      failedUploads: number;
    };
  };
}

const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  
  try {
    // Try to create date object - handle different possible formats
    let date: Date;
    
    // If it's already an ISO string, use directly
    if (typeof dateString === 'string' && dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      // If it's a different format, try to parse it
      date = new Date(dateString);
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      // If it's not a valid date, return the original string
      return dateString;
    }
    
    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const formatUptime = (uptimeSeconds: number): string => {
  if (!uptimeSeconds) return 'N/A';
  
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(' '); 
};

export default function SystemMonitoring() {
  const [uptime, setUptime] = useState<SystemUptime | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all system monitoring data in parallel
        const [uptimeData, healthData, statusData] = await Promise.all([
          getSystemUptime(),
          getSystemHealth(),
          getSystemStatus()
        ]);
        
        setUptime(uptimeData);
        setHealth(healthData);
        setStatus(statusData);
      } catch (err) {
        console.error("Error fetching system data:", err);
        setError("Failed to fetch system monitoring data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSystemData();
    
    // Set up polling to refresh data every 20 seconds
    const intervalId = setInterval(fetchSystemData, 20000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>System Monitoring</h2>
        <p>Loading system data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>System Monitoring</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>System Monitoring</h2>
      <p>Monitor system performance, uptime, and health metrics in real-time.</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {/* Uptime Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>System Uptime</h3>
          {uptime ? (
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
                {formatUptime(uptime.uptimeSeconds)}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                <div>Start Time: {formatDate(uptime.healthDetails.additionalMetrics.startTime)}</div>
                <div>Current Time: {formatDate(uptime.healthDetails.additionalMetrics.currentTime)}</div>
              </div>
            </div>
          ) : (
            <p>No uptime data available</p>
          )}
        </div>
        
        {/* Health Status Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>System Health</h3>
          {health ? (
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: health.status === 'healthy' || health.status === 'OK' ? '#28a745' : '#dc3545', 
                marginBottom: '10px' 
              }}>
                {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                {/* Handle the new API structure */}
                {health.healthDetails ? (
                  <div>
                    <div>Database Connected: {health.healthDetails.databaseConnected ? 'Yes' : 'No'}</div>
                    <div>File System Accessible: {health.healthDetails.fileSystemAccessible ? 'Yes' : 'No'}</div>
                    <div>Processing Engine: {health.healthDetails.processingEngineAvailable ? 'Available' : 'Unavailable'}</div>
                    <div>Active Uploads: {health.healthDetails.activeUploads}</div>
                    <div>Processed Uploads: {health.healthDetails.additionalMetrics?.processedUploads}</div>
                    <div>Failed Uploads: {health.healthDetails.additionalMetrics?.failedUploads}</div>
                  </div>
                ) : (
                  <div>
                    <div>Timestamp: {health.timestamp || 'N/A'}</div>
                    <div style={{ marginTop: '10px' }}>
                      <strong>Checks:</strong>
                      {health.checks && health.checks.map((check, index) => (
                        <div key={index} style={{ marginTop: '5px' }}>
                          <span style={{ fontWeight: '500' }}>{check.name}:</span> 
                          <span style={{ 
                            color: check.status === 'healthy' ? '#28a745' : '#dc3545',
                            marginLeft: '5px'
                          }}>
                            {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>No health data available</p>
          )}
        </div>
        
        {/* System Status Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>System Status</h3>
          {status ? (
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: (status.status === 'operational' || status.status === 'OK') ? '#28a745' : '#dc3545', 
                marginBottom: '10px' 
              }}>
                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                {/* Handle the new API structure */}
                {status.healthDetails ? (
                  <div>
                    <div>Message: {status.message}</div>
                    <div>Uptime: {formatUptime(status.uptimeSeconds || 0)}</div>
                    <div>Database Connected: {status.healthDetails.databaseConnected ? 'Yes' : 'No'}</div>
                    <div>File System Accessible: {status.healthDetails.fileSystemAccessible ? 'Yes' : 'No'}</div>
                  </div>
                ) : (
                  <div>
                    <div>Message: {status.message}</div>
                    <div>Timestamp: {status.timestamp}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>No status data available</p>
          )}
        </div>
      </div>
      
      <div style={{
        marginTop: '20px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>System Monitoring Information</h3>
        <p>
          This dashboard provides real-time monitoring of system performance, uptime, and health metrics.
          Data is automatically refreshed every 30 seconds to provide up-to-date information.
        </p>
      </div>
    </div>
  );
}