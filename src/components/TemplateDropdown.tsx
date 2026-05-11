import React, { useState, useRef, useEffect } from 'react';
import { FiDownload, FiChevronDown, FiFileText, FiInfo } from 'react-icons/fi';
import { downloadTemplate } from '../services/api';
import '../Styles/TemplateDropdown.css';

const TemplateDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const templates = [
    { name: 'Wire List (Circuit Connections)', id: 'wirelist', filename: 'wirelist_template.xlsx' },
    { name: 'Service Connectors', id: 'serviceconnector', filename: 'serviceconnector_template.xlsx' },
    { name: 'Wires (Base Codes)', id: 'wires', filename: 'wires_template.xlsx' },
    { name: 'Harness List', id: 'harnesslist', filename: 'harnesslist_template.xlsx' },
    { name: 'DTC List', id: 'dtclist', filename: 'dtclist_template.xlsx' },
    { name: 'Systems List', id: 'systems', filename: 'systems_template.xlsx' },
    { name: 'Voltage Supply', id: 'voltagesupply', filename: 'voltagesupply_template.xlsx' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async (typeId: string, filename: string) => {
    try {
      setIsDownloading(typeId);
      const blob = await downloadTemplate(typeId);
      
      // Create a link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Template download failed:", error);
      alert("Failed to download template. Please try again.");
    } finally {
      setIsDownloading(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="template-dropdown-container" ref={dropdownRef}>
      <button className="template-btn" onClick={() => setIsOpen(!isOpen)}>
        <FiDownload />
        Download Templates
        <FiChevronDown />
      </button>

      {isOpen && (
        <div className="template-menu">
          <div className="template-section">
            <h4>Generate Excel Templates</h4>
            <div className="template-list">
              {templates.map((template) => (
                <button
                  key={template.id}
                  className="template-item"
                  style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => handleDownload(template.id, template.filename)}
                  disabled={isDownloading !== null}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FiFileText className="template-item-icon" />
                    {template.name}
                  </span>
                  {isDownloading === template.id ? (
                    <div className="spinner" style={{ width: '14px', height: '14px', border: '2px solid #ccc', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  ) : (
                    <FiDownload size={14} style={{ opacity: 0.5 }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="template-instructions">
            <p><FiInfo style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Instructions</p>
            <ul>
              <li>Templates are <b>dynamically generated</b> with demo data.</li>
              <li>All <b>Connector codes</b> MUST start with <span className="connector-tip">"X"</span> (e.g., XE1).</li>
              <li>Headers must match the first row of the template.</li>
              <li>Instructions are included at the end of each Excel file.</li>
            </ul>
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TemplateDropdown;
