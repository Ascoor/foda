import api from "@shared/lib/api";

let currentCampaignId: string | null = null;

export const setCampaignId = (id: string | null) => {
  currentCampaignId = id;
};

api.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {};
  }

  if (currentCampaignId) {
    config.headers["X-Campaign-ID"] = currentCampaignId;
  } else if ("X-Campaign-ID" in config.headers) {
    delete (config.headers as Record<string, unknown>)["X-Campaign-ID"];
  }

  return config;
});

export { api };
