import type { FeatureCollection, Point } from "geojson";
import type { DashboardOverviewResponse } from "@/features/modules/dashboard/types";
import type { ActivitiesResponse } from "@/features/modules/activities/types";
import type { NotificationItem } from "@/infrastructure/shared/contexts/NotificationContext";

const now = new Date();
const iso = (offsetMinutes: number) =>
  new Date(now.getTime() - offsetMinutes * 60 * 1000).toISOString();

export const dashboardOverviewFallback: DashboardOverviewResponse = {
  stats: {
    total_elections: { value: 4, change: "+12%", trend: "up" },
    active_voters: { value: 12856, change: "+3%", trend: "up" },
    total_candidates: { value: 32, change: "-2%", trend: "down" },
    committee_count: { value: 214 },
  },
  progress: {
    registration: 78,
    verification: 64,
    campaign: 85,
    voting: 42,
    overall: 67,
    remaining: 33,
  },
  activities: [
    {
      id: 1,
      type: "field_report",
      title: "Cairo East field team confirmed early turnout spike",
      time: iso(45),
    },
    {
      id: 2,
      type: "volunteer_update",
      title: "Alexandria youth canvass recruited 32 new volunteers",
      time: iso(120),
    },
    {
      id: 3,
      type: "incident",
      title: "Logistics team resolved ballot material delay in Giza",
      time: iso(210),
    },
  ],
  turnout: [54, 62, 58, 71, 69, 75, 80],
};

export const committeeGeoFallback: FeatureCollection<Point, Record<string, any>> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.2357, 30.0444] },
      properties: {
        id: 1001,
        name: "Cairo Downtown Committee",
        area_id: 1,
        area_name: "Cairo",
        turnout_pressure: 0.74,
        support_score: 62,
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [29.9187, 31.2001] },
      properties: {
        id: 1002,
        name: "Giza West Committee",
        area_id: 2,
        area_name: "Giza",
        turnout_pressure: 0.52,
        support_score: 58,
      },
    },
  ],
};

export const recentActivityGeoFallback: FeatureCollection<Point, Record<string, any>> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [31.1313, 30.1122] },
      properties: {
        id: 501,
        type: "field_report",
        status: "open",
        support_score: 68,
        area_id: 1,
        area_name: "Cairo",
        title: "High engagement observed in Nasr City",
        reported_at: iso(30),
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [30.0123, 31.2156] },
      properties: {
        id: 502,
        type: "incident",
        status: "resolved",
        support_score: 55,
        area_id: 3,
        area_name: "Alexandria",
        title: "Polling material replaced in Sidi Gaber",
        reported_at: iso(95),
      },
    },
  ],
};

export const activitiesResponseFallback: ActivitiesResponse = {
  data: [
    {
      id: 301,
      uuid: "mock-activity-301",
      created_at: iso(60),
      updated_at: iso(60),
      campaign_uuid: "mock-campaign",
      type: "door_knock",
      status: "completed",
      title: "Door-to-door outreach in Maadi",
      description: "Teams covered 12 apartment blocks and identified 58 supporters.",
      scheduled_for: iso(180),
      duration_minutes: 120,
      location: "Maadi, Cairo",
      geo_area_uuid: "area-1",
      assigned_volunteer_uuids: ["vol-1", "vol-2"],
      metrics: { supporters_identified: 58 },
      deleted_at: null,
      encrypted_fields: [],
      support_score: 65,
    },
    {
      id: 302,
      uuid: "mock-activity-302",
      created_at: iso(150),
      updated_at: iso(90),
      campaign_uuid: "mock-campaign",
      type: "rally",
      status: "planned",
      title: "Alexandria waterfront rally",
      description:
        "Logistics confirmed venue for 1,200 attendees with youth coalition partners.",
      scheduled_for: iso(-1440),
      duration_minutes: 180,
      location: "Corniche, Alexandria",
      geo_area_uuid: "area-3",
      assigned_volunteer_uuids: ["vol-3"],
      metrics: { projected_attendance: 1200 },
      deleted_at: null,
      encrypted_fields: [],
      support_score: 72,
    },
  ],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 2,
  },
};

export const notificationFallback: NotificationItem[] = [
  {
    id: 9001,
    type: "field",
    category: "Field Operations",
    title: "New high priority field report",
    message: "Team Delta flagged an incident requiring follow-up in Tanta.",
    priority: "high",
    meta: { area: "Tanta" },
    read_at: null,
    created_at: iso(15),
    created_ago: "15 minutes ago",
    is_high_priority: true,
  },
  {
    id: 9002,
    type: "performance",
    category: "Performance",
    title: "Volunteer recruitment milestone",
    message: "We surpassed the weekly volunteer recruitment target by 12%.",
    priority: "medium",
    meta: { week: 32 },
    read_at: null,
    created_at: iso(240),
    created_ago: "4 hours ago",
    is_high_priority: false,
  },
  {
    id: 9003,
    type: "risk",
    category: "Risk",
    title: "Weather alert for weekend events",
    message: "Expect heavy winds in Alexandria on Saturday. Adjust rally logistics.",
    priority: "medium",
    meta: { city: "Alexandria" },
    read_at: iso(480),
    created_at: iso(480),
    created_ago: "8 hours ago",
    is_high_priority: false,
  },
];
