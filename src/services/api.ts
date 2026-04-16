import axios, { AxiosProgressEvent } from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add a request interceptor to inject the JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    const isLoginRequest = config.url?.includes("/auth/login");
    
    if (token && !isLoginRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================
// Types
// ======================

export interface Model {
  id: string;
  companyId?: string;
  name: string;
  description?: string;
  createdAt?: string;
}

// ======================
// Existing APIs (unchanged)
// ======================

export async function getComponents(modelId?: string) {
  try {
    const res = await api.get(`/schematics/components`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR → getComponents:", err);
    throw err;
  }
}

export async function getComponentSchematic(code: string, modelId?: string) {
  try {
    const res = await api.get(`/wires/schematic/${code}`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR → getComponentSchematic:", err);
    throw err;
  }
}

export async function getSystems(modelId?: string) {
  try {
    const res = await api.get(`/schematics/systems`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR → getSystems:", err);
    throw err;
  }
}

export async function getSystemFormula(code: number | string, modelId?: string) {
  try {
    const res = await api.get(`wires/schematic/system/${code}`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR → getSystemFormula:", err);
    throw err;
  }
}

export async function getDtcs(modelId?: string) {
  try {
    const res = await api.get(`/schematics/dtcs`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR → getDtcs:", err);
    throw err;
  }
}

export async function getDtcSchematic(code: string, modelId?: string) {
  try {
    const res = await api.get(`/wires/dtc/${code}`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR → getDtcSchematic:", err);
    throw err;
  }
}

export async function getHarnesses(modelId?: string) {
  try {
    const res = await api.get(`/schematics/harnesses`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR → getHarnesses:", err);
    throw err;
  }
}

export async function getWires(modelId?: string) {
  try {
    const res = await api.get(`/schematics/wires`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR → getWires:", err);
    throw err;
  }
}

//  Harness schematic endpoint
export async function getHarnessSchematic(code: string, modelId?: string) {
  try {
    const res = await api.get(`/wires/harness/${code}`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR → getHarnessSchematic:", err);
    throw err;
  }
}

export async function getVoltageSupply(modelId?: string) {
  try {
    const res = await api.get(`/schematics/supply`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API Error-> getVoltageSupply:", err);
    throw err;
  }
}

export async function getSupplyFormula(code: string, modelId?: string) {
  try {
    const res = await api.get(`/wires/schematic/supply/${code}`, {
      params: { modelId },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR → getSupplyFormula:", err);
    throw err;
  }
}


export async function getWireDetailsByWireCode(wireCode: string, modelId?: string) {
  try {
    const res = await api.get(
      `/wires/schematic/wire/${wireCode}`,
      { params: { modelId } }
    );
    return res.data;
  } catch (err) {
    console.error("API ERROR → getWireDetailsByWireCode:", err);
    throw err;
  }
}

export async function registerUser(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  status: string;
}) {
  try {
    const res = await api.post(`/auth/register`, payload);
    return res.data;
  } catch (err) {
    console.error("API ERROR → registerUser:", err);
    throw err;
  }
}

export async function loginUser(payload: { email: string; password: string }) {
  try {
    const res = await api.post(`/auth/login`, payload);
    return res.data; // this should return LoginResponse
  } catch (err: any) {
    console.error("API ERROR → loginUser:", err);
    // Re-throw the error but ensure we preserve any response data
    if (err.response) {
      // Server responded with error status
      throw err;
    } else if (err.request) {
      // Request was made but no response received
      throw new Error("Network error: Unable to connect to server");
    } else {
      // Something else happened
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function fetchUsers() {
  try {
    const res = await api.get(`auth/users`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → fetchUsers:", err);
    throw err;
  }
}

// Update a user
export async function updateUser(id: string, payload: {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
}) {
  try {
    const token = sessionStorage.getItem("token") || "";
    const res = await api.put(`/auth/users/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err: any) {
    console.error("API ERROR → updateUser:", err);
    console.error("Response data:", err.response?.data);
    console.error("Response status:", err.response?.status);
    throw err;
  }
}

// Delete a user
export async function deleteUserById(id: string) {
  try {
    const res = await api.delete(`/auth/users/${id}`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → deleteUserById:", err);
    throw err;
  }
}

export interface ImportResponse {
  status: "success" | "error";
  inserted: number;
  duplicates: number;
  errors: number;
  total: number;
  processingTimeMs: number;
  errorMessages: string[];
  metadata?: Record<string, any>;
}


// ======================
// Model APIs
// ======================

export async function getModels(): Promise<Model[]> {
  try {
    const res = await api.get<Model[]>(`/models`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getModels:", err);
    throw err;
  }
}

export async function createModel(name: string, description?: string): Promise<Model> {
  try {
    const res = await api.post<Model>(`/models`, { name, description });
    return res.data;
  } catch (err) {
    console.error("API ERROR → createModel:", err);
    throw err;
  }
}

export async function updateModel(id: string, name: string, description?: string): Promise<void> {
  try {
    await api.put(`/models/${id}`, { name, description });
  } catch (err) {
    console.error("API ERROR → updateModel:", err);
    throw err;
  }
}

export async function deleteModel(id: string) {
  try {
    const res = await api.delete(`/models/${id}`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → deleteModel:", err);
    throw err;
  }
}

// ======================
// Model Assignment APIs
// ======================

export async function assignModelsToUser(userId: string, modelIds: string[]): Promise<void> {
  try {
    await api.post(`/models/assignments/user/${userId}`, modelIds);
  } catch (err) {
    console.error("API ERROR → assignModelsToUser:", err);
    throw err;
  }
}

export async function assignUsersToModel(modelId: string, userIds: string[]): Promise<void> {
  try {
    await api.post(`/models/assignments/model/${modelId}`, userIds);
  } catch (err) {
    console.error("API ERROR → assignUsersToModel:", err);
    throw err;
  }
}

export async function getModelsForUser(userId: string): Promise<string[]> {
  try {
    const res = await api.get<string[]>(`/models/assignments/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getModelsForUser:", err);
    throw err;
  }
}

export async function getUsersForModel(modelId: string): Promise<string[]> {
  try {
    const res = await api.get<string[]>(`/models/assignments/model/${modelId}`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getUsersForModel:", err);
    throw err;
  }
}

export async function getAssignedUserCount(modelId: string): Promise<number> {
  try {
    const res = await api.get<number>(`/models/assignments/model/${modelId}/count`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getAssignedUserCount:", err);
    return 0;
  }
}

export async function smartFileUpload(
  file: File,
  modelId?: string,
  onProgress?: (progress: number) => void,
  authorName?: string
): Promise<ImportResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (modelId) {
    formData.append("modelId", modelId);
  }
  if (authorName && authorName !== "unknown") {
    formData.append("uploadedBy", authorName);
  }

  try {

    // Get the JWT token from session storage
    const token = sessionStorage.getItem('token');

    const res = await api.post<ImportResponse>(`/import/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      onUploadProgress: (evt: AxiosProgressEvent) => {
        if (evt.total && onProgress) {
          const progress = Math.round((evt.loaded * 100) / evt.total);
          onProgress(progress);
        }
      },
    });

    return res.data;
  } catch (err: any) {
    console.error(" API ERROR → smartFileUpload:", err);
    const msg =
      err?.response?.data?.errorMessages?.[0] ||
      err?.message ||
      "Upload failed";
    throw new Error(msg);
  }
}

export async function updateUserStatus(
  id: string,
  status: string,
  token: string
) {
  try {
    const res = await api.put(
      `/auth/users/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("API ERROR → updateUserStatus:", err);
    throw err;
  }
}

export async function updateUserRole(
  id: string,
  role: string
) {
  try {
    const token = sessionStorage.getItem("token") || "";
    const res = await api.put(
      `/auth/users/${id}/role`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("API ERROR → updateUserRole:", err);
    throw err;
  }
}

// Request password reset
export async function requestPasswordReset(payload: { identifier: string }) {
  try {
    const res = await api.post(`/auth/forgot-password`, payload);
    return res.data;
  } catch (err) {
    console.error("API ERROR → requestPasswordReset:", err);
    throw err;
  }
}

// Reset password with token
export async function resetPassword(payload: { token: string; newPassword: string }) {
  try {
    const res = await api.post(`/auth/reset-password`, payload);
    return res.data;
  } catch (err) {
    console.error("API ERROR → resetPassword:", err);
    throw err;
  }
}

// System monitoring APIs
export async function getSystemUptime() {
  try {
    const res = await api.get(`/system/uptime`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getSystemUptime:", err);
    throw err;
  }
}

export async function getSystemHealth() {
  try {
    const res = await api.get(`/system/health`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getSystemHealth:", err);
    throw err;
  }
}

export async function getSystemStatus() {
  try {
    const res = await api.get(`/system/status`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getSystemStatus:", err);
    throw err;
  }
}

export async function incrementUploadSuccess() {
  try {
    const res = await api.post(`/system/stats/upload-success`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → incrementUploadSuccess:", err);
    throw err;
  }
}

export async function incrementUploadFailure() {
  try {
    const res = await api.post(`/system/stats/upload-failure`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → incrementUploadFailure:", err);
    throw err;
  }
}

export async function getUploadStats() {
  try {
    const res = await api.get(`/uploads/stats`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getUploadStats:", err);
    throw err;
  }
}

export async function getSystemConfig() {
  try {
    const res = await api.get(`/settings/config`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getSystemConfig:", err);
    throw err;
  }
}

export default api;
