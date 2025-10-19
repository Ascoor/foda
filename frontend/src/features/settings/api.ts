import { request } from '@shared/lib/api';
import { API_ENDPOINTS } from '@shared/lib/endpoints';
import type { SystemSettings } from './types';

interface SettingItem {
  key: string;
  value: unknown;
}

const SETTINGS_ENDPOINT = API_ENDPOINTS.configuration.settings;

export const fetchSettings = async (): Promise<SystemSettings> => {
  const res = await request<{ data: SettingItem[] }>(
    { url: SETTINGS_ENDPOINT, method: 'get' },
    { useCache: true },
  );
  const map = Object.fromEntries(res.data.map((s) => [s.key, s.value]));
  return {
    language: (map.language ?? 'en') as 'en' | 'ar',
    region: (map.region ?? '') as string,
    allowRegistration: Boolean(map.allow_registration ?? false),
  };
};

export const updateSettings = async (settings: SystemSettings): Promise<SystemSettings> => {
  await request({
    url: SETTINGS_ENDPOINT,
    method: 'put',
    data: {
      language: settings.language,
      region: settings.region,
      allow_registration: settings.allowRegistration,
    },
  });
  return settings;
};
