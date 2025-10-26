import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { setAuthToken as setLegacyAuthToken } from "@shared/lib/api";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  "http://127.0.0.1:8000/api/v1";

export const API_BASE_URL = rawBaseUrl;
export const REALTIME_URL =
  import.meta.env.VITE_REALTIME_URL ?? rawBaseUrl.replace(/\/api(?:\/v1)?$/, "");

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  setLegacyAuthToken(token);
};

const applyAuthorization = <
  T extends AxiosRequestConfig | InternalAxiosRequestConfig,
>(config: T): T => {
  const token =
    authToken ??
    (typeof window !== "undefined"
      ? window.localStorage.getItem("token") ||
        window.localStorage.getItem("access_token")
      : null);

  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  return config;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: rawBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(applyAuthorization);
axios.interceptors.request.use(applyAuthorization);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("access_token");
    }

    return Promise.reject(error);
  },
);

export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export type ApiClient = typeof apiClient;

