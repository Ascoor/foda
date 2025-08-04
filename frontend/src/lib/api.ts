 import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState, useCallback } from 'react';

// token يتم حقنه من سياق المصادقة بدلاً من التخزين المحلي
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = authToken ||
    (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Here we could add global error logging
    return Promise.reject(error);
  }
);

type CacheEntry<T> = { expiry: number; data: T };
const cache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function clearCache() {
  cache.clear();
}

export async function request<T = any>(
  config: AxiosRequestConfig,
  { useCache = false, ttl = DEFAULT_TTL } = {}
): Promise<T> {
  const key = JSON.stringify({ url: config.url, method: config.method, params: config.params, data: config.data });
  if (useCache) {
    const cached = cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
  }

  const response: AxiosResponse<T> = await api.request<T>(config);
  if (useCache) {
    cache.set(key, { data: response.data, expiry: Date.now() + ttl });
  }
  return response.data;
}

export function useApi<T = any>(
  config: AxiosRequestConfig,
  options: { useCache?: boolean; ttl?: number } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);
      try {
        const result = await request<T>({ ...config, ...overrideConfig }, options);
        setData(result);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config, options]
  );

  return { data, error, loading, execute };
}

export default api;
  