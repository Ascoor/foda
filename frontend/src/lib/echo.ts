export const getEcho = () => {
  if (import.meta.env.DEV) {
    console.info('Echo client not configured. Live updates disabled in this build.');
  }

  return null;
};

export const disconnectEcho = () => {};

export type EchoInstance = null;
export type EchoChannel = null;
