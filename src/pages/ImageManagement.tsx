import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiTrash2, FiUpload, FiDownload } from "react-icons/fi";
import "../Styles/ImageManagement.css";

interface ImageAsset {
  id: string;
  entityCode: string;
  entityType: "COMPONENT" | "CONNECTOR";
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  imageUrl: string;
}

interface ComponentListItem {
  code: string;
  name: string;
}

interface UploadResponse {
  id: string;
  entityCode: string;
  entityType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  imageUrl: string;
}

interface ApiError {
  message: string;
  details?: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const DIRECTORY_API = process.env.REACT_APP_DIRECTORY_API || "http://localhost:8080";

export default function ImageManagement() {
  // ==================== STATE MANAGEMENT ====================
  const [imageAssets, setImageAssets] = useState<ImageAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Component/Connector Lists
  const [componentList, setComponentList] = useState<ComponentListItem[]>([]);
  const [connectorList, setConnectorList] = useState<ComponentListItem[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // Bulk Upload State
  const [bulkUploadType, setBulkUploadType] = useState<"COMPONENT" | "CONNECTOR">(
    "COMPONENT"
  );
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);

  // Specific Upload State
  const [specificType, setSpecificType] = useState<"COMPONENT" | "CONNECTOR">(
    "COMPONENT"
  );
  const [specificCode, setSpecificCode] = useState("");
  const [specificName, setSpecificName] = useState(""); // Store selected name
  const [specificFile, setSpecificFile] = useState<File | null>(null);
  const [specificUploading, setSpecificUploading] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "COMPONENT" | "CONNECTOR">(
    "ALL"
  );
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(
    new Set()
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ==================== LOAD COMPONENT & CONNECTOR LISTS ====================
  useEffect(() => {
    fetchComponentAndConnectorLists();
    fetchImageAssets();
  }, []);

  const fetchComponentAndConnectorLists = async () => {
    setLoadingLists(true);
    try {
      // Fetch components from serviceconnector table
      const componentResponse = await fetch(
        `${DIRECTORY_API}/api/schematics/components`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        }
      );

      if (componentResponse.ok) {
        const components = await componentResponse.json();
        setComponentList(components);
        console.log("Components loaded:", components);
      }

      // Fetch connectors from serviceconnector table
      const connectorResponse = await fetch(
        `${DIRECTORY_API}/api/schematics/connectors`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        }
      );

      if (connectorResponse.ok) {
        const connectors = await connectorResponse.json();
        setConnectorList(connectors);
        console.log("Connectors loaded:", connectors);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load component/connector lists";
      console.error("Error loading lists:", errorMessage);
      // Don't show error to user - this is non-critical
    } finally {
      setLoadingLists(false);
    }
  };

  // ==================== FETCH IMAGES ====================
  const fetchImageAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/assets/images`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }

      const json = await response.json();

// ApiResponse<PageResponse<ImageAsset>>
const assets = json.data.content;

setImageAssets(assets);
applyFilters(assets, searchQuery, filterType);

    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLE SPECIFIC TYPE CHANGE ====================
  const handleSpecificTypeChange = (type: "COMPONENT" | "CONNECTOR") => {
    setSpecificType(type);
    setSpecificCode("");
    setSpecificName("");
  };

  // ==================== HANDLE DROPDOWN SELECTION ====================
  const handleDropdownSelect = (item: ComponentListItem) => {
    setSpecificCode(item.code);
    setSpecificName(item.name);
  };

  // ==================== FILTER & SEARCH ====================
  const applyFilters = (
    assets: ImageAsset[],
    query: string,
    type: "ALL" | "COMPONENT" | "CONNECTOR"
  ) => {
    let filtered = assets;

    if (type !== "ALL") {
      filtered = filtered.filter((asset) => asset.entityType === type);
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.entityCode.toLowerCase().includes(lowerQuery) ||
          asset.fileName.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredAssets(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    applyFilters(imageAssets, query, filterType);
  };

  const handleFilterChange = (type: "ALL" | "COMPONENT" | "CONNECTOR") => {
    setFilterType(type);
    applyFilters(imageAssets, searchQuery, type);
  };

  // ==================== BULK UPLOAD ====================
  const handleBulkFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      setBulkFiles(Array.from(files));
    }
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setBulkUploading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    bulkFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("entityType", bulkUploadType);

    try {
      const response = await fetch(`${API_BASE_URL}/api/assets/bulk-upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }

      const result: UploadResponse[] = await response.json();
      setSuccessMessage(
        `Successfully uploaded ${result.length} images for ${bulkUploadType}`
      );
      setBulkFiles([]);
      fetchImageAssets();

