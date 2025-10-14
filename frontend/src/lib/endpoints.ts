export const API_ENDPOINTS = {
  core: {
    users: '/api/v1/users',
    roles: '/api/v1/roles',
    permissions: '/api/v1/permissions',
  },
  configuration: {
    settings: '/api/v1/settings',
    notifications: '/api/v1/system-notifications',
  },
  elections: {
    elections: '/api/v1/elections',
    geoAreas: '/api/v1/geo-areas',
    committees: '/api/v1/committees',
    candidates: '/api/v1/candidates',
  },
  crm: {
    voters: '/api/v1/voters',
    volunteers: '/api/v1/volunteers',
    agents: '/api/v1/agents',
    notes: '/api/v1/voter-notes',
  },
  campaigns: {
    campaigns: '/api/v1/campaigns',
    activities: '/api/v1/activities',
  },
  field: {
    observations: '/api/v1/observations',
  },
  analytics: {
    metrics: '/api/v1/analytics/metrics',
    snapshots: '/api/v1/analytics/snapshots',
  },
  notifications: {
    notifications: '/api/v1/notifications',
  },
  dashboard: {
    overview: '/api/v1/dashboard/overview',
    tasks: '/api/v1/dashboard/tasks',
    committeeGeo: '/api/v1/dashboard/committees/geojson',
    recentActivityGeo: '/api/v1/dashboard/activities/recent',
  },
} as const;

export type ApiEndpointGroups = typeof API_ENDPOINTS;
