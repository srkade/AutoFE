import React, { useState, useEffect, useRef } from 'react';
import { fetchTableData, updateTableData } from '../services/tableApi';
import { 
  FiX, 
  FiSave, 
  FiPlus, 
  FiTrash2, 
  FiMaximize2, 
  FiMinimize2, 
  FiDownload, 
  FiUpload, 
  FiTrash,
  FiCornerUpLeft,
  FiCornerUpRight
} from 'react-icons/fi';
import * as XLSX from 'xlsx';
import './TableEditorModal.css';

interface TableEditorModalProps {
  tableName: string;
  onClose: () => void;
  onSave?: () => void;
  modelId?: string;
}

interface EditorState {
  data: any[];
  headers: string[];
}

const TableEditorModal: React.FC<TableEditorModalProps> = ({ tableName, onClose, onSave, modelId }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isMaximized, setIsMaximized] = useState(false);
  const [newColName, setNewColName] = useState("");
  
  // Excel Undo & Redo stacks
  const [history, setHistory] = useState<EditorState[]>([]);
  const [future, setFuture] = useState<EditorState[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result: any = await fetchTableData(tableName, modelId);
        const initialData = result.data || [];
        const initialHeaders = result.headers || [];
        setData(initialData);
        setHeaders(initialHeaders);
      } catch (err) {
        console.error("Failed to load table data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tableName, modelId]);

  // Transaction helper to push state to history
  const pushState = (newData: any[], newHeaders: string[] = headers) => {
    setHistory(prev => [...prev, { data, headers }]);
    setFuture([]); // Clear redo stack on new action
    setData(newData);
    setHeaders(newHeaders);
  };

  // Undo action
  const handleUndo = () => {
    if (history.length === 0) return;
    
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setFuture(prev => [...prev, { data, headers }]);
    
    setData(previous.data);
    setHeaders(previous.headers);
  };

  // Redo action
  const handleRedo = () => {
    if (future.length === 0) return;
    
    const next = future[future.length - 1];
    setFuture(prev => prev.slice(0, -1));
    setHistory(prev => [...prev, { data, headers }]);
    
    setData(next.data);
    setHeaders(next.headers);
  };

  // Excel Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (isCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (isCtrl && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, future, data, headers]);

  const handleCellChange = (rowIndex: number, header: string, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [header]: value };
    pushState(newData);
  };

  const addRow = () => {
    const newRow = headers.reduce((acc, h) => ({ ...acc, [h]: "" }), {});
    pushState([...data, newRow]); // Excel appends at the bottom
  };

  const removeRow = (index: number) => {
    pushState(data.filter((_, i) => i !== index));
  };

  const handleAddColumn = () => {
    const trimmed = newColName.trim();
    if (!trimmed) {
      alert("Please enter a valid column name.");
      return;
    }
    if (headers.includes(trimmed)) {
      alert("Column already exists.");
      return;
    }
    const newHeaders = [...headers, trimmed];
    const newData = data.map(row => ({ ...row, [trimmed]: "" }));
    pushState(newData, newHeaders);
    setNewColName("");
  };

  const removeColumn = (colName: string) => {
    const confirm = window.confirm(`Are you sure you want to delete column "${colName}"?`);
    if (!confirm) return;
    const newHeaders = headers.filter(h => h !== colName);
    const newData = data.map(row => {
      const { [colName]: _, ...rest } = row;
      return rest;
    });
    pushState(newData, newHeaders);
  };

  const clearTable = () => {
    const confirm = window.confirm("Are you sure you want to clear all rows?");
    if (confirm) {
      pushState([]);
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsedData: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
        
        if (parsedData.length > 0) {
          const keys = Object.keys(parsedData[0]);
          const cleanKeys = keys.filter(k => k !== 'model_id' && k !== 'id');
          pushState(parsedData, cleanKeys);
          alert("Imported successfully! Click 'Save Changes' to update in database.");
        } else {
          alert("The uploaded file is empty.");
        }
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Failed to parse the file. Make sure it is a valid CSV or Excel file.");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleExportExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${tableName}_export.xlsx`);
    } catch (error) {
      console.error("Failed to export:", error);
      alert("Failed to export Excel file.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const filteredData = data.map(row => {
        const { model_id, id, ...rest } = row;
        return rest;
      });
      
      await updateTableData(tableName, filteredData, modelId);
      alert("Table updated successfully!");
      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save table:", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`table-editor-overlay ${isMaximized ? 'maximized' : ''}`}>
      <div className={`table-editor-container ${isMaximized ? 'maximized' : ''}`}>
        
        {/* HEADER BAR */}
        <div className="table-editor-header">
          <div className="title-section">
            <h2>📝 Excel Editor: {tableName}</h2>
          </div>
          <div className="header-actions">
            <button className="btn-maximize" onClick={() => setIsMaximized(!isMaximized)} title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}>
              {isMaximized ? <FiMinimize2 /> : <FiMaximize2 />}
              {isMaximized ? "Restore" : "Fullscreen"}
            </button>
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : <><FiSave /> Save Changes</>}
            </button>
            <button className="btn-close" onClick={onClose} title="Close"><FiX /></button>
          </div>
        </div>

        {/* SUB-TOOLBAR FOR SPREADSHEET CONTROLS */}
        <div className="spreadsheet-toolbar">
          <div className="toolbar-left">
            <button className="btn-add" onClick={addRow}><FiPlus /> Add Row</button>
            <button className="btn-clear" onClick={clearTable}><FiTrash /> Clear Rows</button>
            <div className="column-adder">
              <input
                type="text"
                placeholder="New Column Name"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
              />
              <button onClick={handleAddColumn} title="Add Column"><FiPlus /> Col</button>
            </div>

            {/* Excel Separator & Undo / Redo Actions */}
            <div className="divider"></div>
            <button 
              className="btn-undo" 
              onClick={handleUndo} 
              disabled={history.length === 0} 
              title="Undo (Ctrl+Z)"
            >
              <FiCornerUpLeft /> Undo
            </button>
            <button 
              className="btn-redo" 
              onClick={handleRedo} 
              disabled={future.length === 0} 
              title="Redo (Ctrl+Y)"
            >
              <FiCornerUpRight /> Redo
            </button>
          </div>
          
          <div className="toolbar-right">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.xlsx,.xls"
              onChange={handleImportExcel}
              style={{ display: 'none' }}
            />
            <button className="btn-import" onClick={() => fileInputRef.current?.click()} title="Import Excel/CSV file into editor">
              <FiUpload /> Import Excel/CSV
            </button>
            <button className="btn-export" onClick={handleExportExcel} title="Export current editor data to Excel file">
              <FiDownload /> Export Excel
            </button>
          </div>
        </div>

        {/* WORKSPACE CONTENT */}
        <div className="table-editor-content">
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <span>Loading data sheet...</span>
            </div>
          ) : (
            <div className="table-scroll-container">
              <table className="excel-table">
                <thead>
                  <tr>
                    <th className="corner-hdr">#</th>
                    {headers.map(h => (
                      <th key={h} className="col-hdr">
                        <div className="col-hdr-content">
                          <span>{h}</span>
                          <FiTrash2 className="col-delete-btn" onClick={() => removeColumn(h)} title={`Delete column "${h}"`} />
                        </div>
                      </th>
                    ))}
                    <th className="action-hdr">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="row-num">{rowIndex + 1}</td>
                      {headers.map(header => (
                        <td key={header}>
                          <input
                            type="text"
                            value={row[header] || ""}
                            onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                          />
                        </td>
                      ))}
                      <td className="row-action-cell">
                        <FiTrash2 className="row-delete" onClick={() => removeRow(rowIndex)} title="Delete row" />
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={headers.length + 2} className="empty-grid-msg">
                        📭 Empty Sheet. Click "Add Row" or "Import Excel/CSV" to start editing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableEditorModal;
