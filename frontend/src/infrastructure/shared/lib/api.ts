import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";
import { useState, useCallback, useEffect, useRef } from "react";

import { getActiveCampaignId } from "@/infrastructure/shared/lib/campaign";
import { toast } from "@/infrastructure/shared/ui/use-toast";

const DEFAULT_API_URL = "http://localhost:8000/api/v1";
const rawBaseURL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

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

const SKIP_MIDDLEWARE_FLAG = "__skipApiMiddleware" as const;

const api: AxiosInstance = axios.create({
  baseURL: resolvedBaseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

axios.defaults.baseURL = resolvedBaseURL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common = axios.defaults.headers.common || {};
axios.defaults.headers.common.Accept = "application/json";

api.defaults.headers.common = api.defaults.headers.common || {};
api.defaults.headers.common.Accept = "application/json";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;

  const apply = (headers: Record<string, unknown>) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if ("Authorization" in headers) {
      delete headers.Authorization;
    }
  };

  apply(api.defaults.headers.common as Record<string, unknown>);
  apply(axios.defaults.headers.common as Record<string, unknown>);
};

export interface ApiResponse<T> {
  status: string;
  data: T;
  meta?: Record<string, unknown>;
  errors?: string[];
}

export type ApiErrorResponse = {
  status?: string;
  data?: unknown;
  errors?: unknown;
  meta?: Record<string, unknown> | null;
  message?: string;
};

type RequestConfig<T extends AxiosRequestConfig | InternalAxiosRequestConfig> = T & {
  [SKIP_MIDDLEWARE_FLAG]?: boolean;
};

const ensureLeadingSlash = (value: string) =>
  value.startsWith("/") ? value : `/${value}`;

const joinWithPrefix = (suffix: string) => {
  if (!apiPrefix) return ensureLeadingSlash(suffix);
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

const HTTP_METHODS_REQUIRING_CSRF = new Set(["post", "put", "patch", "delete"]);

const methodRequiresCsrf = (
  config: AxiosRequestConfig | InternalAxiosRequestConfig,
): boolean => {
  const method = (config.method ?? "get").toLowerCase();
  return HTTP_METHODS_REQUIRING_CSRF.has(method);
};

let csrfPromise: Promise<void> | null = null;

const sanctumEndpoint = (() => {
  try {
    return new URL("/sanctum/csrf-cookie", resolvedBaseURL).toString();
  } catch (error) {
    return `${resolvedBaseURL.replace(/\/$/, "")}/sanctum/csrf-cookie`;
  }
})();

export const prepareCsrf = async (): Promise<void> => {
  if (!csrfPromise) {
    const config: RequestConfig<AxiosRequestConfig> = {
      method: "get",
      url: sanctumEndpoint,
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    };
    config[SKIP_MIDDLEWARE_FLAG] = true;

    csrfPromise = axios
      .request(config)
      .finally(() => {
        csrfPromise = null;
      })
      .then(() => undefined);
  }

  await csrfPromise;
};

const withAuthorizationHeader = <
  T extends RequestConfig<AxiosRequestConfig | InternalAxiosRequestConfig>,
>(config: T): T => {
  const token =
    authToken ||
    (typeof window !== "undefined" ? window.localStorage.getItem("token") : null);

  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, unknown>).Authorization = `Bearer ${token}`;
  } else if (config.headers && "Authorization" in config.headers) {
    delete (config.headers as Record<string, unknown>).Authorization;
  }

  return config;
};

const ensureCampaignHeaders = <
  T extends RequestConfig<AxiosRequestConfig | InternalAxiosRequestConfig>,
>(config: T): T => {
  config.headers = config.headers || {};

  const resolveCampaignId = (): string => {
    try {
      const current = getActiveCampaignId();
      if (current && current.trim()) {
        return current;
      }
    } catch (error) {
      // swallow - fallback below
    }

    if (typeof window !== "undefined") {
      const legacy = window.localStorage.getItem("campaign_id");
      if (legacy && legacy.trim()) {
        return legacy;
      }
    }

    return "1";
  };

  const campaignId = resolveCampaignId();

  (config.headers as Record<string, unknown>)["X-Campaign-Id"] = campaignId;
  (config.headers as Record<string, unknown>)["X-Requested-With"] = "XMLHttpRequest";

  if (typeof window !== "undefined") {
    const slug = window.localStorage.getItem("campaign_slug");
    if (slug && slug.trim()) {
      (config.headers as Record<string, unknown>)["X-Campaign-Slug"] = slug.trim();
    } else if ("X-Campaign-Slug" in (config.headers as Record<string, unknown>)) {
      delete (config.headers as Record<string, unknown>)["X-Campaign-Slug"];
    }
  }

  return config;
};

const enhanceRequestConfig = async <
  T extends RequestConfig<AxiosRequestConfig | InternalAxiosRequestConfig>,
>(config: T): Promise<T> => {
  if (config[SKIP_MIDDLEWARE_FLAG]) {
    return config;
  }

  let next = withAuthorizationHeader(config);
  next = ensureCampaignHeaders(next);

  next.headers = next.headers || {};
  if (!("Accept" in next.headers)) {
    (next.headers as Record<string, unknown>).Accept = "application/json";
  }

  next.withCredentials = true;

  if (methodRequiresCsrf(next)) {
    await prepareCsrf();
  }

  return next;
};

const collectMessages = (source: unknown): string[] => {
  if (!source) return [];
  if (Array.isArray(source)) {
    return source.flatMap((entry) => collectMessages(entry));
  }
  if (typeof source === "object") {
    return Object.values(source as Record<string, unknown>).flatMap((entry) =>
      collectMessages(entry),
    );
  }
  if (typeof source === "string") {
    const trimmed = source.trim();
    return trimmed ? [trimmed] : [];
  }
  return [];
};

const extractErrorMessages = (
  error: AxiosError<ApiErrorResponse>,
): string[] => {
  const payload = error.response?.data;
  const messages = collectMessages(payload?.errors);

  if (payload && typeof payload.message === "string" && payload.message.trim()) {
    messages.push(payload.message.trim());
  }

  if (payload && typeof payload.data === "string" && payload.data.trim()) {
    messages.push(payload.data.trim());
  }

  if (!messages.length && typeof error.message === "string") {
    messages.push(error.message);
  }

  return Array.from(new Set(messages.filter((entry) => entry && entry.trim()))).map((entry) =>
    entry.trim(),
  );
};

const isBrowser = typeof window !== "undefined";

const handleErrorResponse = (error: unknown) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const status = error.response?.status;
    const messages = extractErrorMessages(error);

    if (status === 401) {
      if (isBrowser && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (status === 403) {
      if (isBrowser) {
        toast({
          variant: "destructive",
          title: "Unauthorized campaign access",
          description: messages[0] ?? "لا تملك صلاحية/عضوية في الحملة",
        });
      }
      return Promise.reject(error);
    }

    if (status === 422) {
      (error as AxiosError & { validationErrors?: string[] }).validationErrors = messages;
      return Promise.reject(error);
    }

    if (messages.length && isBrowser) {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: messages[0],
      });
    }
  }

  return Promise.reject(error);
};

api.interceptors.request.use((config) => enhanceRequestConfig(config));
axios.interceptors.request.use((config) => enhanceRequestConfig(config));

api.interceptors.response.use(
  (response) => response,
  (error) => handleErrorResponse(error),
);
axios.interceptors.response.use(
  (response) => response,
  (error) => handleErrorResponse(error),
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

declare module "axios" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AxiosError<T = any, D = any> {
    validationErrors?: string[];
  }
}
