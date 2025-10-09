import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo | null = null;

const getBoolean = (value: string | undefined, fallback = false) => {
  if (!value) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

export const getEcho = () => {
  if (echo) {
    return echo;
  }

  const key = import.meta.env.VITE_PUSHER_APP_KEY as string | undefined;

  if (!key) {
    console.warn('Missing PUSHER_APP_KEY. Live updates are disabled.');
    return null;
  }

  window.Pusher = Pusher;

  echo = new Echo({
    broadcaster: 'pusher',
    key,
    cluster: (import.meta.env.VITE_PUSHER_APP_CLUSTER as string | undefined) ?? 'mt1',
    wsHost: (import.meta.env.VITE_PUSHER_HOST as string | undefined) ?? window.location.hostname,
    wsPort: Number(import.meta.env.VITE_PUSHER_PORT ?? '6001'),
    forceTLS: getBoolean(import.meta.env.VITE_PUSHER_FORCE_TLS, window.location.protocol === 'https:'),
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
  });

  return echo;
};

export const disconnectEcho = () => {
  if (echo) {
    echo.disconnect();
    echo = null;
  }
};
