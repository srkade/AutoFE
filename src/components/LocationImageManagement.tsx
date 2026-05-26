import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiTrash2, FiUpload, FiEdit2, FiX } from "react-icons/fi";
import "../Styles/ImageManagement.css";
import { API_BASE_URL as CONFIG_API_BASE_URL } from "../config";

interface LocationImageAsset {
  id: string;
  entityCode: string;
  entityType: "COMPONENT" | "CONNECTOR" | "SPLICE";
  fileName: string;
  filePath: string;
  fileSize: number;
  imageUrl: string;
  title?: string;
  tags?: string;
  uploadedAt: string;
}

interface ComponentListItem {
  code: string;
  name: string;
}

interface ApiError {
  message: string;
  details?: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || CONFIG_API_BASE_URL;
const DIRECTORY_API = process.env.REACT_APP_DIRECTORY_API || CONFIG_API_BASE_URL;

export default function LocationImageManagement() {
  // ==================== STATE MANAGEMENT ====================
  const [locationImages, setLocationImages] = useState<LocationImageAsset[]>([]);
  const [filteredImages, setFilteredImages] = useState<LocationImageAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Component/Connector/Splice Lists
  const [componentList, setComponentList] = useState<ComponentListItem[]>([]);
  const [connectorList, setConnectorList] = useState<ComponentListItem[]>([]);
  const [spliceList, setSpliceList] = useState<ComponentListItem[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // Upload State
  const [uploadType, setUploadType] = useState<"COMPONENT" | "CONNECTOR" | "SPLICE">("COMPONENT");
  const [uploadCode, setUploadCode] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Edit State
  const [editingImage, setEditingImage] = useState<LocationImageAsset | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  // Replace State
  const [replacingImage, setReplacingImage] = useState<LocationImageAsset | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replacing, setReplacing] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "COMPONENT" | "CONNECTOR" | "SPLICE">("ALL");
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ==================== LOAD LISTS ====================
  useEffect(() => {
    fetchEntityLists();
    fetchLocationImages();
  }, []);

  const fetchEntityLists = async () => {
    setLoadingLists(true);
    try {
      const modelId = sessionStorage.getItem("selectedModelId") || "";
      const queryParam = modelId ? `?modelId=${modelId}` : "";

      // Fetch components
      const componentResponse = await fetch(
        `${DIRECTORY_API}/schematics/components${queryParam}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        }
      );

      if (componentResponse.ok) {
        const components = await componentResponse.json();
        setComponentList(components);
      }

      // Fetch connectors
      const connectorResponse = await fetch(
        `${DIRECTORY_API}/schematics/connectors${queryParam}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        }
      );

      if (connectorResponse.ok) {
        const connectors = await connectorResponse.json();
        setConnectorList(connectors);
      }

      // Fetch splices (if available)
      try {
        const spliceResponse = await fetch(
          `${DIRECTORY_API}/schematics/splices${queryParam}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
            },
          }
        );

        if (spliceResponse.ok) {
          const splices = await spliceResponse.json();
          setSpliceList(splices);
        }
      } catch (e) {
        // Splices might not be available, that's okay
        console.log("Splices not available");
      }
    } catch (err) {
      console.error("Error loading entity lists:", err);
    } finally {
      setLoadingLists(false);
    }
  };

  // ==================== FETCH LOCATION IMAGES ====================
  const fetchLocationImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/location-images`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch location images: ${response.statusText}`);
      }

      const json = await response.json();
      const assets = json.data.content;

      setLocationImages(assets);
      applyFilters(assets, searchQuery, filterType);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FILTER & SEARCH ====================
  const applyFilters = (
    images: LocationImageAsset[],
    query: string,
    type: "ALL" | "COMPONENT" | "CONNECTOR" | "SPLICE"
  ) => {
    let filtered = images;

    if (type !== "ALL") {
      filtered = filtered.filter((img) => img.entityType === type);
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (img) =>
          img.entityCode.toLowerCase().includes(lowerQuery) ||
          img.fileName.toLowerCase().includes(lowerQuery) ||
          (img.title && img.title.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredImages(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    applyFilters(locationImages, query, filterType);
  };

  const handleFilterChange = (type: "ALL" | "COMPONENT" | "CONNECTOR" | "SPLICE") => {
    setFilterType(type);
    applyFilters(locationImages, searchQuery, type);
  };

  // ==================== UPLOAD ====================
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      setUploadFiles(Array.from(files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      setUploadFiles(prev => [...prev, ...imageFiles]);
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0 || !uploadCode.trim()) {
      setError("Please provide both a code and select files");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      uploadFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("entityCode", uploadCode.toUpperCase());
      formData.append("entityType", uploadType);
      if (uploadTitle) formData.append("title", uploadTitle);
      if (uploadTags) formData.append("tags", uploadTags);

      const response = await fetch(`${API_BASE_URL}/location-images/bulk-upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.details || errorData.message || `Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setSuccessMessage(`Successfully uploaded ${result.data.length} location images`);
      setUploadFiles([]);
      setUploadCode("");
      setUploadName("");
      setUploadTitle("");
      setUploadTags("");
      fetchLocationImages();

      const fileInput = document.getElementById("location-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // ==================== EDIT ====================
  const handleEditClick = (image: LocationImageAsset) => {
    setEditingImage(image);
    setEditTitle(image.title || "");
    setEditTags(image.tags || "");
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editingImage) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("tags", editTags);

      const response = await fetch(`${API_BASE_URL}/location-images/${editingImage.id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Update failed: ${response.statusText}`);
      }

      setSuccessMessage("Location image updated successfully");
      setShowEditModal(false);
      setEditingImage(null);
      fetchLocationImages();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Update failed";
      setError(errorMessage);
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== REPLACE ====================
  const handleReplaceClick = (image: LocationImageAsset) => {
    setReplacingImage(image);
    setReplaceFile(null);
    setShowReplaceModal(true);
  };

  const handleReplaceFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setReplaceFile(file);
    }
  };

  const handleReplaceSave = async () => {
    if (!replacingImage || !replaceFile) return;

    setReplacing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", replaceFile);

      const response = await fetch(`${API_BASE_URL}/location-images/${replacingImage.id}/replace`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Replace failed: ${response.statusText}`);
      }

      setSuccessMessage("Location image replaced successfully");
      setShowReplaceModal(false);
      setReplacingImage(null);
      setReplaceFile(null);
      fetchLocationImages();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Replace failed";
      setError(errorMessage);
      console.error("Replace error:", err);
    } finally {
      setReplacing(false);
    }
  };

  // ==================== DELETE ====================
  const toggleSelectForDelete = (id: string) => {
    const newSet = new Set(selectedForDelete);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedForDelete(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedForDelete.size === filteredImages.length) {
      setSelectedForDelete(new Set());
    } else {
      setSelectedForDelete(new Set(filteredImages.map((img) => img.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedForDelete.size === 0) {
      setError("Please select at least one image to delete");
      return;
    }

    setShowDeleteConfirm(false);
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const idsToDelete = Array.from(selectedForDelete);

    try {
      const response = await fetch(`${API_BASE_URL}/location-images/delete-bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      setSuccessMessage(`Successfully deleted ${idsToDelete.length} location images`);
      setSelectedForDelete(new Set());
      fetchLocationImages();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed";
      setError(errorMessage);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this location image?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/location-images/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      setSuccessMessage("Location image deleted successfully");
      fetchLocationImages();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed";
      setError(errorMessage);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== DROPDOWN COMPONENT ====================
  const EntityDropdown = ({ items, onSelect }: { items: ComponentListItem[]; onSelect: (item: ComponentListItem) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownSearch, setDropdownSearch] = useState("");

    const filtered = items.filter(
      (item) =>
        item.code.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
        item.name.toLowerCase().includes(dropdownSearch.toLowerCase())
    );

    return (
      <div className="im-dropdown-wrapper">
        <input
          type="text"
          className="im-input im-dropdown-input"
          placeholder={`Search ${uploadType.toLowerCase()}s...`}
          value={dropdownSearch}
          onChange={(e) => setDropdownSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {isOpen && (
          <div className="im-dropdown-menu">
            {filtered.length > 0 ? (
              filtered.map((item, idx) => (
                <div
                  key={idx}
                  className="im-dropdown-item"
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                    setDropdownSearch("");
                  }}
                >
                  <strong>{item.code}</strong> - {item.name}
                </div>
              ))
            ) : (
              <div className="im-dropdown-item im-dropdown-empty">
                No {uploadType.toLowerCase()}s found
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==================== UI COMPONENTS ====================
  return (
    <div className="asset-management-page">
      {/* Header */}
      <div className="im-header">
        <h1 className="title">Location Image Management</h1>
        <p className="subtitle">Manage location images for Components, Connectors, and Splices</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="im-alert im-alert-error">
          <span><strong>Error:</strong> {error}</span>
          <button
            onClick={() => setError(null)}
            className="im-alert-close"
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="im-alert im-alert-success">
          <span><strong>Success:</strong> {successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="im-alert-close"
            aria-label="Close success"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Panel */}
      <div className="im-upload-section">
        <div className="im-card im-specific-upload">
          <div className="im-card-header">
            <h2>Upload Location Images</h2>
            <div className="im-type-toggles">
              <button
                className={`im-toggle ${uploadType === "COMPONENT" ? "active" : ""}`}
                onClick={() => setUploadType("COMPONENT")}
              >
                Component
              </button>
              <button
                className={`im-toggle ${uploadType === "CONNECTOR" ? "active" : ""}`}
                onClick={() => setUploadType("CONNECTOR")}
              >
                Connector
              </button>
              <button
                className={`im-toggle ${uploadType === "SPLICE" ? "active" : ""}`}
                onClick={() => setUploadType("SPLICE")}
              >
                Splice
              </button>
            </div>
          </div>

          <div className="im-card-body">
            {loadingLists ? (
              <p className="im-hint">Loading available {uploadType.toLowerCase()}s...</p>
            ) : (
              <>
                <label className="im-form-label">
                  Select {uploadType === "COMPONENT" ? "Component" : uploadType === "CONNECTOR" ? "Connector" : "Splice"}
                </label>
                <EntityDropdown
                  items={
                    uploadType === "COMPONENT" ? componentList :
                    uploadType === "CONNECTOR" ? connectorList :
                    spliceList
                  }
                  onSelect={(item) => {
                    setUploadCode(item.code);
                    setUploadName(item.name);
                  }}
                />

                {uploadName && (
                  <p className="im-selected-item">
                    Selected: <strong>{uploadCode}</strong> - {uploadName}
                  </p>
                )}

                <div className="im-form-group">
                  <label htmlFor="upload-title" className="im-form-label">Title (Optional)</label>
                  <input
                    id="upload-title"
                    type="text"
                    placeholder="Image title/description"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    disabled={uploading}
                    className="im-input"
                  />
                </div>

                <div className="im-form-group">
                  <label htmlFor="upload-tags" className="im-form-label">Tags (Optional)</label>
                  <input
                    id="upload-tags"
                    type="text"
                    placeholder="Comma-separated tags"
                    value={uploadTags}
                    onChange={(e) => setUploadTags(e.target.value)}
                    disabled={uploading}
                    className="im-input"
                  />
                </div>

                <label
                  className={`im-file-input-wrapper ${isDragging ? 'im-dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    id="location-file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                  <span className="im-file-input-label">
                    <FiUpload /> {isDragging ? 'Drop images here...' : 'Browse or Drag & Drop Images'}
                  </span>
                </label>

                {uploadFiles.length > 0 && (
                  <div className="im-file-list">
                    <h4>{uploadFiles.length} file(s) selected:</h4>
                    <ul>
                      {uploadFiles.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  className="im-btn im-btn-primary im-btn-full"
                  onClick={handleUpload}
                  disabled={uploadFiles.length === 0 || !uploadCode || uploading}
                >
                  {uploading ? "Uploading..." : "Upload Images"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="im-search-filter">
        <div className="im-search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by code, name, or title..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="im-filter-controls">
          <FiFilter />
          <button
            className={`im-filter-btn ${filterType === "ALL" ? "active" : ""}`}
            onClick={() => handleFilterChange("ALL")}
          >
            All
          </button>
          <button
            className={`im-filter-btn ${filterType === "COMPONENT" ? "active" : ""}`}
            onClick={() => handleFilterChange("COMPONENT")}
          >
            Components
          </button>
          <button
            className={`im-filter-btn ${filterType === "CONNECTOR" ? "active" : ""}`}
            onClick={() => handleFilterChange("CONNECTOR")}
          >
            Connectors
          </button>
          <button
            className={`im-filter-btn ${filterType === "SPLICE" ? "active" : ""}`}
            onClick={() => handleFilterChange("SPLICE")}
          >
            Splices
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="im-table-container">
        <div className="im-table-header">
          <h3>Location Images ({filteredImages.length})</h3>
          {selectedForDelete.size > 0 && (
            <button
              className="im-btn im-btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <FiTrash2 /> Delete Selected ({selectedForDelete.size})
            </button>
          )}
        </div>

        {loading ? (
          <div className="im-loading">Loading location images...</div>
        ) : filteredImages.length === 0 ? (
          <div className="im-empty-state">
            <p>No location images found. Start by uploading images using the panel above.</p>
          </div>
        ) : (
          <table className="im-table">
            <thead>
              <tr>
                <th className="im-checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedForDelete.size === filteredImages.length}
                    onChange={toggleSelectAll}
                    aria-label="Select all images"
                  />
                </th>
                <th>Code</th>
                <th className="hide-mobile">Type</th>
                <th>Title</th>
                <th>Filename</th>
                <th className="hide-mobile">Size</th>
                <th className="hide-mobile">Uploaded</th>
                <th className="im-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredImages.map((image) => (
                <tr key={image.id} className="im-table-row">
                  <td className="im-checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedForDelete.has(image.id)}
                      onChange={() => toggleSelectForDelete(image.id)}
                      aria-label={`Select ${image.entityCode}`}
                    />
                  </td>
                  <td className="im-code-cell">
                    <strong>{image.entityCode}</strong>
                  </td>
                  <td className="hide-mobile">
                    <span
                      className={`im-badge im-badge-${image.entityType.toLowerCase()}`}
                    >
                      {image.entityType}
                    </span>
                  </td>
                  <td>{image.title || "-"}</td>
                  <td>{image.fileName}</td>
                  <td className="hide-mobile">{(image.fileSize / 1024).toFixed(2)} KB</td>
                  <td className="hide-mobile">{new Date(image.uploadedAt).toLocaleDateString()}</td>
                  <td className="im-actions-col">
                    <button
                      className="im-action-btn"
                      onClick={() => handleEditClick(image)}
                      title="Edit image details"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      className="im-action-btn"
                      onClick={() => handleReplaceClick(image)}
                      title="Replace image"
                    >
                      <FiUpload size={18} />
                    </button>
                    <button
                      className="im-action-btn-danger"
                      onClick={() => handleDeleteSingle(image.id)}
                      title="Delete image"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingImage && (
        <div className="im-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="im-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Location Image</h2>
            <div className="im-form-group">
              <label htmlFor="edit-title" className="im-form-label">Title</label>
              <input
                id="edit-title"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="im-input"
              />
            </div>
            <div className="im-form-group">
              <label htmlFor="edit-tags" className="im-form-label">Tags</label>
              <input
                id="edit-tags"
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="im-input"
              />
            </div>
            <div className="im-modal-actions">
              <button
                className="im-btn im-btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="im-btn im-btn-primary"
                onClick={handleEditSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replace Modal */}
      {showReplaceModal && replacingImage && (
        <div className="im-modal-overlay" onClick={() => setShowReplaceModal(false)}>
          <div className="im-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Replace Location Image</h2>
            <p>Current file: <strong>{replacingImage.fileName}</strong></p>
            <div className="im-form-group">
              <label htmlFor="replace-file" className="im-form-label">Select New Image</label>
              <label className="im-file-input-wrapper">
                <input
                  id="replace-file"
                  type="file"
                  accept="image/*"
                  onChange={handleReplaceFileSelect}
                  disabled={replacing}
                />
                <span className="im-file-input-label">
                  <FiUpload /> Browse Image
                </span>
              </label>
              {replaceFile && (
                <p className="im-selected-file">{replaceFile.name}</p>
              )}
            </div>
            <div className="im-modal-actions">
              <button
                className="im-btn im-btn-secondary"
                onClick={() => setShowReplaceModal(false)}
              >
                Cancel
              </button>
              <button
                className="im-btn im-btn-primary"
                onClick={handleReplaceSave}
                disabled={!replaceFile || replacing}
              >
                {replacing ? "Replacing..." : "Replace"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="im-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="im-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete {selectedForDelete.size} location image(s)? This
              action cannot be undone.
            </p>
            <div className="im-modal-actions">
              <button
                className="im-btn im-btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="im-btn im-btn-danger"
                onClick={handleDeleteSelected}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
