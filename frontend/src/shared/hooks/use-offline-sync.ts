import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getFromStore, removeFromStore, setInStore } from "@shared/lib/idb";

const isNavigatorOnline = () =>
  typeof navigator !== "undefined" ? navigator.onLine : true;

const DB_NAME = "offline-sync";
const STORE_NAME = "mutations";
const QUEUE_KEY = "queued-mutations";
const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;
const MAX_ATTEMPTS = 5;

const createMutationId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export type HttpMethod =
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "POST_FORM"
  | "PUT_FORM";

export interface QueuedMutation {
  id: string;
  url: string;
  method: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  createdAt: number;
  attempts: number;
  metadata?: Record<string, unknown>;
}

export interface OfflineSyncState {
  isOnline: boolean;
  isSyncing: boolean;
  queue: QueuedMutation[];
  lastSyncedAt: number | null;
  error: string | null;
  enqueueMutation: (mutation: Omit<QueuedMutation, "id" | "createdAt" | "attempts">) => Promise<void>;
  removeFromQueue: (id: string) => Promise<void>;
  clearQueue: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const getInitialOnlineState = () => {
  if (typeof window === "undefined") {
    return true;
  }

  return isNavigatorOnline();
};

const parseBody = (mutation: QueuedMutation) => {
  if (!mutation.body) return undefined;
  if (mutation.method === "POST_FORM" || mutation.method === "PUT_FORM") {
    const formData = new FormData();
    const payload = mutation.body as Record<string, unknown>;
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((entry) => {
          formData.append(key, entry as Blob | string);
        });
      } else if (value != null) {
        formData.append(key, value as Blob | string);
      }
    });
    return formData;
  }

  return JSON.stringify(mutation.body);
};

export const useOfflineSync = (): OfflineSyncState => {
  const [isOnline, setIsOnline] = useState<boolean>(getInitialOnlineState);
  const [queue, setQueue] = useState<QueuedMutation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const queueRef = useRef<QueuedMutation[]>(queue);
  queueRef.current = queue;

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const stored = await getFromStore<QueuedMutation[]>(DB_NAME, STORE_NAME, QUEUE_KEY);
      if (!cancelled && stored) {
        setQueue(stored);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const removeFromQueue = useCallback(async (id: string) => {
    setQueue((prev) => prev.filter((mutation) => mutation.id !== id));
    const updated = queueRef.current.filter((mutation) => mutation.id !== id);
    await setInStore(DB_NAME, STORE_NAME, QUEUE_KEY, updated);
  }, []);

  const clearQueue = useCallback(async () => {
    setQueue([]);
    queueRef.current = [];
    await removeFromStore(DB_NAME, STORE_NAME, QUEUE_KEY);
  }, []);

  const enqueueMutation = useCallback<OfflineSyncState["enqueueMutation"]>(
    async (mutation) => {
      const queued: QueuedMutation = {
        id: createMutationId(),
        createdAt: Date.now(),
        attempts: 0,
        headers:
          mutation.method === "POST_FORM" || mutation.method === "PUT_FORM"
            ? mutation.headers
            : {
                "Content-Type": "application/json",
                ...(mutation.headers ?? {}),
              },
        ...mutation,
      };

      setQueue((prev) => {
        const next = [...prev, queued];
        queueRef.current = next;
        return next;
      });

      await setInStore(DB_NAME, STORE_NAME, QUEUE_KEY, queueRef.current);
    },
  []);

  const syncNow = useCallback(async () => {
    if (!isNavigatorOnline() || queueRef.current.length === 0) {
      return;
    }

    setIsSyncing(true);
    setError(null);

    const remaining: QueuedMutation[] = [];
    const exhausted: QueuedMutation[] = [];

    for (const mutation of queueRef.current) {
      try {
        if (mutation.attempts > 0) {
          const delay = Math.min(
            BASE_BACKOFF_MS * 2 ** Math.max(mutation.attempts - 1, 0),
            MAX_BACKOFF_MS,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        const response = await fetch(mutation.url, {
          method:
            mutation.method === "POST_FORM"
              ? "POST"
              : mutation.method === "PUT_FORM"
                ? "PUT"
                : mutation.method,
          headers:
            mutation.method === "POST_FORM" || mutation.method === "PUT_FORM"
              ? undefined
              : mutation.headers,
          body: parseBody(mutation),
          keepalive: true,
        });

        if (!response.ok) {
          throw new Error(`Failed to sync mutation: ${response.status}`);
        }
      } catch (err) {
        console.warn("Offline mutation failed to replay", err);
        const nextAttempts = mutation.attempts + 1;
        if (nextAttempts >= MAX_ATTEMPTS) {
          exhausted.push({ ...mutation, attempts: nextAttempts });
        } else {
          remaining.push({ ...mutation, attempts: nextAttempts });
        }
      }
    }

    queueRef.current = remaining;
    setQueue(remaining);

    if (remaining.length === 0) {
      setLastSyncedAt(Date.now());
      setError(null);
      await removeFromStore(DB_NAME, STORE_NAME, QUEUE_KEY);
    } else {
      const exhaustedCount = exhausted.length;
      setError(
        exhaustedCount > 0
          ? `Some actions could not be synchronised after multiple attempts (${exhaustedCount} dropped).`
          : "Some actions could not be synchronised",
      );
      await setInStore(DB_NAME, STORE_NAME, QUEUE_KEY, remaining);
    }

    setIsSyncing(false);
  }, []);

  useEffect(() => {
    if (!isOnline || queueRef.current.length === 0) return;
    void syncNow();
  }, [isOnline, syncNow]);

  return useMemo(
    () => ({
      isOnline,
      isSyncing,
      queue,
      lastSyncedAt,
      error,
      enqueueMutation,
      removeFromQueue,
      clearQueue,
      syncNow,
    }),
    [clearQueue, enqueueMutation, error, isOnline, isSyncing, lastSyncedAt, queue, removeFromQueue, syncNow],
  );
};
