// src/infrastructure/shared/lib/echo.ts

export type EchoChannel = {
  listen: (event: string, callback: (data: any) => void) => void;
  stopListening: (event: string, callback: (data: any) => void) => void;
};

export type EchoInstance = {
  channel: (name: string) => EchoChannel;
} | null;

// ----------------------------------------------------------------------------
// Stub implementation for DEV / disabled mode
// - في التطوير نرجّع كائن وهمي يمنع أخطاء TS ويجعل الاستدعاءات no-op.
// - في الإنتاج، رجّع null لو ما عندك تكوين فعلي لـ Echo.
// ----------------------------------------------------------------------------
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
  // الإنتاج بدون تكوين فعلي
  return null;
};

// مكان للتنظيف لاحقًا عندما تضيف Echo حقيقي (Pusher/Socket.io)
export const disconnectEcho = (): void => {
  // مثال مستقبلي:
  // _echo?.disconnect();
};
