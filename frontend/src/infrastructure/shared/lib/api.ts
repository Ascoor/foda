import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useState, useCallback, useEffect, useRef } from "react";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;

  if (token) {
    api.defaults.headers.common = api.defaults.headers.common || {};
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else if (api.defaults.headers.common) {
    delete (api.defaults.headers.common as Record<string, unknown>)
      .Authorization;
  }
};

const rawBaseURL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

const { resolvedBaseURL, apiPrefix } = (() => {
  try {
    const parsed = new URL(rawBaseURL);
    return {
      resolvedBaseURL: parsed.origin,
      apiPrefix: parsed.pathname.replace(/\/+$/, ""),
    };
  } catch (error) {
    return {
      resolvedBaseURL: rawBaseURL,
      apiPrefix: "",
    };
  }
})();

const api: AxiosInstance = axios.create({
  baseURL: resolvedBaseURL,
  headers: {
    Accept: "application/json",
  },
});

axios.defaults.baseURL = rawBaseURL;
axios.defaults.headers.common = axios.defaults.headers.common || {};
axios.defaults.headers.common.Accept = "application/json";

const ensureLeadingSlash = (value: string) =>
  value.startsWith("/") ? value : `/${value}`;

const joinWithPrefix = (suffix: string) => {
  const normalizedPrefix = ensureLeadingSlash(apiPrefix);
  const sanitizedSuffix = suffix.startsWith("/") ? suffix.slice(1) : suffix;
  return `${normalizedPrefix}/${sanitizedSuffix}`.replace(/\/{2,}/g, "/");
};

const normalizeUrl = (url?: string) => {
  if (!url || /^https?:\/\//i.test(url) || !apiPrefix) {
    return url;
  }

  const normalizedPrefix = ensureLeadingSlash(apiPrefix);

  if (url.startsWith("/")) {
    if (url.startsWith(normalizedPrefix)) {
      return url;
    }
    return joinWithPrefix(url.slice(1));
  }

  return joinWithPrefix(url);
};

const withAuthorizationHeader = <
  T extends AxiosRequestConfig | InternalAxiosRequestConfig,
>(
  config: T,
): T => {
  const token =
    authToken ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, unknown>).Authorization =
      `Bearer ${token}`;
  } else if (config.headers && "Authorization" in config.headers) {
    delete (config.headers as Record<string, unknown>).Authorization;
  }

  return config;
};

axios.interceptors.request.use(withAuthorizationHeader);
api.interceptors.request.use(withAuthorizationHeader);

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
  const normalizedConfig: AxiosRequestConfig = {
    ...config,
    url: normalizeUrl(config.url),
  };

  const key = JSON.stringify({
    url: normalizedConfig.url,
    method: normalizedConfig.method,
    params: normalizedConfig.params,
    data: normalizedConfig.data,
  });

  if (useCache) {
    const cached = cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
  }

  const response: AxiosResponse<T> = await api.request<T>(normalizedConfig);

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
