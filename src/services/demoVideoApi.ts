import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface DemoVideoDTO {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: string;
    isActive: boolean;
    uploadedBy: string;
    uploadedAt: string;
}

const API_URL = `${API_BASE_URL}/demo-videos`;

export const demoVideoApi = {
    getAllVideos: async (onlyActive: boolean = false): Promise<DemoVideoDTO[]> => {
        const response = await axios.get(`${API_URL}?onlyActive=${onlyActive}`);
        return response.data;
    },

    getVideoById: async (id: string): Promise<DemoVideoDTO> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    uploadVideo: async (formData: FormData): Promise<DemoVideoDTO> => {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    deleteVideo: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    },

    updateStatus: async (id: string, isActive: boolean): Promise<DemoVideoDTO> => {
        const response = await axios.patch(`${API_URL}/${id}/status?isActive=${isActive}`);
        return response.data;
    }
};
