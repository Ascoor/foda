import { SystemSettings } from './types';

let currentSettings: SystemSettings = {
  language: 'en',
  region: 'US',
  allowRegistration: true
};

export const fetchSettings = async (): Promise<SystemSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return currentSettings;
};

export const updateSettings = async (settings: SystemSettings): Promise<SystemSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  currentSettings = settings;
  return currentSettings;
};
