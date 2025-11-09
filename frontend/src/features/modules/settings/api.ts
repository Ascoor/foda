import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { CampaignIdentifier } from "@/infrastructure/shared/lib/campaign";
import type { SystemSettings } from "./types";

interface SettingItem {
  key: string;
  value: unknown;
}

export const fetchSettings = async (
  campaignId?: CampaignIdentifier | null,
): Promise<SystemSettings> => {
  if (!campaignId) {
    throw new Error("Cannot load settings without an active campaign");
  }
  const res = await request<{ data: SettingItem[] }>(
    { url: API_ENDPOINTS.configuration.settings(campaignId), method: "get" },
    { useCache: true },
  );
  const map = Object.fromEntries(res.data.map((s) => [s.key, s.value]));
  return {
    language: (map.language ?? "en") as "en" | "ar",
    region: (map.region ?? "") as string,
    allowRegistration: Boolean(map.allow_registration ?? false),
  };
};

export const updateSettings = async (
  settings: SystemSettings,
  campaignId?: CampaignIdentifier | null,
): Promise<SystemSettings> => {
  if (!campaignId) {
    throw new Error("Cannot update settings without an active campaign");
  }
  await request({
    url: API_ENDPOINTS.configuration.settings(campaignId),
    method: "put",
    data: {
      language: settings.language,
      region: settings.region,
      allow_registration: settings.allowRegistration,
    },
  });
  return settings;
};
