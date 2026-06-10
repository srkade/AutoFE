import localforage from 'localforage';
import { SchematicData } from '../components/Schematic/SchematicTypes';

// Configure localforage instance
const storage = localforage.createInstance({
  name: "SchematicOfflineStore"
});

export interface OfflineSchematicRecord {
  id: string;
  name: string;
  date: number;
  dataString: string;
}

export const offlineStorageService = {
  async saveSchematic(id: string, name: string, data: SchematicData): Promise<void> {
    const dataString = JSON.stringify(data);
    
    const record: OfflineSchematicRecord = {
      id,
      name,
      date: Date.now(),
      dataString
    };
    
    await storage.setItem(id, record);
  },

  async loadSchematic(id: string): Promise<SchematicData> {
    const record: OfflineSchematicRecord | null = await storage.getItem(id);
    if (!record) {
      throw new Error("Schematic not found in offline storage");
    }

    try {
      return JSON.parse(record.dataString) as SchematicData;
    } catch (err) {
      throw new Error("Corrupted data");
    }
  },

  async getStoredSchematics(): Promise<Omit<OfflineSchematicRecord, 'dataString'>[]> {
    const keys = await storage.keys();
    const records: Omit<OfflineSchematicRecord, 'dataString'>[] = [];
    
    for (const key of keys) {
      const record: OfflineSchematicRecord | null = await storage.getItem(key);
      if (record) {
        records.push({
          id: record.id,
          name: record.name,
          date: record.date
        });
      }
    }
    
    return records.sort((a, b) => b.date - a.date);
  },

  async deleteSchematic(id: string): Promise<void> {
    await storage.removeItem(id);
  }
};
