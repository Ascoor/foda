import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState, useCallback, useEffect, useRef } from 'react';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token =
    authToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

type CacheEntry<T> = { expiry: number; data: T };
const cache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL = 5 * 60 * 1000;

export function clearCache() {
  cache.clear();
}

export async function request<T = unknown>(
  config: AxiosRequestConfig,
  { useCache = false, ttl = DEFAULT_TTL } = {},
): Promise<T> {
  const key = JSON.stringify({
    url: config.url,
    method: config.method,
    params: config.params,
    data: config.data,
  });

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

export function useApi<T = unknown>(
  config: AxiosRequestConfig,
  options: { useCache?: boolean; ttl?: number } = {},
) {
  const configRef = useRef(config);
  const optionsRef = useRef(options);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (overrideConfig?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);
    try {
      const baseConfig = configRef.current;
      const finalConfig = { ...baseConfig, ...overrideConfig };
      const result = await request<T>(finalConfig, optionsRef.current);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, execute };
}

export default api;
