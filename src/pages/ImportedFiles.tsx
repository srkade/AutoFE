// ImportedFiles.tsx
import React, { useState, useEffect } from 'react';
import { smartFileUpload, ImportResponse } from '../services/api';
import '../Styles/ImportedFiles.css';
import { getAllUploads, deleteUploadById, fetchUploadFile, trackSuccessfulUpload, trackFailedUpload } from "../services/uploadApi";  // only this one we keep
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown
} from "react-icons/fi";

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
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedUploads, setSelectedUploads] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  type sortField = 'fileName' | 'timestamp' | 'status' | 'filesize';
  const [sortBy, setSortBy] = useState<sortField>('timestamp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [showSort, setShowSort] = useState<boolean>(false);

  useEffect(() => {
    loadBackendUploads();
  }, []);

  const loadBackendUploads = async () => {
    try {
      const data = await getAllUploads();
      setUploads(
        data.map((item: any) => ({
          id: item.id,
          fileName: item.fileName,
          status: item.status || 'idle',
          progress: item.progress ?? 0,
          message: item.message ?? '',
          timestamp: item.createdAt ?? new Date().toISOString(),
          filesize: item.file_size ?? item.filesize ?? 0,
          response: {
            inserted: item.inserted,
            total: item.total,
            processingTimeMs: item.processing_time_ms ?? item.processingTimeMs,
            metadata: { detectedTable: item.detected_table ?? item.detectedTable },
            errors: item.errors,
          }
        }))
      );
    } catch (err) {
      console.error('Failed to load uploads', err);
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
   * Add new upload status (local UI only)
   */
  const addUploadStatus = (
    id: string,
    fileName: string,
    status: UploadStatus['status'],
    message: string,
    filesize?: number
  ) => {
    setUploads((prev) => [
      {
        id,
        fileName,
        status,
        progress: 0,
        message,
        filesize,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleViewFile = async (id: string) => {
    try {
      const fileBlob = await fetchUploadFile(id); // call your API
      const fileURL = URL.createObjectURL(fileBlob); // create temporary URL
      window.open(fileURL, "_blank"); // open in new tab
    } catch (error) {
      console.error("Error fetching file:", error);
      alert("Failed to fetch the file.");
    }
  };

  /**
   * Update upload status (local UI only)
   */
  const updateUploadStatus = (
    id: string,
    status: UploadStatus['status'],
    message: string,
    response?: ImportResponse
  ) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status, message, progress: status === 'success' ? 100 : u.progress, response } : u
      )
    );
  };

  /**
   * Update upload progress (local UI only)
   */
  const updateUploadProgress = (uploadId: string, progress: number) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === uploadId ? { ...upload, progress } : upload
      )
    );
  };

  /**
   * Handle file selection - upload and track locally, backend will persist
   */
  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // Validate file
      if (!isValidFile(file)) {
        const id = crypto.randomUUID();
        addUploadStatus(id, file.name, 'error', 'Invalid file format.', file.size);
        continue;
      }

      // Local UI entry
      const uiId = crypto.randomUUID();
      addUploadStatus(uiId, file.name, 'uploading', 'Starting upload...', file.size);

      try {
        // Upload the file (smartFileUpload should POST file to backend and wait for import)
        const response: ImportResponse = await smartFileUpload(file, (progress: number) => {
          updateUploadProgress(uiId, progress);
        });

        // Mark local UI as success and attach backend response
        updateUploadStatus(uiId, 'success', 'Upload complete', response);

        // Reload uploads from backend so the newly persisted row appears in the table
        await loadBackendUploads();
        
        // Track successful upload in system statistics
        await trackSuccessfulUpload();

      } catch (err: any) {
        console.error('Upload/import failed', err);
        updateUploadStatus(uiId, 'error', err?.message || 'Upload failed');
        
        // Track failed upload in system statistics
        await trackFailedUpload();
      }
    }
  };

  const toggleSelectUpload = (id: string) => {
    setSelectedUploads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (!sizeInBytes) return '--';
    if (sizeInBytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
    return `${(sizeInBytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragOver(true);
    } else if (e.type === 'dragleave') {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = () => {
    if (!selectedFiles) return;
    handleFileSelect(selectedFiles);
    setSelectedFiles(null);
  };

  const deleteSelected = async () => {
    for (const id of Array.from(selectedUploads)) {
      try {
        await deleteUploadById(id);
      } catch (err) {
        console.error("Failed to delete upload", id, err);
      }
    }
    setUploads((prev) => prev.filter((upload) => !selectedUploads.has(upload.id)));
    setSelectedUploads(new Set());
  };

  const deleteSingle = async (id: string) => {
    const confirm = window.confirm("Delete this upload?");
    if (!confirm) return;

    try {
      await deleteUploadById(id);

      setUploads(prev => prev.filter(u => u.id !== id));

      setSelectedUploads(prev => {
        const set = new Set(prev);
        set.delete(id);
        return set;
      });
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
    } catch (e) {
      return isoString;
    }
  };

  const filteredAndSortedUploads = [...uploads]
    .filter(upload =>
      upload.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortBy) {
        case 'fileName':
          valA = a.fileName.toLowerCase();
          valB = b.fileName.toLowerCase();
          break;

        case 'status':
          valA = a.status;
          valB = b.status;
          break;

        case 'filesize':
          valA = a.filesize ?? 0;
          valB = b.filesize ?? 0;
          break;

        case 'timestamp':
        default:
          valA = new Date(a.timestamp).getTime();
          valB = new Date(b.timestamp).getTime();
          break;
      }

      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });


  return (
    <div className="import-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>📤 Import Files</h1>
        <p>Upload CSV / Excel files and track their live status</p>
      </div>

      {/* TOP UPLOAD BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
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

          <button className="btn-primary" onClick={handleUpload}>
            Upload
          </button>
        </div>

        <div className="top-right-controls">
          <div className="sort-wrapper">
            <button
              className="btn-outline sort-btn"
              onClick={() => setShowSort(prev => !prev)}
            >
              Sort&nbsp;&nbsp;
              {sortAsc ? <FiArrowUp /> : <FiArrowDown />}
              <FiChevronDown />
            </button>

            {showSort && (
              <div className="sort-dropdown">
                <div onClick={() => { setSortBy('fileName'); setShowSort(false); }}>Name</div>
                <div onClick={() => { setSortBy('timestamp'); setShowSort(false); }}>Date modified</div>
                <div onClick={() => { setSortBy('filesize'); setShowSort(false); }}>Size</div>
                <div onClick={() => { setSortBy('status'); setShowSort(false); }}>Status</div>

                <hr />

                <div onClick={() => { setSortAsc(true); setShowSort(false); }}>Ascending</div>
                <div onClick={() => { setSortAsc(false); setShowSort(false); }}>Descending</div>
              </div>
            )}
          </div>

          <div className="search-box compact-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="upload-actions-right">
            {selectedUploads.size > 0 && (
              <button onClick={deleteSelected} className="btn-danger">
                🗑️ Delete ({selectedUploads.size})
              </button>
            )}
          </div>
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
            {filteredAndSortedUploads.map((upload, index) => (
              <tr key={upload.id ?? index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUploads.has(upload.id)}
                    onChange={() => toggleSelectUpload(upload.id)}
                  />
                </td>

                <td>{upload.fileName}</td>

                <td>{upload.filesize ? formatFileSize(upload.filesize) : '--'}</td>

                <td>{formatTimestamp(upload.timestamp)}</td>

                <td>
                  <span className={`status-badge ${upload.status}`}>
                    {upload.status.toUpperCase()}
                  </span>
                </td>

                <td className="actions">
                  <FiEdit2 className="edit-icon" />
                  <FiTrash2
                    className="delete-icon"
                    title="Delete file"
                    onClick={() => deleteSingle(upload.id)}
                  />
                  <FiDownload
                    className="edit-icon"
                    title="Download file"
                    onClick={() => handleViewFile(upload.id)}
                  />
                </td>

              </tr>
            ))}
            {filteredAndSortedUploads.length === 0 && (
              <div className="empty-state">
                🔍 No matching files found
              </div>
            )}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {uploads.length === 0 && (
          <div className="empty-state">📁 No files uploaded yet</div>
        )}
      </div>

      {/* STATUS PANEL */}
      {uploads.length > 0 && (
        <div className="status-panel">
          <h3>📊 Upload Status</h3>

          {uploads.map((upload, index) => (
            <div key={upload.id ?? index} className={`status-card ${upload.status}`}>
              <div className="status-header">
                <strong>{upload.fileName}</strong>
                <span>{upload.timestamp}</span>
              </div>

              {/* PROGRESS */}
              {upload.status === 'uploading' && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${upload.progress}%` }} />
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
              {upload.status === 'error' && upload.response?.errorMessages?.map((err, i) => (
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
