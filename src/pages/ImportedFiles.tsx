import React, { useState, ChangeEvent } from "react";

export interface UploadedFile {
  id: number;
  name: string;
  size: number; // in bytes
  uploadedAt: Date;
}

export default function ImportFiles() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const newFile: UploadedFile = {
      id: Date.now(),
      name: selectedFile.name,
      size: selectedFile.size,
      uploadedAt: new Date(),
    };

    setUploadedFiles([newFile, ...uploadedFiles]);
    setSelectedFile(null);
  };

  const handleDelete = (id: number) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Import Files</h2>

      {/* File Upload Form */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          maxWidth: "400px",
          background: "#f9f9f9",
        }}
      >
        <input
          type="file"
          onChange={handleFileChange}
          style={{ marginBottom: "10px" }}
        />
        <button
          onClick={handleUpload}
          style={{
            padding: "8px 12px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </div>

      {/* Uploaded Files Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
        <thead>
          <tr style={{ background: "#e9ecef" }}>
            <th style={th}>File Name</th>
            <th style={th}>Size (KB)</th>
            <th style={th}>Uploaded At</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {uploadedFiles.map((file) => (
            <tr key={file.id}>
              <td style={td}>{file.name}</td>
              <td style={td}>{(file.size / 1024).toFixed(2)}</td>
              <td style={td}>{file.uploadedAt.toLocaleString()}</td>
              <td style={td}>
                <button
                  style={btnDelete}
                  onClick={() => handleDelete(file.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {uploadedFiles.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "10px" }}>
                No files uploaded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px", border: "1px solid #ccc", textAlign: "left" };
const td: React.CSSProperties = { padding: "8px", border: "1px solid #ddd" };
const btnDelete: React.CSSProperties = { padding: "6px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
