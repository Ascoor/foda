export type EchoChannel = {
  listen: (event: string, callback: (data: any) => void) => void;
  stopListening: (event: string, callback: (data: any) => void) => void;
};

export type EchoInstance = {
  channel: (name: string) => EchoChannel;
} | null;

export const getEcho = (): EchoInstance => {
  if (import.meta.env.DEV) {
    console.info("[Echo] Dev mode: real-time updates disabled (stub).");
    return {
      channel: () => ({
        listen: () => {},
        stopListening: () => {},
      }),
    };
  }
  return null; // في الإنتاج بدون تكوين فعلي
};

export const disconnectEcho = (): void => {
  // ضع disconnect حقيقي عندما تضيف Echo فعلي
};
