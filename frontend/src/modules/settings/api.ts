import { request } from '@/lib/api';
import { SystemSettings } from './types';

interface SettingItem {
  key: string;
  value: any;
}

export const fetchSettings = async (): Promise<SystemSettings> => {
  try {
    const res = await request<{ data: SettingItem[] }>(
      { url: '/v1/settings', method: 'GET' },
      { useCache: true },
    );
    const map = Object.fromEntries(res.data.map((s) => [s.key, s.value]));
    return {
      language: (map.language ?? 'en') as 'en' | 'ar',
      region: (map.region ?? '') as string,
      allowRegistration: Boolean(map.allow_registration ?? false),
    };
  } catch (error) {
    throw error;
  }
};

export const updateSettings = async (
  settings: SystemSettings,
): Promise<SystemSettings> => {
  try {
    await request({
      url: '/v1/settings',
      method: 'PUT',
      data: {
        language: settings.language,
        region: settings.region,
        allow_registration: settings.allowRegistration,
      },
    });
    return settings;
  } catch (error) {
    throw error;
  }
};
