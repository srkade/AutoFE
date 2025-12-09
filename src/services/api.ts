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

//  Harness schematic endpoint
export async function getHarnessSchematic(code: string) {
  try {
    console.log(`📡 Calling getHarnessSchematic for: ${code}`);
    const res = await api.get(`/wires/harness/${code}`);
    console.log(` Harness schematic received:`, res.data);
    return res.data;
  } catch (err) {
    console.error("API ERROR → getHarnessSchematic:", err);
    throw err;
  }
}

export async function getVoltageSupply(){
  try{
    const res=await api.get(`/schematics/supply`);
    return res.data;
  }catch (err){
    console.error("API Error-> getVoltageSupply:",err);
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
  } catch (err) {
    console.error("API ERROR → loginUser:", err);
    throw err;
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
    const res = await api.put(`/auth/users/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error("API ERROR → updateUser:", err);
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

export default api;
