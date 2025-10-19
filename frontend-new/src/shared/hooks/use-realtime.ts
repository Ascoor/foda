import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { REALTIME_URL } from "@/shared/api/config";

type UseRealtimeOptions<T> = {
  namespace?: string;
  event?: string;
  query?: Record<string, string | number | boolean>;
  enabled?: boolean;
  initialData?: T;
  onMessage?: (payload: T) => void;
};

type UseRealtimeReturn<T> = {
  data: T | undefined;
  connected: boolean;
  error: Error | null;
  send: (payload: unknown) => void;
};

const toWebsocketUrl = (baseUrl: string) =>
  baseUrl.replace(/^http(s?):/i, (_match, secure) => (secure ? "wss:" : "ws:"));

const buildUrl = (
  base: string,
  namespace?: string,
  query?: Record<string, string | number | boolean>,
) => {
  const url = new URL(toWebsocketUrl(base));
  if (namespace) {
    url.pathname = `${url.pathname.replace(/\/$/, "")}/${namespace.replace(/^\//, "")}`;
  }
  Object.entries(query ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

export const useRealtime = <T,>(
  key: string,
  { namespace, event, query, enabled = true, initialData, onMessage }: UseRealtimeOptions<T> = {},
): UseRealtimeReturn<T> => {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const eventName = event ?? key;

  const targetUrl = useMemo(
    () => buildUrl(REALTIME_URL, namespace, { channel: key, ...(query ?? {}) }),
    [key, namespace, query],
  );

  useEffect(() => {
    if (!enabled) {
      return () => undefined;
    }

    const socket = new WebSocket(targetUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setError(null);
    };

    socket.onerror = () => {
      setError(new Error(`Failed to connect to realtime stream: ${eventName}`));
    };

    socket.onclose = () => {
      setConnected(false);
    };

    socket.onmessage = (messageEvent: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(messageEvent.data);
        const resolvedEvent = payload.event ?? eventName;
        const resolvedData = payload.data ?? payload;

        if (resolvedEvent !== eventName) return;

        setData(resolvedData as T);
        onMessage?.(resolvedData as T);
      } catch (parseError) {
        console.warn("Realtime payload could not be parsed", parseError);
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [enabled, eventName, onMessage, targetUrl]);

  const send = useCallback((payload: unknown) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  }, []);

  return { data, connected, error, send };
};
