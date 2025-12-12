import React, { useState, useEffect } from 'react';
import { smartFileUpload, ImportResponse } from '../services/api';
import '../Styles/ImportedFiles.css';
import { createUploadEntry, updateUploadEntry, getAllUploads } from "../services/uploadApi";


interface UploadStatus {
  id: string;
  fileName: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  message: string;
  response?: ImportResponse;
  timestamp: string;
  filesize?: number;
}

const ImportedFiles: React.FC = () => {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedUploads, setSelectedUploads] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  /**
   * Handle file selection - auto-detects table from any file
   */
  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {

      // Validate file
      if (!isValidFile(file)) {
        const id = crypto.randomUUID();
        addUploadStatus(id, file.name, 'error', 'Invalid file format.',file.size);
        continue;
      }

      const uiId = crypto.randomUUID();
      addUploadStatus(uiId, file.name, 'uploading', 'Starting upload...',file.size);

      const backendEntry = await createUploadEntry({
        fileName: file.name,
        total: 0,
        detectedTable: "Unknown",
        uploadedBy: "Sanika",
        filesize: file.size,
        status: "uploading",
        progress: 0,
        message: "Upload started"
      });

      const backendId = backendEntry.id;

      try {
        //  Upload file (to your existing smart file API)
        const response = await smartFileUpload(file, (progress) => {
          updateUploadProgress(uiId, progress);

          //  Update backend entry progress
          updateUploadEntry(backendId, { progress });
        });

        await updateUploadEntry(backendId, {
          status: "success",
          message: "Imported successfully",
          inserted: response.inserted,
          total: response.total,
          detectedTable: response.metadata?.detectedTable,
          processingTimeMs: response.processingTimeMs,
          errors: response.errors || 0,
          fileSize: file.size
        });

        updateUploadStatus(uiId, "success", "Upload complete", response);

      } catch (err: any) {
        await updateUploadEntry(backendId, {
          status: "error",
          message: err.message || "Upload failed"
        });

        updateUploadStatus(uiId, "error", err.message);
      }
    }
  };

  const toggleSelectUpload = (id: string) => {
    setSelectedUploads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
    return `${(sizeInBytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  useEffect(() => {
    loadBackendUploads();
  }, []);

  const loadBackendUploads = async () => {
    const data = await getAllUploads();
    setUploads(
      data.map((item: any) => ({
        id: item.id,
        fileName: item.fileName,
        status: item.status,
        progress: item.progress,
        message: item.message,
        timestamp: item.createdAt,
        fileSize: item.fileSize,
        response: {
          inserted: item.inserted,
          total: item.total,
          processingTimeMs: item.processingTimeMs,
          metadata: { detectedTable: item.detectedTable },
          errors: item.errors,
        }
      }))
    );
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
    message: string,
    fileSize?: number
  ) => {
    setUploads((prev) => [
      {
        id,
        fileName,
        status,
        progress: 0,
        message,
        fileSize,
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
  // const downloadResults = () => {
  //   const successUploads = uploads.filter((u) => u.status === 'success');
  //   const data = {
  //     timestamp: new Date().toISOString(),
  //     totalUploads: uploads.length,
  //     successfulUploads: successUploads.length,
  //     uploads: uploads.map((u) => ({
  //       fileName: u.fileName,
  //       status: u.status,
  //       message: u.message,
  //       timestamp: u.timestamp,
  //       detectedTable: u.response?.metadata?.detectedTable,
  //       inserted: u.response?.inserted,
  //       total: u.response?.total,
  //       processingTimeMs: u.response?.processingTimeMs,
  //       errors: u.response?.errors || 0,
  //     })),
  //   };

  //   const element = document.createElement('a');
  //   element.setAttribute(
  //     'href',
  //     'data:text/json;charset=utf-8,' +
  //     encodeURIComponent(JSON.stringify(data, null, 2))
  //   );
  //   element.setAttribute('download', `import-results-${Date.now()}.json`);
  //   element.style.display = 'none';
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // };
  const handleUpload = () => {
    if (!selectedFiles) return;
    handleFileSelect(selectedFiles);
    setSelectedFiles(null);
  };
  const deleteSelected = () => {
    setUploads((prev) => prev.filter((upload) => !selectedUploads.has(upload.id)));
    setSelectedUploads(new Set()); // clear selection
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

        <div
          className={`choose-file-display ${dragOver ? "drag-over" : ""}`}
          onClick={() => document.getElementById('file-input')?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            setSelectedFiles(e.dataTransfer.files);
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>☁️</div>
          <div>
            Drag & drop files here or <span style={{ color: "#4a90e2", textDecoration: "underline" }}>Browse Files</span>
          </div>
          {selectedFiles && selectedFiles.length > 0 && (
            <div style={{ marginTop: "8px", fontSize: "13px", color: "#333" }}>
              {Array.from(selectedFiles).map(f => f.name).join(', ')}
            </div>
          )}
        </div>

        <input
          id="file-input"
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => setSelectedFiles(e.target.files)}
        />



        <button className="btn-primary" onClick={handleUpload}>
          Upload
        </button>

        <div className="upload-actions-right">
          {/* <button onClick={downloadResults} className="btn-secondary">
            💾 Download Results
          </button> */}
          <button onClick={deleteSelected} className="btn-danger">
            🗑️ Delete
          </button>

        </div>
      </div>

      {/* FILE TABLE */}
      <div className="file-table-wrapper">
        <table className="file-table">
          <thead>
            <tr>
              <th></th>
              <th>File Name</th>
              <th>Size</th>
              <th>Updated At</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {uploads.map((upload, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUploads.has(upload.id)}
                    onChange={() => toggleSelectUpload(upload.id)}
                  />
                </td>

                <td>{upload.fileName}</td>

                <td>
                  {upload.filesize
                    ? formatFileSize(upload.filesize)
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