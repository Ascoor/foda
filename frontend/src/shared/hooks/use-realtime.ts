import { useCallback, useState } from "react";

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

export const useRealtime = <T,>(
  _key: string,
  { initialData }: UseRealtimeOptions<T> = {},
): UseRealtimeReturn<T> => {
  const [data] = useState<T | undefined>(initialData);

  const send = useCallback((_payload: unknown) => {
    if (import.meta.env.DEV) {
      console.warn("useRealtime.send() called but realtime is disabled.");
    }
  }, []);

  return {
    data,
    connected: false,
    error: null,
    send,
  };
};
