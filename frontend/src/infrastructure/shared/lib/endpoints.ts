import {
  type CampaignIdentifier,
  buildCampaignUrl,
} from "@/infrastructure/shared/lib/campaign";

const campaignScoped = (path: string) =>
  (campaignId?: CampaignIdentifier | null) =>
    buildCampaignUrl(path, campaignId);

export const API_ENDPOINTS = {
  core: {
    roles: campaignScoped("/roles"),
  },
  configuration: {
    settings: campaignScoped("/settings"),
    notifications: "/api/v1/notifications",
  },
  elections: {
    elections: "/api/v1/ec/elections",
    geoAreas: "/api/v1/ec/geo-areas",
    committees: "/api/v1/ec/committees",
    candidates: "/api/v1/ec/candidates",
  },
  crm: {
    voters: campaignScoped("/voters"),
    volunteers: campaignScoped("/volunteers"),
    agents: "/api/v1/ec/agents",
  },
  campaigns: {
    campaigns: "/api/v1/ec/campaigns",
    activities: campaignScoped("/activities"),
  },
  field: {
    observations: "/api/v1/ec/observations",
  },
  analytics: {
    metrics: "/api/v1/analytics",
    snapshots: "/api/v1/analytics/forecast",
  },
  notifications: {
    notifications: "/api/v1/notifications",
  },
  dashboard: {
    overview: campaignScoped("/dashboard"),
    heatmap: campaignScoped("/home/heatmap"),
    committeeGeo: campaignScoped("/committees/geo"),
    recentActivityGeo: campaignScoped("/activities/recent"),
  },
  integrations: {
    electionSummary: "/api/v1/integrations/elections/summary",
  },
} as const;

export type ApiEndpointGroups = typeof API_ENDPOINTS;
