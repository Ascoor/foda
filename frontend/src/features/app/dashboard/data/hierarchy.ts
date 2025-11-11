import type { ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  CalendarClock,
  ClipboardCheck,
  Compass,
  Crown,
  FileBarChart,
  FileStack,
  Gauge,
  Layers,
  LineChart,
  MapPin,
  PieChart,
  Settings,
  ShieldCheck,
  Target,
  Users,
  Workflow,
} from "lucide-react";

import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import { useCampaignContext } from "@/infrastructure/shared/contexts/CampaignContext";
import type { AnalyticsResponse } from "@/features/modules/analytics/types";

export type GovernanceRole = "domain-owner" | "data-steward" | "operator";

export interface DashboardAction {
  id: string;
  label: string;
  description: string;
  type: "view" | "create" | "update" | "report" | "sync";
  roles: GovernanceRole[];
  emphasis?: "primary" | "secondary" | "destructive";
}

export interface DashboardAnalytics {
  id: string;
  label: string;
  value: string;
  trend?: "up" | "down";
  change?: string;
}

export interface DashboardPanelMediaBadge {
  id: string;
  label: string;
  tone?: "default" | "positive" | "warning" | "negative";
}

export interface DashboardPanelMedia {
  image?: string | null;
  title?: string;
  subtitle?: string;
  description?: string;
  badges?: DashboardPanelMediaBadge[];
}

export interface DashboardPanel {
  id: string;
  label: string;
  summary: string;
  icon: ComponentType<{ className?: string }>;
  analytics?: DashboardAnalytics[];
  actions: DashboardAction[];
  reports?: string[];
  media?: DashboardPanelMedia;
}

export interface DashboardSubmodule {
  id: string;
  label: string;
  description: string;
  panels: DashboardPanel[];
}

export interface DashboardModule {
  id: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  submodules: DashboardSubmodule[];
}

export const governanceRoles: Record<GovernanceRole, string> = {
  "domain-owner": "مالك معرفي",
  "data-steward": "مسؤول بيانات",
  operator: "مسؤول تنفيذي",
};

const iconRegistry = {
  compass: Compass,
  fileStack: FileStack,
  barChart: BarChart3,
  clipboard: ClipboardCheck,
  calendar: CalendarClock,
  users: Users,
  workflow: Workflow,
  gauge: Gauge,
  mapPin: MapPin,
  layers: Layers,
  lineChart: LineChart,
  pieChart: PieChart,
  target: Target,
  shield: ShieldCheck,
  fileBar: FileBarChart,
  settings: Settings,
  activity: Activity,
  crown: Crown,
} satisfies Record<string, ComponentType<{ className?: string }>>;

interface CampaignEventSummary {
  id?: number;
  title?: string;
  starts_at?: string;
  ends_at?: string;
  area?: { id?: number; name?: string | null } | null;
  team?: { id?: number; name?: string | null } | null;
}

interface EventsSection {
  total?: number;
  upcoming?: CampaignEventSummary[] | null;
  recent?: CampaignEventSummary[] | null;
}

interface CommitteeSummary {
  id?: number;
  name?: string | null;
  code?: string | null;
  area?: { id?: number; name?: string | null } | null;
  voters_count?: number;
  agents_count?: number;
}

interface CommitteesSection {
  total?: number;
  with_assignments?: number;
  without_assignments?: number;
  top?: CommitteeSummary[] | null;
  distribution?: Array<{
    area_id?: number | null;
    area_name?: string | null;
    committees?: number;
    voters?: number;
  }> | null;
}

interface GeographySection {
  total_areas?: number;
  assigned?: Array<{ id?: number; name?: string | null; level?: string | null }> | null;
  coverage?: {
    volunteer_to_voter_ratio?: number;
    agent_to_committee_ratio?: number;
    teams_per_area?: number;
  } | null;
}

interface TeamActor {
  id?: number;
  type?: string;
  name?: string | null;
  team?: { id?: number; name?: string | null } | null;
  area?: { id?: number; name?: string | null } | null;
  contact?: Record<string, unknown> | null;
  updated_at?: string | null;
}

interface TeamSection {
  teams?: {
    total?: number;
    with_supervisors?: number;
    average_size?: number;
    top?: Array<{
      id?: number;
      name?: string | null;
      area?: { id?: number; name?: string | null } | null;
      volunteers_count?: number;
    }> | null;
  } | null;
  volunteers?: {
    total?: number;
    active?: number;
    coverage_ratio?: number;
    sample?: TeamActor[] | null;
  } | null;
  agents?: {
    total?: number;
    assigned?: number;
    coverage_ratio?: number;
    sample?: TeamActor[] | null;
  } | null;
  actors?: TeamActor[] | null;
}

interface SettingsSection {
  updated_at?: string | null;
  flags?: string[] | null;
  channels?: unknown[] | null;
  owner?: { id?: number; name?: string | null; email?: string | null } | null;
}

