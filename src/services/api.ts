import axios, { AxiosProgressEvent } from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
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
    const res = await api.get(`/schematics/formula/json/${code}`);
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

// ✅ NEW: Harness schematic endpoint
export async function getHarnessSchematic(code: string) {
  try {
    console.log(`📡 Calling getHarnessSchematic for: ${code}`);
    const res = await api.get(`/wires/harness/${code}`);
    console.log(`✅ Harness schematic received:`, res.data);
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

// ======================
// SMART AUTO-DETECT IMPORT API
// ======================

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

/**
 * 🚀 SMART AUTO-DETECT UPLOAD
 * 
 * Upload ANY CSV/Excel file - backend automatically:
 * ✅ Extracts column names from file headers
 * ✅ Scans ALL database tables for matching columns
 * ✅ Auto-detects which table this file belongs to
 * ✅ Inserts only matching columns (handles sparse data)
 * ✅ Skips duplicates with ON CONFLICT DO NOTHING
 * 
 * Works for: wireList, serviceConnector, systems, dtcList, harnesslist, etc.
 * 
 * @param file CSV or Excel file to upload
 * @param onProgress Optional callback for upload progress (0-100)
 * @returns ImportResponse with detected table name and results
 */
export async function smartFileUpload(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ImportResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log(`📤 Uploading file for auto-detection: ${file.name}`);
    
    const res = await api.post<ImportResponse>(`/import/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt: AxiosProgressEvent) => {
        if (evt.total && onProgress) {
          const progress = Math.round((evt.loaded * 100) / evt.total);
          onProgress(progress);
          console.log(`⬆️  Upload progress: ${progress}%`);
        }
      },
    });

    console.log(
      `✅ Upload successful! Detected table: ${res.data.metadata?.detectedTable}`
    );
    return res.data;
  } catch (err: any) {
    console.error("❌ API ERROR → smartFileUpload:", err);
    const msg =
      err?.response?.data?.errorMessages?.[0] ||
      err?.message ||
      "Upload failed";
    throw new Error(msg);
  }
}

export default api;