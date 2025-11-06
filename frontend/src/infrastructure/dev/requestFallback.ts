import type { AxiosRequestConfig } from "axios";
import { isAxiosError } from "axios";
import {
  activitiesResponseFallback,
  committeeGeoFallback,
  dashboardOverviewFallback,
  notificationFallback,
  recentActivityGeoFallback,
} from "./fallbackData";

const shouldEnableFallbacks = () => {
  const flag = import.meta.env?.VITE_ENABLE_DEV_FALLBACKS;
  if (typeof flag === "string") {
    return !["false", "0", "off"].includes(flag.toLowerCase());
  }
  return Boolean(import.meta.env?.DEV);
};

type FallbackResolver = (
  config: AxiosRequestConfig,
) => unknown | Promise<unknown>;

type FallbackMatch = {
  test: (config: AxiosRequestConfig) => boolean;
  resolve: FallbackResolver;
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const FALLBACKS: FallbackMatch[] = [
  {
    test: (config) =>
      (config.method ?? "get").toString().toLowerCase() === "get" &&
      typeof config.url === "string" &&
      /\/campaigns\/[^/]+\/dashboard$/.test(config.url),
    resolve: () => clone(dashboardOverviewFallback),
  },
  {
    test: (config) =>
      (config.method ?? "get").toString().toLowerCase() === "get" &&
      typeof config.url === "string" &&
      /\/campaigns\/[^/]+\/committees\/geo$/.test(config.url),
    resolve: () => clone(committeeGeoFallback),
  },
  {
    test: (config) =>
      (config.method ?? "get").toString().toLowerCase() === "get" &&
      typeof config.url === "string" &&
      /\/campaigns\/[^/]+\/activities\/recent$/.test(config.url),
    resolve: () => clone(recentActivityGeoFallback),
  },
  {
    test: (config) =>
      (config.method ?? "get").toString().toLowerCase() === "get" &&
      typeof config.url === "string" &&
      /\/campaigns\/[^/]+\/activities$/.test(config.url),
    resolve: (config) => {
      const pageValue = (() => {
        const params = config.params as Record<string, unknown> | undefined;
        const raw = params?.page;
        if (typeof raw === "number") return raw;
        if (typeof raw === "string") {
          const parsed = Number.parseInt(raw, 10);
          return Number.isNaN(parsed) ? undefined : parsed;
        }
        return undefined;
      })();

      const payload = clone(activitiesResponseFallback);
      payload.meta = {
        ...payload.meta,
        current_page: pageValue ?? 1,
      };
      return payload;
    },
  },
  {
    test: (config) =>
      typeof config.url === "string" &&
      /\/notifications(?:\/?$|\?|$)/.test(config.url),
    resolve: () => ({ data: clone(notificationFallback) }),
  },
  {
    test: (config) =>
      (config.method ?? "get").toString().toLowerCase() === "patch" &&
      typeof config.url === "string" &&
      /\/notifications\/[^/]+\/read$/.test(config.url),
    resolve: () => ({ data: null }),
  },
  {
    test: (config) =>
      (config.method ?? "get").toString().toLowerCase() === "post" &&
      typeof config.url === "string" &&
      /\/notifications\/read-all$/.test(config.url),
    resolve: () => ({ data: null }),
  },
];

export const resolveDevFallback = async (
  config: AxiosRequestConfig,
  error: unknown,
) => {
  if (!shouldEnableFallbacks()) {
    return undefined;
  }

  const match = FALLBACKS.find((fallback) => fallback.test(config));
  if (!match) {
    return undefined;
  }

  const reason = (() => {
    if (isAxiosError(error)) {
      if (error.response) {
        const statusText = error.response.statusText
          ? ` ${error.response.statusText}`
          : "";
        return `${error.response.status}${statusText}`.trim();
      }
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "unknown error";
  })();

  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.warn(
      `[dev-fallback] Substituting mock data for ${config.url} (${reason}).`,
    );
  }

  return match.resolve(config);
};
