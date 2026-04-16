import axios from "axios";
import { API_BASE_URL } from "../config";

const TABLE_API_URL = `${API_BASE_URL}/table`;

/**
 * Fetch all data from a dynamic table
 */
export const fetchTableData = async (tableName: string, modelId?: string): Promise<any[]> => {
  const params = modelId ? { modelId } : {};
  const token = sessionStorage.getItem('token');
  const headers: any = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await axios.get(`${TABLE_API_URL}/${tableName}`, { params, headers });
  return response.data;
};

/**
 * Replace all data in a dynamic table
 */
export const updateTableData = async (tableName: string, rows: any[], modelId?: string): Promise<any> => {
  const params = modelId ? { modelId } : {};
  const token = sessionStorage.getItem('token');
  const headers: any = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await axios.post(`${TABLE_API_URL}/${tableName}/update`, rows, { params, headers });
  return response.data;
};
