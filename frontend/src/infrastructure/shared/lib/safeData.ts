/**
 * Safe data handling utilities for robust React applications
 */

// Enhanced safe array utility
export function safeArray<T>(value?: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

// Safe object utility
export function safeObject<T>(value?: T | null | undefined): T | {} {
  return value && typeof value === "object" ? value : ({} as T);
}

// Safe number utility
export function safeNumber(value?: number | string | null): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

// Safe string utility
export function safeString(value?: string | null | undefined): string {
  return typeof value === "string" ? value : "";
}

// Type guard for arrays
export function isValidArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

// Type guard for objects
export function isValidObject(
  value: unknown,
): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// Safe data mapper with fallback
export function safeMap<T, U>(
  data: T[] | null | undefined,
  mapper: (item: T, index: number) => U,
  fallback: U[] = [],
): U[] {
  const safeData = safeArray(data);
  if (safeData.length === 0) return fallback;

  try {
    return safeData.map(mapper);
  } catch (error) {
    console.warn("Safe map failed:", error);
    return fallback;
  }
}

// Safe data filter with error handling
export function safeFilter<T>(
  data: T[] | null | undefined,
  predicate: (item: T, index: number) => boolean,
): T[] {
  const safeData = safeArray(data);

  try {
    return safeData.filter(predicate);
  } catch (error) {
    console.warn("Safe filter failed:", error);
    return [];
  }
}

// Safe data reducer with error handling
export function safeReduce<T, U>(
  data: T[] | null | undefined,
  reducer: (acc: U, current: T, index: number) => U,
  initialValue: U,
): U {
  const safeData = safeArray(data);

  try {
    return safeData.reduce(reducer, initialValue);
  } catch (error) {
    console.warn("Safe reduce failed:", error);
    return initialValue;
  }
}

// API response wrapper
export interface SafeApiResponse<T> {
  data: T[];
  total: number;
  page?: number;
  loading: boolean;
  error: string | null;
}

// Safe API response handler
export function createSafeApiResponse<T>(
  response?: { data?: T[]; total?: number; page?: number } | null,
  loading = false,
  error: string | null = null,
): SafeApiResponse<T> {
  return {
    data: safeArray(response?.data),
    total: safeNumber(response?.total),
    page: response?.page || 1,
    loading,
    error,
  };
}
