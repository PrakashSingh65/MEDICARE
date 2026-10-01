import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const axiosClient = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
});

// Request interceptor to attach Authorization header if token is stored in localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("medicare_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to store token and handle auth state
axiosClient.interceptors.response.use(
  (response) => {
    if (response?.data?.token) {
      localStorage.setItem("medicare_token", response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      if (url.includes("/checkAuth") || url.includes("/login")) {
        localStorage.removeItem("medicare_token");
      }
    }
    return Promise.reject(error);
  }
);