      const bulkInput = document.getElementById(
        "bulk-file-input"
      ) as HTMLInputElement;
      if (bulkInput) bulkInput.value = "";
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Bulk upload failed";
      setError(errorMessage);
      console.error("Bulk upload error:", err);
    } finally {
      setBulkUploading(false);
    }
  };

  // ==================== SPECIFIC UPLOAD ====================
  const handleSpecificFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setSpecificFile(file);
    }
  };

  const handleSpecificUpload = async () => {
    if (!specificFile || !specificCode.trim()) {
      setError("Please provide both a code and a file");
      return;
    }

    setSpecificUploading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("file", specificFile);
    formData.append("entityCode", specificCode.toUpperCase());
    formData.append("entityType", specificType);

    try {
      const response = await fetch(`${API_BASE_URL}/api/assets/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }

      setSuccessMessage(
        `Image for code "${specificCode}" uploaded successfully`
      );
      setSpecificCode("");
      setSpecificName("");
      setSpecificFile(null);
      fetchImageAssets();

      const specificInput = document.getElementById(
        "specific-file-input"
      ) as HTMLInputElement;
      if (specificInput) specificInput.value = "";
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      console.error("Specific upload error:", err);
    } finally {
      setSpecificUploading(false);
    }
  };

  // ==================== EXPORT TO EXCEL ====================
  const handleExportToExcel = () => {
    try {
      // Prepare data
      const dataToExport = [];

      // Add header
      dataToExport.push([
        "Entity Code",
        "Entity Name",
        "Entity Type",
        "Image File Name",
        "File Size (KB)",
        "Uploaded Date",
      ]);

      // Add all assets
      imageAssets.forEach((asset) => {
        dataToExport.push([
          asset.entityCode,
          "", // Name from list (auto-fill)
          asset.entityType,
          asset.fileName,
          (asset.fileSize / 1024).toFixed(2),
          new Date(asset.uploadedAt).toLocaleDateString(),
        ]);
      });

      // Convert to CSV
      const csvContent = dataToExport
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-assets-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMessage("Exported to CSV successfully");
    } catch (err) {
      setError("Failed to export to CSV");
      console.error("Export error:", err);
    }
  };

  // ==================== DELETE OPERATIONS ====================
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
    if (selectedForDelete.size === filteredAssets.length) {
      setSelectedForDelete(new Set());
    } else {
      setSelectedForDelete(new Set(filteredAssets.map((asset) => asset.id)));
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
      const response = await fetch(`${API_BASE_URL}/api/assets/delete-bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `Delete failed: ${response.statusText}`);
      }

      setSuccessMessage(`Successfully deleted ${idsToDelete.length} images`);
      setSelectedForDelete(new Set());
      fetchImageAssets();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Delete failed";
      setError(errorMessage);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/assets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      setSuccessMessage("Image deleted successfully");
      fetchImageAssets();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Delete failed";
      setError(errorMessage);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== DROPDOWN COMPONENT ====================
  const ComponentDropdown = ({ items, onSelect }: { items: ComponentListItem[]; onSelect: (item: ComponentListItem) => void }) => {
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
          placeholder={`Search ${specificType.toLowerCase()}s...`}
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
                No {specificType.toLowerCase()}s found
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==================== UI COMPONENTS ====================
  return (
    <div className="image-management-container">
      {/* Header */}
      <div className="im-header">
        <h1>Image Management Dashboard</h1>
        <p>Manage component and connector images for schematic rendering</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="im-alert im-alert-error">
          <strong>Error:</strong> {error}
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
          <strong>Success:</strong> {successMessage}
          <button
            onClick={() => setSuccessMessage(null)}
            className="im-alert-close"
            aria-label="Close success"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Panels */}
      <div className="im-upload-section">
        {/* Bulk Upload Card */}
        <div className="im-card im-bulk-upload">
          <div className="im-card-header">
            <h2>Bulk Image Upload</h2>
            <div className="im-type-toggles">
              <button
                className={`im-toggle ${bulkUploadType === "COMPONENT" ? "active" : ""}`}
                onClick={() => setBulkUploadType("COMPONENT")}
              >
                Component
              </button>
              <button
                className={`im-toggle ${bulkUploadType === "CONNECTOR" ? "active" : ""}`}
                onClick={() => setBulkUploadType("CONNECTOR")}
              >
                Connector
              </button>
            </div>
          </div>

          <div className="im-card-body">
            <p className="im-hint">
              Select multiple files. Filename must match component code (e.g., B3.jpg)
            </p>
            <label className="im-file-input-wrapper">
              <input
                id="bulk-file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleBulkFileSelect}
                disabled={bulkUploading}
              />
              <span className="im-file-input-label">
                <FiUpload /> Browse Images
              </span>
            </label>

            {bulkFiles.length > 0 && (
              <div className="im-file-list">
                <h4>{bulkFiles.length} file(s) selected:</h4>
                <ul>
                  {bulkFiles.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="im-btn im-btn-primary im-btn-full"
              onClick={handleBulkUpload}
              disabled={bulkFiles.length === 0 || bulkUploading}
            >
              {bulkUploading ? "Uploading..." : "Upload All"}
            </button>
          </div>
        </div>

        {/* Specific Upload Card - Enhanced with Dropdown */}
        <div className="im-card im-specific-upload">
          <div className="im-card-header">
            <h2>Upload Specific Image</h2>
            <div className="im-type-toggles">
              <button
                className={`im-toggle ${specificType === "COMPONENT" ? "active" : ""}`}
                onClick={() => handleSpecificTypeChange("COMPONENT")}
              >
                Component
              </button>
              <button
                className={`im-toggle ${specificType === "CONNECTOR" ? "active" : ""}`}
                onClick={() => handleSpecificTypeChange("CONNECTOR")}
              >
                Connector
              </button>
            </div>
          </div>

          <div className="im-card-body">
            {/* Dropdown Selection */}
            {loadingLists ? (
              <p className="im-hint">Loading available {specificType.toLowerCase()}s...</p>
            ) : (
              <>
                <label className="im-form-label">
                  Select {specificType === "COMPONENT" ? "Component" : "Connector"}
                </label>
                <ComponentDropdown
                  items={specificType === "COMPONENT" ? componentList : connectorList}
                  onSelect={handleDropdownSelect}
                />

                {specificName && (
                  <p className="im-selected-item">
                    Selected: <strong>{specificCode}</strong> - {specificName}
                  </p>
                )}
              </>
            )}

            {/* Manual Code Entry (fallback) */}
            {/* <div className="im-form-group">
              <label htmlFor="specific-code">Or Enter Code Manually</label>
              <input
                id="specific-code"
                type="text"
                placeholder="e.g., B3, ICC, S9"
                value={specificCode}
                onChange={(e) => setSpecificCode(e.target.value.toUpperCase())}
                disabled={specificUploading}
                className="im-input"
              />
            </div> */}

            {/* File Selection */}
            <label className="im-file-input-wrapper">
              <input
                id="specific-file-input"
                type="file"
                accept="image/*"
                onChange={handleSpecificFileSelect}
                disabled={specificUploading}
              />
              <span className="im-file-input-label">
                <FiUpload /> Browse Image
              </span>
            </label>

            {specificFile && (
              <p className="im-selected-file">{specificFile.name}</p>
            )}

            <button
              className="im-btn im-btn-primary im-btn-full"
              onClick={handleSpecificUpload}
              disabled={!specificFile || !specificCode || specificUploading}
            >
              {specificUploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter & Export */}
      <div className="im-search-filter">
        <div className="im-search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by code or name..."
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
        </div>

        {/* Export Button */}
        <button
          className="im-btn im-btn-secondary"
          onClick={handleExportToExcel}
          title="Export to CSV for editing"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Data Table */}
      <div className="im-table-container">
        <div className="im-table-header">
          <h3>Image Assets ({filteredAssets.length})</h3>
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
          <div className="im-loading">Loading images...</div>
        ) : filteredAssets.length === 0 ? (
          <div className="im-empty-state">
            <p>No images found. Start by uploading images using the panels above.</p>
          </div>
        ) : (
          <table className="im-table">
            <thead>
              <tr>
                <th className="im-checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedForDelete.size === filteredAssets.length}
                    onChange={toggleSelectAll}
                    aria-label="Select all images"
                  />
                </th>
                <th>Code</th>
                <th>Type</th>
                <th>Filename</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th className="im-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="im-table-row">
                  <td className="im-checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedForDelete.has(asset.id)}
                      onChange={() => toggleSelectForDelete(asset.id)}
                      aria-label={`Select ${asset.entityCode}`}
                    />
                  </td>
                  <td className="im-code-cell">
                    <strong>{asset.entityCode}</strong>
                  </td>
                  <td>
                    <span
                      className={`im-badge im-badge-${asset.entityType.toLowerCase()}`}
                    >
                      {asset.entityType}
                    </span>
                  </td>
                  <td>{asset.fileName}</td>
                  <td>{(asset.fileSize / 1024).toFixed(2)} KB</td>
                  <td>{new Date(asset.uploadedAt).toLocaleDateString()}</td>
                  <td className="im-actions-col">
                    <button
                      className="im-btn im-btn-sm im-btn-danger"
                      onClick={() => handleDeleteSingle(asset.id)}
                      title="Delete image"
                      aria-label={`Delete ${asset.entityCode}`}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="im-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="im-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete {selectedForDelete.size} image(s)? This
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