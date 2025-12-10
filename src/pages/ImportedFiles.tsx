import React, { useState } from 'react';
import { smartFileUpload, ImportResponse } from '../services/api';
import '../Styles/ImportedFiles.css';


interface UploadStatus {
  id: string;   //  ADD THIS
  fileName: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  message: string;
  response?: ImportResponse;
  timestamp: string;
}


const ImportedFiles: React.FC = () => {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  /**
   * Handle file selection - auto-detects table from any file
   */
  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // Validate file type
      if (!isValidFile(file)) {
        const uploadId = crypto.randomUUID();
        addUploadStatus(
          uploadId,
          file.name,
          'error',
          ' Invalid file format. Use CSV or Excel (.csv, .xlsx, .xls)'
        );
        continue;
      }

      const uploadId = crypto.randomUUID(); //  SAFE UNIQUE ID
      addUploadStatus(uploadId, file.name, 'uploading', '🚀 Starting upload...');


      try {
        // Call smart upload - auto-detects which table this belongs to
        console.log(`📤 Uploading: ${file.name}`);
        const response = await smartFileUpload(file, (progress) => {
          updateUploadProgress(uploadId, progress);
        });

        // Success response
        const detectedTable = response.metadata?.detectedTable || 'Unknown';
        const successMsg = ` Success! ${response.inserted} rows imported into table: "${detectedTable}"`;
        console.log(successMsg);
        updateUploadStatus(uploadId, 'success', successMsg, response);
      } catch (error: any) {
        // Error response
        const errorMsg = error.message || 'Upload failed';
        console.error(` Upload failed: ${errorMsg}`);
        updateUploadStatus(uploadId, 'error', ` ${errorMsg}`);
      }
    }
  };

  /**
   * Validate file type
   */
  const isValidFile = (file: File): boolean => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some((ext) => fileName.endsWith(ext));
  };

  /**
   * Add new upload status
   */
  const addUploadStatus = (
    id: string,
    fileName: string,
    status: UploadStatus['status'],
    message: string
  ) => {
    setUploads((prev) => [
      {
        id, //  STORE REAL ID
        fileName,
        status,
        progress: 0,
        message,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };


  /**
   * Update upload status
   */
  const updateUploadStatus = (
    uploadId: string,
    status: UploadStatus['status'],
    message: string,
    response?: ImportResponse
  ) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === uploadId   //  MATCH BY REAL ID
          ? { ...upload, status, message, progress: 100, response }
          : upload
      )
    );
  };


  /**
   * Update upload progress
   */
  const updateUploadProgress = (uploadId: string, progress: number) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === uploadId   //  MATCH BY REAL ID
          ? { ...upload, progress }
          : upload
      )
    );
  };


  /**
   * Handle drag events
   */
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  /**
   * Handle file input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  /**
   * Clear upload history
   */
  const clearHistory = () => {
    setUploads([]);
  };

  /**
   * Download result as JSON
   */
  const downloadResults = () => {
    const successUploads = uploads.filter((u) => u.status === 'success');
    const data = {
      timestamp: new Date().toISOString(),
      totalUploads: uploads.length,
      successfulUploads: successUploads.length,
      uploads: uploads.map((u) => ({
        fileName: u.fileName,
        status: u.status,
        message: u.message,
        timestamp: u.timestamp,
        detectedTable: u.response?.metadata?.detectedTable,
        inserted: u.response?.inserted,
        total: u.response?.total,
        processingTimeMs: u.response?.processingTimeMs,
        errors: u.response?.errors || 0,
      })),
    };

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(data, null, 2))
    );
    element.setAttribute('download', `import-results-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const handleUpload = () => {
    if (!selectedFiles) return;
    handleFileSelect(selectedFiles);
    setSelectedFiles(null);
  };


  return (
    <div className="import-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>📤 Import Files</h1>
        <p>Upload CSV / Excel files and track their live status</p>
      </div>

      {/* TOP UPLOAD BAR */}
      <div className="upload-bar">
        <input
          id="file-input"
          type="file"
          multiple
          accept=".csv,.xlsx,.xls"
          onChange={handleInputChange}
          hidden
        />

        <button
          className="btn-outline"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          Choose File
        </button>

        <button className="btn-primary" onClick={handleUpload}>
          Upload
        </button>

        <div className="upload-actions-right">
          <button onClick={downloadResults} className="btn-secondary">
            💾 Download Results
          </button>
          <button onClick={clearHistory} className="btn-danger">
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* FILE TABLE */}
      <div className="file-table-wrapper">
        <table className="file-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Size / Rows</th>
              <th>Updated At</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {uploads.map((upload, index) => (
              <tr key={index}>
                <td>{upload.fileName}</td>

                <td>
                  {upload.response?.total
                    ? `${upload.response.total} rows`
                    : '--'}
                </td>

                <td>{upload.timestamp}</td>

                <td>
                  <span className={`status-badge ${upload.status}`}>
                    {upload.status.toUpperCase()}
                  </span>
                </td>

                <td>
                  <select className="action-dropdown">
                    <option>Action</option>
                    <option>View</option>
                    <option>Delete</option>
                    <option>Re-upload</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {uploads.length === 0 && (
          <div className="empty-state">
            📁 No files uploaded yet
          </div>
        )}
      </div>

      {/* STATUS PANEL (POPUP STYLE BELOW TABLE) */}
      {uploads.length > 0 && (
        <div className="status-panel">
          <h3>📊 Upload Status</h3>

          {uploads.map((upload, index) => (
            <div key={index} className={`status-card ${upload.status}`}>
              <div className="status-header">
                <strong>{upload.fileName}</strong>
                <span>{upload.timestamp}</span>
              </div>

              {/* PROGRESS */}
              {upload.status === 'uploading' && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}

              {/* MESSAGE */}
              <p className="status-message">{upload.message}</p>

              {/* SUCCESS DETAILS */}
              {upload.status === 'success' && upload.response && (
                <div className="success-grid">
                  <div>🗂 Table: <b>{upload.response.metadata?.detectedTable}</b></div>
                  <div>➕ Inserted: <b>{upload.response.inserted}</b></div>
                  <div>📊 Total: <b>{upload.response.total}</b></div>
                  <div>⏱ Time: <b>{upload.response.processingTimeMs}ms</b></div>
                </div>
              )}

              {/* ERROR DETAILS */}
              {upload.status === 'error' &&
                upload.response?.errorMessages?.map((err, i) => (
                  <p key={i} className="error-text">• {err}</p>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );

};

export default ImportedFiles;