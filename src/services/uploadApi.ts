import axios from "axios";
import { incrementUploadSuccess, incrementUploadFailure } from "./api";

const api = axios.create({
  baseURL: "http://localhost:8080/api/uploads",  
});

export const getAllUploads = () =>
  api.get("").then(res => res.data);  // Fixed: empty string instead of space

export const getUploadsByUser = () =>
  api.get("/uploadedByPerUser").then(res => res.data);  

export const createUploadEntry = (data: any) =>
  api.post("", data).then(res => res.data);     

export const updateUploadEntry = (id: string, data: any) =>
  api.put(`/${id}`, data).then(res => res.data); 

export const deleteUploadById = async (id: string) => {
  await axios.delete(`http://localhost:8080/api/uploads/${id}`);
};
export const fetchUploadFile = async (id: string) => {
  const res = await api.get(`/${id}/view`, {
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


