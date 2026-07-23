import axios from "axios";

let rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
rawUrl = rawUrl.trim().replace(/\/+$/, "");
if (!rawUrl.endsWith("/api")) {
  rawUrl = `${rawUrl}/api`;
}

const client = axios.create({
  baseURL: rawUrl,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