interface VoterSummary {
  id?: number;
  name?: string | null;
  committee?: { id?: number; name?: string | null } | null;
  registered_at?: string | null;
}

interface VotersSection {
  total?: number;
  registrations?: Array<{ month?: string; count?: number }> | null;
  latest?: VoterSummary[] | null;
  by_committee?: Array<{
    area_id?: number | null;
    area_name?: string | null;
    committees?: number;
    voters?: number;
  }> | null;
}

interface CandidateResults {
  total_votes?: number | null;
  percentage?: number | null;
}

interface CandidateSummary {
  id?: number;
  name?: string | null;
  party?: string | null;
  slogan?: string | null;
  photo_url?: string | null;
  support?: number | null;
  results?: CandidateResults | null;
  media?: Record<string, unknown> | null;
}

interface CandidatesSection {
  total?: number;
  featured?: CandidateSummary | null;
  list?: CandidateSummary[] | null;
  metrics?: Record<string, unknown> | null;
}

interface CampaignOverviewSections {
  events?: EventsSection | null;
  committees?: CommitteesSection | null;
  geography?: GeographySection | null;
  team?: TeamSection | null;
  settings?: SettingsSection | null;
  voters?: VotersSection | null;
  candidates?: CandidatesSection | null;
}

interface DashboardOverviewData {
  campaign?: {
    id?: number;
    name?: string | null;
    status?: string | null;
    spatial_level?: string | null;
    timeframe?: { starts_at?: string | null; ends_at?: string | null } | null;
  } | null;
  metrics?: Record<string, unknown> | null;
  sections?: CampaignOverviewSections | null;
  stats?: Record<string, { value?: unknown; change?: unknown; trend?: unknown }> | null;
  progress?: Record<string, unknown> | null;
  activities?: Array<Record<string, unknown>> | null;
  turnout?: Array<unknown> | null;
}

interface ElectionSummaryEnvelope {
  summary?: Record<string, unknown> | null;
  turnout?: Record<string, unknown> | null;
}

interface DashboardDataSources {
  overview?: DashboardOverviewData | null;
  analytics?: AnalyticsResponse | null;
  election?: ElectionSummaryEnvelope | null;
}

type Trend = "up" | "down" | undefined;

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const decimalFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const absoluteChangeFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  month: "short",
  day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ar-EG", {
  dateStyle: "medium",
  timeStyle: "short",
});

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const formatNumber = (value: number | undefined, fallback = "—") => {
  if (value === undefined || Number.isNaN(value)) {
    return fallback;
  }

  return numberFormatter.format(value);
};

const formatDecimal = (value: number | undefined, fallback = "—") => {
  if (value === undefined || Number.isNaN(value)) {
    return fallback;
  }

  return decimalFormatter.format(value);
};

const formatPercent = (value: number | undefined, fallback = "—") => {
  if (value === undefined || Number.isNaN(value)) {
    return fallback;
  }

  return `${percentFormatter.format(value)}%`;
};

