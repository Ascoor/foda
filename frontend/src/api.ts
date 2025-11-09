import { request } from "@/infrastructure/shared/lib/api";

const id = (value: string | number) => encodeURIComponent(String(value));

const ensureCampaign = (campaign: string | number | null | undefined) => {
  if (campaign === undefined || campaign === null) {
    throw new Error("campaign required");
  }
  return id(campaign);
};

export const fetchCampaigns = () =>
  request({ url: "/ec/campaigns", method: "get" });

export const fetchDashboard = (campaign: string | number) => {
  const key = ensureCampaign(campaign);
  return request({
    url: `/campaigns/${key}/dashboard`,
    method: "get",
  });
};

export const fetchActivities = (campaign: string | number, page = 1) => {
  const key = ensureCampaign(campaign);
  return request({
    url: `/campaigns/${key}/activities`,
    method: "get",
    params: { page },
  });
};

export const fetchRecentActivityGeo = (
  campaign: string | number,
  limit = 150,
) => {
  const key = ensureCampaign(campaign);
  return request({
    url: `/campaigns/${key}/activities/recent`,
    method: "get",
    params: { limit },
  });
};

export const fetchCommitteeGeo = (campaign: string | number) => {
  const key = ensureCampaign(campaign);
  return request({
    url: `/campaigns/${key}/committees/geo`,
    method: "get",
  });
};

export const fetchSettings = (campaign: string | number) => {
  const key = ensureCampaign(campaign);
  return request({
    url: `/campaigns/${key}/settings`,
    method: "get",
  });
};

export const fetchNotifications = () =>
  request({
    url: "/notifications",
    method: "get",
    params: { per_page: 50 },
  });
