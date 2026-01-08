import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});


export async function getAuthorCount(){
  const response = await api.get("/auth/authors/count");
  return response.data;
}

export async function getUploadsPerUser(){
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

export async function getTotalUploads(){
  const response = await api.get("/uploads/filescount");
  return response.data;
}

export async function getUploadSuccessRate(){
  const response=await api.get("/uploads/stats");
  return response.data;
}

export async function getUploadedByUser(userId:string){
  const response=await api.get(`/uploads/uploadedByPerUser/${userId}`);
  return response.data;
}