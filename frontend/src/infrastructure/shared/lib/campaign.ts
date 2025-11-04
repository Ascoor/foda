export type CampaignIdentifier = string | number;

const STORAGE_KEY = "foda:activeCampaignId";

const getEnvDefaultCampaignId = (): string | null => {
  const value = import.meta.env?.VITE_DEFAULT_CAMPAIGN_ID;
  if (value === undefined || value === null) {
    return null;
  }
  return String(value);
};

const resolveInitialCampaignId = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return stored;
      }
    } catch (error) {
      console.warn("Unable to access stored campaign identifier", error);
    }
  }

  return getEnvDefaultCampaignId();
};

const fallbackCampaignId = (): string => getEnvDefaultCampaignId() ?? "1";

let activeCampaignId: string = resolveInitialCampaignId() ?? fallbackCampaignId();

export const getActiveCampaignId = (): string => activeCampaignId;

export const setActiveCampaignId = (
  value: CampaignIdentifier | null,
): string => {
  activeCampaignId =
    value !== null && value !== undefined
      ? String(value)
      : resolveInitialCampaignId() ?? fallbackCampaignId();

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, activeCampaignId);
    } catch (error) {
      console.warn("Failed to persist campaign identifier", error);
    }
  }

  return activeCampaignId;
};

const ensureLeadingSlash = (value: string): string =>
  value.startsWith("/") ? value : `/${value}`;

export const buildCampaignUrl = (
  path: string,
  campaignId?: CampaignIdentifier | null,
): string => {
  const active =
    campaignId !== undefined && campaignId !== null
      ? String(campaignId)
      : getActiveCampaignId();

  const normalized = ensureLeadingSlash(path).replace(/\/{2,}/g, "/");

  return `campaigns/${encodeURIComponent(active)}${normalized}`.replace(/\/{2,}/g, "/");
};
