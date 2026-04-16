import React, { useState, useEffect } from 'react';
import { fetchTableData, updateTableData } from '../services/tableApi';
import { FiX, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import './TableEditorModal.css';

interface TableEditorModalProps {
  tableName: string;
  onClose: () => void;
  onSave?: () => void;
  modelId?: string;
}

const TableEditorModal: React.FC<TableEditorModalProps> = ({ tableName, onClose, onSave, modelId }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result: any = await fetchTableData(tableName, modelId);
        setData(result.data || []);
        setHeaders(result.headers || []);
      } catch (err) {
        console.error("Failed to load table data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tableName, modelId]);

  const handleCellChange = (rowIndex: number, header: string, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [header]: value };
    setData(newData);
  };

  const addRow = () => {
    const newRow = headers.reduce((acc, h) => ({ ...acc, [h]: "" }), {});
    setData([newRow, ...data]);
  };

  const removeRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Filter out model_id from data before sending (backend adds it automatically)
      const filteredData = data.map(row => {
        const { model_id, ...rest } = row;
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
    <div className="table-editor-overlay">
      <div className="table-editor-container">
        <div className="table-editor-header">
          <h2>📝 Editing: {tableName}</h2>
          <div className="header-actions">
            <button className="btn-add" onClick={addRow}><FiPlus /> Add Row</button>
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : <><FiSave /> Save Changes</>}
            </button>
            <button className="btn-close" onClick={onClose}><FiX /></button>
          </div>
        </div>

        <div className="table-editor-content">
          {loading ? (
            <div className="loader-container">Loading data...</div>
          ) : (
            <table className="excel-table">
              <thead>
                <tr>
                  <th>#</th>
                  {headers.map(h => <th key={h}>{h}</th>)}
                  <th>Action</th>
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
                    <td>
                      <FiTrash2 className="row-delete" onClick={() => removeRow(rowIndex)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableEditorModal;
