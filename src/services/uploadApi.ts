import api from "./api";
import { incrementUploadSuccess, incrementUploadFailure } from "./api";

export const getAllUploads = () =>
  api.get("/uploads").then(res => res.data);

export const getUploadsByUser = () =>
  api.get("/uploads/uploadedByPerUser").then(res => res.data);

export const createUploadEntry = (data: any) =>
  api.post("/uploads", data).then(res => res.data);

export const updateUploadEntry = (id: string, data: any) =>
  api.put(`/uploads/${id}`, data).then(res => res.data);

export const deleteUploadById = (id: string) =>
  api.delete(`/uploads/${id}`).then(res => res.data);

export const fetchUploadFile = async (id: string) => {
  const res = await api.get(`/uploads/${id}/view`, {
    responseType: "blob",
  });
  return res.data;
};

// Enhanced upload functions that also track statistics
export const trackSuccessfulUpload = async () => {
  try {
    await incrementUploadSuccess();
  } catch (error) {
    console.error("Failed to track successful upload:", error);
  }
};

export const trackFailedUpload = async () => {
  try {
    await incrementUploadFailure();
  } catch (error) {
    console.error("Failed to track failed upload:", error);
  }
};


