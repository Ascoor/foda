export const API_ENDPOINTS = {
  core: {
    roles: "/api/v1/roles",
  },
  configuration: {
    settings: "/api/v1/settings",
    notifications: "/api/v1/notifications",
  },
  elections: {
    elections: "/api/v1/ec/elections",
    geoAreas: "/api/v1/ec/geo-areas",
    committees: "/api/v1/ec/committees",
    candidates: "/api/v1/ec/candidates",
  },
  crm: {
    voters: "/api/v1/voters",
    volunteers: "/api/v1/volunteers",
    agents: "/api/v1/ec/agents",
  },
  campaigns: {
    campaigns: "/api/v1/ec/campaigns",
    activities: "/api/v1/activities",
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
    overview: "/api/v1/dashboard",
    heatmap: "/api/v1/home/heatmap",
    committeeGeo: "/api/v1/committees/geo",
    recentActivityGeo: "/api/v1/activities/recent",
  },
  geo: {
    governorates: "/api/v1/geo/governorates",
    districts: "/api/v1/geo/districts",
    circles: "/api/v1/geo/circles",
  },
} as const;

export type ApiEndpointGroups = typeof API_ENDPOINTS;