const formatChange = (
  value: number | undefined,
  { isPercent = false }: { isPercent?: boolean } = {},
): string | undefined => {
  if (value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  const absolute = Math.abs(value);
  const formatted = isPercent
    ? `${percentFormatter.format(absolute)}%`
    : absoluteChangeFormatter.format(absolute);
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${formatted}`;
};

const formatDay = (value: unknown, fallback = "—") => {
  if (typeof value !== "string") {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return dateFormatter.format(date);
};

const formatDateTimeValue = (value: unknown, fallback = "—") => {
  if (typeof value !== "string") {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return dateTimeFormatter.format(date);
};

const computeRegistrationStats = (
  registrations?: VotersSection["registrations"],
): {
  latest?: number;
  change?: number;
  percentChange?: number;
  trend: Trend;
} => {
  if (!Array.isArray(registrations) || registrations.length === 0) {
    return { trend: undefined };
  }

  const counts = registrations
    .map((entry) => parseNumber(entry?.count))
    .filter((count): count is number => count !== undefined);

  if (counts.length === 0) {
    return { trend: undefined };
  }

  const latest = counts[counts.length - 1];
  const previous = counts[counts.length - 2];
  const change = previous !== undefined ? latest - previous : undefined;
  const percentChange =
    previous && previous !== 0 && change !== undefined
      ? (change / previous) * 100
      : undefined;

  const trend = change !== undefined ? (change >= 0 ? "up" : "down") : undefined;

  return { latest, change, percentChange, trend };
};

const computeSupportChange = (
  trends?: AnalyticsResponse["support_trends"],
): {
  latest?: number;
  change?: number;
  trend: Trend;
} => {
  if (!Array.isArray(trends) || trends.length === 0) {
    return { trend: undefined };
  }

  const values = trends
    .map((point) => parseNumber(point?.support_score_avg))
    .filter((value): value is number => value !== undefined);

  if (values.length === 0) {
    return { trend: undefined };
  }

  const latest = values[values.length - 1];
  const previous = values.length > 1 ? values[values.length - 2] : undefined;
  const change = previous !== undefined ? latest - previous : undefined;
  const trend = change !== undefined ? (change >= 0 ? "up" : "down") : undefined;

  return { latest, change, trend };
};

const computeRegionSummaries = (analytics?: AnalyticsResponse | null) => {
  const regions = Array.isArray(analytics?.regions) ? analytics?.regions : [];

  return regions.reduce(
    (
      acc,
      region,
    ) => {
      const reports = parseNumber(region?.reports_today) ?? 0;
      const agents = parseNumber(region?.active_agents) ?? 0;
      const voters = parseNumber(region?.total_voters) ?? 0;
      const support = parseNumber(region?.support_score_avg) ?? 0;

      acc.totalReports += reports;
      acc.totalAgents += agents;
      acc.totalVoters += voters;

      if (reports > acc.busiestReports) {
        acc.busiestReports = reports;
        acc.busiestRegion = region?.region ?? acc.busiestRegion;
      }

      if (support > acc.strongestSupportScore) {
        acc.strongestSupportScore = support;
        acc.strongestSupportRegion = region?.region ?? acc.strongestSupportRegion;
      }

      return acc;
    },
    {
      totalReports: 0,
      totalAgents: 0,
      totalVoters: 0,
      busiestRegion: undefined as string | undefined,
      busiestReports: 0,
      strongestSupportRegion: undefined as string | undefined,
      strongestSupportScore: 0,
    },
  );
};

const computeReportDistribution = (analytics?: AnalyticsResponse | null) => {
  const distribution = Array.isArray(analytics?.report_distribution)
    ? analytics?.report_distribution
    : [];

  const total = distribution.reduce(
    (sum, slice) => sum + (parseNumber(slice?.count) ?? 0),
    0,
  );

  const sorted = [...distribution].sort(
    (a, b) => (parseNumber(b?.count) ?? 0) - (parseNumber(a?.count) ?? 0),
  );

  const top = sorted[0];

  return {
    total,
    topType: typeof top?.type === "string" ? top?.type : undefined,
    topCount: parseNumber(top?.count),
  };
};

export const buildDashboardHierarchy = ({
  overview,
  analytics,
  election,
}: DashboardDataSources): DashboardModule[] => {
  const metrics = overview?.metrics ?? {};
  const sections = overview?.sections ?? {};

  const eventsSection = (sections?.events ?? {}) as EventsSection;
  const committeesSection = (sections?.committees ?? {}) as CommitteesSection;
  const geographySection = (sections?.geography ?? {}) as GeographySection;
  const teamSection = (sections?.team ?? {}) as TeamSection;
  const settingsSection = (sections?.settings ?? {}) as SettingsSection;
  const votersSection = (sections?.voters ?? {}) as VotersSection;
  const candidatesSection = (sections?.candidates ?? {}) as CandidatesSection;

  const totalEvents = parseNumber(eventsSection.total ?? metrics.events);
  const upcomingEvents = Array.isArray(eventsSection.upcoming)
    ? eventsSection.upcoming
    : [];
  const recentEvents = Array.isArray(eventsSection.recent)
    ? eventsSection.recent
    : [];
  const nextEvent = upcomingEvents[0];
  const latestEvent = recentEvents[0];
  const upcomingCount = upcomingEvents.length;

  const totalCommittees = parseNumber(committeesSection.total ?? metrics.committees);
  const committeesWithAssignments = parseNumber(committeesSection.with_assignments);
  const committeesWithoutAssignments = parseNumber(
    committeesSection.without_assignments,
  );
  const topCommittee = Array.isArray(committeesSection.top)
    ? committeesSection.top[0]
    : undefined;

  const geographyCoverage = geographySection.coverage ?? {};
  const volunteerCoverage = parseNumber(
    geographyCoverage.volunteer_to_voter_ratio ??
      teamSection.volunteers?.coverage_ratio,
  );
  const agentCoverage = parseNumber(
    geographyCoverage.agent_to_committee_ratio ??
      teamSection.agents?.coverage_ratio,
  );
  const teamsPerArea = parseNumber(geographyCoverage.teams_per_area);
  const assignedAreas = Array.isArray(geographySection.assigned)
    ? geographySection.assigned
    : [];
  const regionSummary = computeRegionSummaries(analytics);
  const primaryAreaName =
    (assignedAreas.find((area) => typeof area?.name === "string")?.name as
      | string
      | undefined) ?? regionSummary.busiestRegion;

  const totalVolunteers = parseNumber(
    teamSection.volunteers?.total ?? metrics.volunteers,
  );
  const activeVolunteers = parseNumber(teamSection.volunteers?.active);
  const totalAgents = parseNumber(teamSection.agents?.total ?? metrics.agents);
  const assignedAgents = parseNumber(teamSection.agents?.assigned);
  const totalTeams = parseNumber(teamSection.teams?.total ?? metrics.teams);
  const averageTeamSize = parseNumber(teamSection.teams?.average_size);
  const teamActors = Array.isArray(teamSection.actors) ? teamSection.actors : [];
  const actorNamesPreview = teamActors
    .map((actor) =>
      typeof actor?.name === "string" ? (actor.name as string) : null,
    )
    .filter((name): name is string => Boolean(name))
    .slice(0, 2);

  const totalVoters = parseNumber(votersSection.total ?? metrics.voters);
  const registrations = Array.isArray(votersSection.registrations)
    ? votersSection.registrations
    : [];
  const registrationStats = computeRegistrationStats(registrations);
  const voterLatestList = Array.isArray(votersSection.latest)
    ? votersSection.latest
    : [];
  const lastRegisteredName =
    typeof voterLatestList[0]?.name === "string"
      ? (voterLatestList[0]?.name as string)
      : undefined;
  const committeeDistribution = Array.isArray(votersSection.by_committee)
    ? votersSection.by_committee
    : [];
  const topCommitteeArea =
    committeeDistribution.find((entry) => typeof entry?.area_name === "string")
      ?.area_name ?? regionSummary.busiestRegion;

  const candidatesSectionMetrics = candidatesSection.metrics ?? {};
  const candidateTotal = parseNumber(candidatesSection.total ?? metrics.candidates);
  const featuredCandidate = candidatesSection.featured as
    | CandidateSummary
    | undefined;
  const candidateSupport = parseNumber(
    featuredCandidate?.results?.percentage ?? featuredCandidate?.support,
  );
  const candidateVotes = parseNumber(featuredCandidate?.results?.total_votes);
  const candidateName =
    typeof featuredCandidate?.name === "string" ? featuredCandidate.name : undefined;
  const candidateParty =
    typeof featuredCandidate?.party === "string" ? featuredCandidate.party : undefined;
  const candidateSlogan =
    typeof featuredCandidate?.slogan === "string" ? featuredCandidate.slogan : undefined;
  const candidatePhoto =
    typeof featuredCandidate?.photo_url === "string"
      ? featuredCandidate.photo_url
      : undefined;

  const supportChange = computeSupportChange(analytics?.support_trends);
  const supportAverage = parseNumber(candidatesSectionMetrics.support_average);
  const reportHighlights = computeReportDistribution(analytics);
  const topReportType = reportHighlights.topType;
  const topReportCount = reportHighlights.topCount;

  const turnoutEstimate =
    parseNumber(analytics?.summary?.turnout_estimate) ??
    parseNumber(election?.turnout?.turnout_percentage);
  const coverageGap = parseNumber(analytics?.summary?.coverage_gap);

  const registeredVoters =
    parseNumber(election?.turnout?.registered_voters) ?? totalVoters;

  const settingsFlags = Array.isArray(settingsSection.flags)
    ? settingsSection.flags
    : [];
  const settingsChannels = Array.isArray(settingsSection.channels)
    ? settingsSection.channels
    : [];
  const settingsUpdated = formatDateTimeValue(settingsSection.updated_at);
  const owner = settingsSection.owner as
    | { name?: string; email?: string }
    | undefined;
  const ownerName =
    typeof owner?.name === "string" ? (owner.name as string) : undefined;

  const candidateBadges: DashboardPanelMediaBadge[] = [];
  if (candidateSupport !== undefined) {
    candidateBadges.push({
      id: "candidate-support",
      label: `دعم ${formatPercent(candidateSupport)}`,
      tone: candidateSupport >= 50 ? "positive" : "warning",
    });
  }
  if (candidateVotes !== undefined) {
    candidateBadges.push({
      id: "candidate-votes",
      label: `${formatNumber(candidateVotes)} صوت متوقع`,
      tone: "default",
    });
  }
  if (coverageGap !== undefined) {
    candidateBadges.push({
      id: "coverage-gap",
      label: `فجوة تغطية ${formatPercent(coverageGap)}`,
      tone: "warning",
    });
  }

  const eventsSummaryParts = [
    nextEvent && typeof nextEvent.title === "string"
      ? `أقرب فعالية: ${nextEvent.title} في ${formatDay(nextEvent.starts_at)}.`
      : upcomingCount > 0
        ? "تم جدولة فعاليات ميدانية قادمة."
        : "لا توجد فعاليات قادمة حالياً، يمكن جدولة نشاط جديد لضمان استمرار الزخم.",
    topReportType
      ? `أكثر البلاغات نشاطاً من نوع ${topReportType}${
          topReportCount ? ` (${formatNumber(topReportCount)} اليوم)` : ""
        }.`
      : null,
  ].filter(Boolean);

  const teamSummaryParts = [
    `إجمالي ${formatNumber(totalTeams)} فريقاً نشطاً بمتوسط ${formatDecimal(
      averageTeamSize,
    )} متطوع لكل فريق`,
    assignedAgents !== undefined
      ? `مع ${formatNumber(assignedAgents)} وكيل ميداني مرتبط باللجان.`
      : undefined,
    actorNamesPreview.length > 0
      ? `أبرز المنضمين: ${actorNamesPreview.join("، ")}.`
      : undefined,
  ].filter(Boolean);

  const committeesSummaryParts = [
    `تغطية ${formatNumber(committeesWithAssignments)} لجنة من إجمالي ${formatNumber(
      totalCommittees,
    )}.`,
    topCommittee && typeof topCommittee.name === "string"
      ? `اللجنة الأبرز ${topCommittee.name} تضم ${formatNumber(
          topCommittee.voters_count,
        )} ناخباً.`
      : undefined,
  ].filter(Boolean);

  const votersSummaryParts = [
    `إجمالي ${formatNumber(totalVoters)} ناخب مسجل مع تركيز على ${
      topCommitteeArea ?? "المناطق ذات الأولوية"
    }.`,
    lastRegisteredName ? `آخر إضافة: ${lastRegisteredName}.` : undefined,
  ].filter(Boolean);

  const candidatesSummaryParts = [
    candidateName
      ? `المرشح الأبرز حالياً ${candidateName}${
          candidateParty ? ` (${candidateParty})` : ""
        } بمؤشر دعم ${formatPercent(candidateSupport)}.`
      : "لم يتم تمييز مرشح رئيسي بعد، يمكن تحديث البيانات لإبراز المتصدر.",
    candidateSlogan ? `الشعار: ${candidateSlogan}.` : undefined,
  ].filter(Boolean);

  const settingsSummaryParts = [
    ownerName ? `المسؤول التنفيذي: ${ownerName}.` : undefined,
    `آخر تحديث في ${settingsUpdated}.`,
  ].filter(Boolean);

  const modules: DashboardModule[] = [
    {
      id: "campaign-operations",
      label: "العمليات الميدانية",
      description:
        "متابعة حية للحملة مع نظرة مركزة على الأنشطة الميدانية وتوزيع التغطية الجغرافية.",
      icon: iconRegistry.workflow,
      submodules: [
        {
          id: "events",
          label: "الأحداث",
          description:
            "جدولة الفعاليات ومتابعة الاستجابة التنظيمية في كل منطقة.",
          panels: [
            {
              id: "events-overview",
              label: "ملخص الفعاليات",
              summary: eventsSummaryParts.join(" "),
              icon: iconRegistry.calendar,
              analytics: [
                {
                  id: "events-total",
                  label: "إجمالي الفعاليات",
                  value: formatNumber(totalEvents),
                },
                {
                  id: "events-upcoming",
                  label: "فعاليات قادمة",
                  value: formatNumber(upcomingCount),
                  change:
                    upcomingCount > 0 && latestEvent
                      ? `آخر فعالية ${formatDay(latestEvent.starts_at)}`
                      : undefined,
                },
                {
                  id: "events-next",
                  label: "أقرب فعالية",
                  value:
                    nextEvent && typeof nextEvent.title === "string"
                      ? `${nextEvent.title} • ${formatDay(nextEvent.starts_at)}`
                      : "—",
                },
              ],
              actions: [
                {
                  id: "events-calendar",
                  label: "عرض التقويم",
                  description:
                    "استعراض الجدول الكامل للفعاليات الميدانية مع توزيعها الجغرافي.",
                  type: "view",
                  roles: ["domain-owner", "operator"],
                  emphasis: "primary",
                },
                {
                  id: "events-schedule",
                  label: "جدولة فعالية جديدة",
                  description:
                    "حجز فعالية ميدانية وتعيين الفريق المسؤول وقنوات المتابعة.",
                  type: "create",
                  roles: ["domain-owner", "operator"],
                },
                {
                  id: "events-brief",
                  label: "إرسال موجز ميداني",
                  description:
                    "مشاركة تفاصيل الفعاليات القادمة مع الفرق الميدانية والقيادة.",
                  type: "sync",
                  roles: ["domain-owner", "operator"],
                },
              ],
              reports: ["تقرير الفعاليات", "توزيع الأنشطة", "جدول التغطية"],
            },
          ],
        },
        {
          id: "geography",
          label: "النطاق الجغرافي",
          description:
            "تحليل التغطية المكانية للحملة وتحديد المناطق ذات الأولوية للدعم.",
          panels: [
            {
              id: "geography-overview",
              label: "نظرة جغرافية",
              summary:
                primaryAreaName
                  ? `أعلى نشاط في منطقة ${primaryAreaName} مع متابعة تغطية المتطوعين بنسبة ${formatPercent(
                      volunteerCoverage,
                    )}.`
                  : "تمت مزامنة المناطق المرتبطة بالحملة مع مؤشرات التغطية الحالية.",
              icon: iconRegistry.mapPin,
              analytics: [
                {
                  id: "geography-areas",
                  label: "المناطق المرتبطة",
                  value: formatNumber(
                    parseNumber(geographySection.total_areas ?? metrics.areas),
                  ),
                },
                {
                  id: "geography-volunteer-coverage",
                  label: "تغطية المتطوعين",
                  value: formatPercent(volunteerCoverage),
                  trend:
                    volunteerCoverage !== undefined
                      ? volunteerCoverage >= 60
                        ? "up"
                        : "down"
                      : undefined,
                },
                {
                  id: "geography-teams",
                  label: "فرق لكل منطقة",
                  value: formatDecimal(teamsPerArea),
                },
              ],
              actions: [
                {
                  id: "geography-map",
                  label: "عرض الخريطة التفاعلية",
                  description: "رسم تحليلي لتوزيع الفرق والبلاغات حسب المناطق.",
                  type: "view",
                  roles: ["domain-owner", "operator"],
                  emphasis: "primary",
                },
                {
                  id: "geography-adjust",
                  label: "تعديل توزيع الفرق",
                  description:
                    "إعادة توزيع الموارد الميدانية وفق كثافة الناخبين والأولوية.",
                  type: "update",
                  roles: ["domain-owner", "data-steward"],
                },
                {
                  id: "geography-export",
                  label: "تحميل تقرير التغطية",
                  description: "إصدار تقرير شامل للانتشار الجغرافي لدعم غرف العمليات.",
                  type: "report",
                  roles: ["data-steward"],
                },
              ],
              reports: ["خريطة النطاقات", "تحليل التغطية", "تقرير البلاغات"],
            },
          ],
        },
      ],
    },
    {
      id: "field-organization",
      label: "إدارة الفرق",
      description:
        "منصة تشغيل موحدة لمتابعة الفرق، المتطوعين والوكلاء عبر جميع اللجان.",
      icon: iconRegistry.users,
      submodules: [
        {
          id: "teams",
          label: "الفرق والمتطوعون",
          description:
            "متابعة جاهزية الفرق وتنسيق الأدوار بين المتطوعين والوكلاء.",
          panels: [
            {
              id: "teams-readiness",
              label: "جاهزية الفرق",
              summary: teamSummaryParts.join(" "),
              icon: iconRegistry.layers,
              analytics: [
                {
                  id: "teams-volunteers",
                  label: "إجمالي المتطوعين",
                  value: formatNumber(totalVolunteers),
                  change: formatPercent(volunteerCoverage),
                },
                {
                  id: "teams-active",
                  label: "متطوعون نشطون",
                  value: formatNumber(activeVolunteers),
                  change:
                    activeVolunteers !== undefined && totalVolunteers
                      ? formatPercent(
                          (activeVolunteers / Math.max(totalVolunteers, 1)) * 100,
                        )
                      : undefined,
                },
                {
                  id: "teams-agents",
                  label: "الوكلاء المعتمدون",
                  value: formatNumber(totalAgents),
                  change: formatPercent(agentCoverage),
                },
              ],
              actions: [
                {
                  id: "teams-manage-volunteers",
                  label: "إدارة المتطوعين",
                  description: "تحديث البيانات الميدانية ومهام المتطوعين حسب الأولوية.",
                  type: "update",
                  roles: ["domain-owner", "operator"],
                  emphasis: "primary",
                },
                {
                  id: "teams-sync-agents",
                  label: "مزامنة الوكلاء",
                  description: "التحقق من حالة الوكلاء وربطهم باللجان المعينة.",
                  type: "sync",
                  roles: ["domain-owner", "operator"],
                },
                {
                  id: "teams-assign-supervisors",
                  label: "تعيين المشرفين",
                  description: "ضبط الإشراف لكل فريق وتوزيع المسؤوليات حسب المنطقة.",
                  type: "update",
                  roles: ["domain-owner", "data-steward"],
                },
              ],
              reports: ["سجل المتطوعين", "تقرير جاهزية الفرق", "متابعة الوكلاء"],
            },
          ],
        },
        {
          id: "committees",
          label: "اللجان الميدانية",
          description:
            "متابعة توزيع اللجان ومستوى التغطية البشرية لكل نطاق انتخابي.",
          panels: [
            {
              id: "committees-coverage",
              label: "تغطية اللجان",
              summary: committeesSummaryParts.join(" "),
              icon: iconRegistry.clipboard,
              analytics: [
                {
                  id: "committees-total",
                  label: "إجمالي اللجان",
                  value: formatNumber(totalCommittees),
                },
                {
                  id: "committees-covered",
                  label: "لجان مغطاة",
                  value: formatNumber(committeesWithAssignments),
                  change: formatPercent(agentCoverage),
                },
                {
                  id: "committees-pending",
                  label: "لجان بدون تغطية",
                  value: formatNumber(committeesWithoutAssignments),
                  trend:
                    committeesWithoutAssignments && committeesWithoutAssignments > 0
                      ? "warning"
                      : undefined,
                },
              ],
              actions: [
                {
                  id: "committees-review",
                  label: "مراجعة التغطية",
                  description:
                    "مقارنة اللجان المغطاة مع أهداف الحملة وتحديد الفجوات.",
                  type: "view",
                  roles: ["domain-owner", "data-steward"],
                  emphasis: "primary",
                },
                {
                  id: "committees-assign",
                  label: "إسناد وكلاء",
                  description:
                    "تعيين وكلاء ميدانيين للجان غير المغطاة وتحديث جداول المناوبة.",
                  type: "update",
                  roles: ["domain-owner", "operator"],
                },
                {
                  id: "committees-export",
                  label: "تصدير كشف اللجان",
                  description:
                    "تحميل تقرير تفصيلي بعدد الناخبين والوكلاء لكل لجنة.",
                  type: "report",
                  roles: ["data-steward"],
                },
              ],
              reports: ["كشف اللجان", "تقرير التغطية", "متابعة الانضباط"],
            },
          ],
        },
      ],
    },
    {
      id: "constituency-management",
      label: "إدارة الناخبين",
      description:
        "رؤية متكاملة لسلوك الناخبين وتطور التسجيل عبر اللجان والمناطق.",
      icon: iconRegistry.gauge,
      submodules: [
        {
          id: "voters",
          label: "الناخبون",
          description:
            "مؤشرات التوسع في قاعدة الناخبين مع إبراز اللجان الأكثر حيوية.",
          panels: [
            {
              id: "voters-trends",
              label: "رصد الناخبين",
              summary: votersSummaryParts.join(" "),
              icon: iconRegistry.lineChart,
              analytics: [
                {
                  id: "voters-total",
                  label: "إجمالي الناخبين",
                  value: formatNumber(totalVoters),
                },
                {
                  id: "voters-monthly",
                  label: "تسجيلات الشهر",
                  value: formatNumber(registrationStats.latest),
                  change: formatChange(registrationStats.percentChange, {
                    isPercent: true,
                  }),
                  trend: registrationStats.trend,
                },
                {
                  id: "voters-registered",
                  label: "ناخبون مسجلون",
                  value: formatNumber(registeredVoters),
                },
              ],
              actions: [
                {
                  id: "voters-segmentation",
                  label: "إدارة الشرائح",
                  description:
                    "بناء قوائم مستهدفة حسب المنطقة أو مستوى التفاعل.",
                  type: "view",
                  roles: ["domain-owner", "data-steward"],
                  emphasis: "primary",
                },
                {
                  id: "voters-outreach",
                  label: "إطلاق حملة تواصل",
                  description:
                    "تنشيط قنوات الاتصال الرقمية والهاتفية للناخبين المترددين.",
                  type: "create",
                  roles: ["domain-owner", "operator"],
                },
                {
                  id: "voters-export",
                  label: "تصدير بيانات الناخبين",
                  description:
                    "تجهيز ملفات الناخبين للاستخدام في المقرات الميدانية.",
                  type: "report",
                  roles: ["data-steward"],
                },
              ],
              reports: ["تحليل الناخبين", "تقسيم الشرائح", "حالة التواصل"],
            },
          ],
        },
      ],
    },
    {
      id: "candidates-performance",
      label: "المرشحون",
      description:
        "إدارة حالة المرشحين مع مؤشرات الدعم والنتائج التقديرية للحملة.",
      icon: iconRegistry.barChart,
      submodules: [
        {
          id: "candidates",
          label: "أداء المرشحين",
          description:
            "مقارنة توجهات الدعم والجاهزية الإعلامية لكل مرشح في الحملة.",
          panels: [
            {
              id: "candidates-overview",
              label: "نظرة عامة",
              summary: candidatesSummaryParts.join(" "),
              icon: iconRegistry.crown,
              analytics: [
                {
                  id: "candidates-count",
                  label: "عدد المرشحين",
                  value: formatNumber(candidateTotal),
                },
                {
                  id: "candidates-support-avg",
                  label: "متوسط الدعم",
                  value: formatPercent(supportAverage),
                  trend: supportChange.trend,
                  change: formatChange(supportChange.change, { isPercent: true }),
                },
                {
                  id: "candidates-turnout",
                  label: "تقدير المشاركة",
                  value: formatPercent(turnoutEstimate),
                },
              ],
              media:
                candidateName || candidatePhoto
                  ? {
                      image: candidatePhoto,
                      title: candidateName ?? "مرشح غير مسمى",
                      subtitle: candidateParty ?? undefined,
                      description: candidateSlogan ?? undefined,
                      badges: candidateBadges,
                    }
                  : undefined,
              actions: [
                {
                  id: "candidates-profile",
                  label: "عرض لوحة المرشح",
                  description:
                    "تفاصيل الأداء والأنشطة المرتبطة بكل مرشح في الحملة.",
                  type: "view",
                  roles: ["domain-owner", "operator"],
                  emphasis: "primary",
                },
                {
                  id: "candidates-messaging",
                  label: "تحديث الرسائل",
                  description:
                    "مواءمة الرسائل الإعلامية مع نتائج الدعم الميداني.",
                  type: "update",
                  roles: ["domain-owner", "data-steward"],
                },
                {
                  id: "candidates-share-results",
                  label: "نشر موجز النتائج",
                  description:
                    "مشاركة التحديثات مع الفرق الإعلامية وقادة الحملة.",
                  type: "sync",
                  roles: ["domain-owner", "operator"],
                },
              ],
              reports: ["تقرير الدعم الجماهيري", "تحليل النتائج", "أداء الحملات"],
            },
          ],
        },
      ],
    },
    {
      id: "administrative-control",
      label: "الإعدادات والتحكم",
      description:
        "حوكمة إعدادات الحملة وقنوات التواصل مع تتبع أحدث التغييرات.",
      icon: iconRegistry.settings,
      submodules: [
        {
          id: "settings",
          label: "الإعدادات",
          description:
            "عرض حالة الإعدادات النشطة، المسؤول التنفيذي وقنوات التواصل المعتمدة.",
          panels: [
            {
              id: "settings-overview",
              label: "نظرة التحكم",
              summary: settingsSummaryParts.join(" "),
              icon: iconRegistry.settings,
              analytics: [
                {
                  id: "settings-last-update",
                  label: "آخر تحديث",
                  value: settingsUpdated,
                },
                {
                  id: "settings-flags",
                  label: "ميزات مفعلة",
                  value: formatNumber(settingsFlags.length),
                },
                {
                  id: "settings-channels",
                  label: "قنوات التواصل",
                  value: formatNumber(settingsChannels.length),
                },
              ],
              actions: [
                {
                  id: "settings-manage-permissions",
                  label: "إدارة الأذونات",
                  description:
                    "ضبط صلاحيات الحملة والأدوار المرتبطة بالوصول.",
                  type: "update",
                  roles: ["domain-owner", "data-steward"],
                  emphasis: "primary",
                },
                {
                  id: "settings-communications",
                  label: "تحديث قنوات التواصل",
                  description:
                    "إضافة أو تعطيل قنوات التواصل الرسمية للحملة.",
                  type: "update",
                  roles: ["domain-owner", "operator"],
                },
                {
                  id: "settings-export-log",
                  label: "تصدير سجل التغييرات",
                  description:
                    "إرسال سجل التعديلات الأخيرة إلى فريق الحوكمة.",
                  type: "report",
                  roles: ["data-steward"],
                },
              ],
              reports: ["سجل التغييرات", "سياسة الوصول", "تكوين القنوات"],
            },
          ],
        },
      ],
    },
  ];

  return modules;
};

const fetchDashboardHierarchy = async (
  campaignId: string,
): Promise<DashboardModule[]> => {
  const [overviewResult, analyticsResult, electionResult] = await Promise.allSettled([
    request<{ data: DashboardOverviewData }>({
      url: API_ENDPOINTS.dashboard.overview(campaignId),
      method: "get",
    }, { useCache: true }),
    request<{ data: AnalyticsResponse }>({
      url: API_ENDPOINTS.analytics.metrics,
      method: "get",
    }, { useCache: true }),
    request<{ data: ElectionSummaryEnvelope }>({
      url: API_ENDPOINTS.integrations.electionSummary,
      method: "get",
    }, { useCache: true }),
  ]);

  if (overviewResult.status === "rejected") {
    throw overviewResult.reason;
  }

  const overview = overviewResult.value.data ?? null;
  const analytics = analyticsResult.status === "fulfilled" ? analyticsResult.value.data : null;
  const election = electionResult.status === "fulfilled" ? electionResult.value.data : null;

  return buildDashboardHierarchy({ overview, analytics, election });
};

export const useDashboardHierarchy = () => {
  const { campaignId } = useCampaignContext();

  return useQuery({
    queryKey: ["dashboard", "hierarchy", campaignId ?? "__none__"],
    queryFn: () => {
      if (!campaignId) {
        throw new Error("No active campaign selected");
      }
      return fetchDashboardHierarchy(campaignId);
    },
    enabled: Boolean(campaignId),
    staleTime: 60_000,
  });
};
