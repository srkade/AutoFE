import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/table";

/**
 * Fetch all data from a dynamic table
 */
export const fetchTableData = async (tableName: string): Promise<any[]> => {
  const response = await axios.get(`${API_BASE_URL}/${tableName}`);
  return response.data;
};

/**
 * Replace all data in a dynamic table
 */
export const updateTableData = async (tableName: string, rows: any[]): Promise<any> => {
  const response = await axios.post(`${API_BASE_URL}/${tableName}/update`, rows);
  return response.data;
};
