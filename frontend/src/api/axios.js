import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://research-publication-backend.onrender.com"
    : "http://localhost:5000");

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach the JWT token (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;