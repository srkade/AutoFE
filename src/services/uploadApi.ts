import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/uploads",  
});

export const getAllUploads = () =>
  api.get("").then(res => res.data);  

export const createUploadEntry = (data: any) =>
  api.post("", data).then(res => res.data);     

export const updateUploadEntry = (id: string, data: any) =>
  api.put(`/${id}`, data).then(res => res.data); 
