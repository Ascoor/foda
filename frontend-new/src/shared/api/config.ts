import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333/api";

export const REALTIME_URL =
  import.meta.env.VITE_REALTIME_URL ?? API_BASE_URL.replace(/\/api$/, "");

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const applyAuthorization = <T extends AxiosRequestConfig | InternalAxiosRequestConfig>(
  config: T,
): T => {
  const token =
    authToken ??
    (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);

  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  return config;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
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
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }

    return Promise.reject(error);
  },
);

export interface ApiResponse<T> {
  data: T;
  success: boolean;
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

export { apiClient };
