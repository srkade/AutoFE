import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

export async function getComponents() {
  try {
    const res = await api.get(`/schematics/components`); 
    return res.data;
  } catch (err) {
    console.error("API ERROR → getComponents:", err);
    throw err;
  }
}


export default api;
