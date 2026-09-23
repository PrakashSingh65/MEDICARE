import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const axiosClient = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
});