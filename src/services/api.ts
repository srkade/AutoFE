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


export async function getVoltageSupply(){
  try{
    const res=await api.get(`/schematics/supply`);
    return res.data;
  }catch (err){
    console.error("API Error-> getVoltageSupply:",err);
    throw err;
  }
}


export default api;
