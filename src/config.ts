/**
 * Central configuration for API endpoints
 */

const isProduction = process.env.NODE_ENV === 'production';

// The base URL for the backend API
// Updated to use the new HTTPS domain provided by the user
// export const API_BASE_URL = "https://api.crazybeesinnovation.com/api";
export const API_BASE_URL = "http://localhost:8080/api";


export default {
  API_BASE_URL,
};
