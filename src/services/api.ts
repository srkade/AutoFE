import axios, { AxiosProgressEvent } from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  // baseURL: "http://13.205.92.12:8080/api",
  timeout: 10000,
});

// ======================
// Existing APIs (unchanged)
// ======================

export async function getComponents() {
  try {
    const res = await api.get(`/schematics/components`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getComponents:", err);
    throw err;
  }
}

export async function getComponentSchematic(code: string) {
  try {
    const res = await api.get(`/wires/schematic/${code}`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getComponentSchematic:", err);
    throw err;
  }
}

export async function getSystems() {
  try {
    const res = await api.get(`/schematics/systems`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getComponents:", err);
    throw err;
  }
}

export async function getSystemFormula(code: number) {
  try {
    const res = await api.get(`wires/schematic/system/${code}`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getSystemFormula:", err);
    throw err;
  }
}

export async function getDtcs() {
  try {
    const res = await api.get(`/schematics/dtcs`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getDtcs:", err);
    throw err;
  }
}

export async function getDtcSchematic(code: string) {
  try {
    const res = await api.get(`/wires/dtc/${code}`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getDtcSchematic:", err);
    throw err;
  }
}

export async function getHarnesses() {
  try {
    const res = await api.get(`/schematics/harnesses`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getHarnesses:", err);
    throw err;
  }
}

export async function getWires() {
  try {
    const res = await api.get(`/schematics/wires`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getWires:", err);
    throw err;
  }
}

//  Harness schematic endpoint
export async function getHarnessSchematic(code: string) {
  try {
    const res = await api.get(`/wires/harness/${code}`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getHarnessSchematic:", err);
    throw err;
  }
}

export async function getVoltageSupply() {
  try {
    const res = await api.get(`/schematics/supply`);
    return res.data;
  } catch (err) {
    console.error("API Error-> getVoltageSupply:", err);
    throw err;
  }
}

export async function getSupplyFormula(code: string) {
  try {
    const res = await api.get(`/wires/schematic/supply/${code}`);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getSupplyFormula:", err);
    throw err;
  }
}


export async function getWireDetailsByWireCode(wireCode: string) {
  try {
    const res = await api.get(
      `/wires/schematic/wire/${wireCode}`
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


export async function smartFileUpload(
  file: File,
  onProgress?: (progress: number) => void,
  authorName?: string
): Promise<ImportResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (authorName && authorName !== "unknown") {
    // Send the author name to the backend
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
