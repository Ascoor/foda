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

let activeCampaignId: string | null = resolveInitialCampaignId() ?? null;

export const getActiveCampaignId = (): string | null => activeCampaignId;

export const setActiveCampaignId = (
  value: CampaignIdentifier | null,
): string | null => {
  activeCampaignId =
    value !== null && value !== undefined ? String(value) : null;

  if (typeof window !== "undefined") {
    try {
      if (activeCampaignId) {
        window.localStorage.setItem(STORAGE_KEY, activeCampaignId);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
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

  if (!active) {
    throw new Error("Cannot build campaign URL without an active campaign");
  }

  const normalized = ensureLeadingSlash(path).replace(/\/{2,}/g, "/");

  return `campaigns/${encodeURIComponent(active)}${normalized}`.replace(/\/{2,}/g, "/");
};
