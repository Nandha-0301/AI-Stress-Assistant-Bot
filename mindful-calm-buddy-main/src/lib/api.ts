import axios from "axios";

// In development, fallback to local backend. In production (Vercel), STRICTLY require VITE_API_URL.
export const BACKEND_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://127.0.0.1:5000" : "");

if (!BACKEND_URL) {
  console.warn("⚠️ CRITICAL WARNING: VITE_API_URL is missing in the environment variables! API calls may fail.");
}

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 60000, // 60 second timeout for Render cold starts
});

export default apiClient;
