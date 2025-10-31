import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api/v1",
  withCredentials: false,
});

let token: string | null = null;

export const setAuthToken = (value: string | null) => {
  token = value;
};

http.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
