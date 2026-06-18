import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { apiClient } from "./lib/api";

console.log("API Base URL:", import.meta.env.VITE_API_URL);

// Startup check for VITE_API_URL
if (!import.meta.env.VITE_API_URL) {
  console.warn("⚠️ STARTUP WARNING: VITE_API_URL is undefined. API calls will use relative paths or fail. Please check your environment variables in Vercel.");
} else {
  // Fire-and-forget wake up ping for Render free tier
  apiClient.get("/health").catch(() => {});
}

createRoot(document.getElementById("root")!).render(<App />);
