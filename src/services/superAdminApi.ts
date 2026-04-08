import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


export async function getAuthorCount() {
  const response = await api.get("/auth/authors/count");
  return response.data;
}

export async function getUploadsPerUser() {
  try {
    const response = await api.get("/uploads/uploadedByPerUser");
    return response.data;
  } catch (error) {
    // If the specific endpoint fails, try the original one as fallback
    try {
      const response = await api.get("/uploads/per-user");
      return response.data;
    } catch (secondError) {
      console.error('Both uploads endpoints failed:', error, secondError);
      // Return empty array if both endpoints fail
      return [];
    }
  }
}

export async function getTotalUploads() {
  const response = await api.get("/uploads/filescount");
  return response.data;
}

export async function getUploadSuccessRate() {
  const response = await api.get("/uploads/stats");
  return response.data;
}

export async function getUploadedByUser(userId: string) {
  const response = await api.get(`/uploads/uploadedByPerUser/${userId}`);
  return response.data;
}

// New Dashboard Endpoints
export async function getRecentActivity(limit = 50) {
  const response = await api.get(`/user-activity/recent?limit=${limit}`);
  return response.data;
}

export async function getActivityDistribution() {
  const response = await api.get(`/user-activity/type-distribution`);
  return response.data;
}

export async function getRecentActivities() {
   const response = await api.get(`/user-activity/recent`);
   return response.data;
}

export async function getActiveUserTrends(days = 7) {
  const response = await api.get(`/user-activity/active-user-trends?days=${days}`);
  return response.data;
}

export async function getDatabaseStats() {
  const response = await api.get(`/database/stats`);
  return response.data;
}

export async function getDatabaseSize() {
  const response = await api.get(`/database/size`);
  return response.data;
}

export async function analyzeDatabase() {
  const response = await api.post(`/database/maintenance/analyze`);
  return response.data;
}

export async function vacuumDatabase() {
  const response = await api.post(`/database/maintenance/vacuum`);
  return response.data;
}

export async function pruneActivityLogs() {
  const response = await api.post(`/database/maintenance/prune-logs`);
  return response.data;
}