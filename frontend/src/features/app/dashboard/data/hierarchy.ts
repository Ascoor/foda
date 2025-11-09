import type { ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  CalendarClock,
  ClipboardCheck,
  Compass,
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

export interface DashboardPanel {
  id: string;
  label: string;
  summary: string;
  icon: ComponentType<{ className?: string }>;
  analytics?: DashboardAnalytics[];
  actions: DashboardAction[];
  reports?: string[];
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
} satisfies Record<string, ComponentType<{ className?: string }>>;

interface DashboardOverviewData {
  areas?: number;
  volunteers?: number;
  voters?: number;
  teams?: number;
  events?: number;
  registrations?: Array<{ month?: string; count?: number }>;
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

const computeRegistrationStats = (
  registrations?: DashboardOverviewData["registrations"],
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
  const totalVoters = parseNumber(overview?.voters);
  const totalVolunteers = parseNumber(overview?.volunteers);
  const totalAreas = parseNumber(overview?.areas);
  const totalTeams = parseNumber(overview?.teams);
  const totalEvents = parseNumber(overview?.events);

  const registrationStats = computeRegistrationStats(overview?.registrations);
  const supportChange = computeSupportChange(analytics?.support_trends);
  const regionSummary = computeRegionSummaries(analytics);
  const reportDistribution = computeReportDistribution(analytics);

  const supportPercentage = parseNumber(analytics?.summary?.support_percentage);
  const turnoutEstimate = parseNumber(analytics?.summary?.turnout_estimate);
  const coverageGap = parseNumber(analytics?.summary?.coverage_gap);

  const registeredVoters =
    parseNumber(election?.turnout?.registered_voters) ?? totalVoters;
  const turnoutPercentage =
    parseNumber(election?.turnout?.turnout_percentage) ?? turnoutEstimate;

  const totalPrecincts =
    parseNumber(election?.summary?.total_precincts) ??
    parseNumber(election?.summary?.precincts_total);
  const reportingPrecincts =
    parseNumber(election?.summary?.reporting_precincts) ??
    parseNumber(election?.summary?.reporting);

  const precinctProgress =
    totalPrecincts && reportingPrecincts !== undefined && totalPrecincts > 0
      ? (reportingPrecincts / totalPrecincts) * 100
      : undefined;

  const volunteerCoverage =
    totalVoters && totalVolunteers !== undefined && totalVoters > 0
      ? (totalVolunteers / totalVoters) * 100
      : undefined;

  const avgTeamSize =
    totalTeams && totalVolunteers !== undefined && totalTeams > 0
      ? totalVolunteers / totalTeams
      : undefined;

  
const modules: DashboardModule[] = [
  {
    id: "operational-sections",
    label: "لوحة المتابعة",
    description:
      "تصنيف واضح لأهم مكونات الحملة مع مؤشرات حية لكل قسم تشغيلي.",
    icon: iconRegistry.compass,
    submodules: [
      {
        id: "areas",
        label: "المناطق",
        description: "رصد حالة المناطق ومستوى النشاط في كل نطاق جغرافي.",
        panels: [
          {
            id: "areas-overview",
            label: "ملخص المناطق",
            summary:
              "إحصاءات سريعة حول توزيع المناطق وأبرز نقاط النشاط الحالية.",
            icon: iconRegistry.mapPin,
            analytics: [
              {
                id: "areas-total",
                label: "إجمالي المناطق",
                value: formatNumber(totalAreas),
              },
              {
                id: "areas-busiest",
                label: "أكثر منطقة نشاطاً",
                value: regionSummary.busiestRegion ?? "—",
                change:
                  regionSummary.busiestReports > 0
                    ? `${formatNumber(regionSummary.busiestReports)} بلاغ`
                    : undefined,
              },
              {
                id: "areas-reports",
                label: "تقارير اليوم",
                value: formatNumber(regionSummary.totalReports),
                trend:
                  regionSummary.totalReports > 0 ? "up" : undefined,
              },
            ],
            actions: [
              {
                id: "view-areas-map",
                label: "عرض الخريطة",
                description:
                  "استعراض خريطة تفاعلية للمناطق مع حالة التغطية الحالية.",
                type: "view",
                roles: ["domain-owner", "operator"],
                emphasis: "primary",
              },
              {
                id: "update-area-status",
                label: "تحديث حالة منطقة",
                description:
                  "تعديل حالة المناطق الحيوية بناءً على البلاغات الأخيرة.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "share-area-brief",
                label: "مشاركة موجز",
                description:
                  "مشاركة ملخص المناطق مع القيادات الميدانية.",
                type: "sync",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["تقرير المناطق", "خريطة النشاط", "بيانات الانتشار"],
          },
        ],
      },
      {
        id: "committees",
        label: "اللجان",
        description: "متابعة جاهزية اللجان وتوازن توزيع المسؤوليات.",
        panels: [
          {
            id: "committees-readiness",
            label: "جاهزية اللجان",
            summary:
              "مؤشرات حول توزيع اللجان وحجم الفرق ومتطلبات الدعم المباشر.",
            icon: iconRegistry.clipboard,
            analytics: [
              {
                id: "committees-total",
                label: "إجمالي اللجان",
                value: formatNumber(totalTeams),
              },
              {
                id: "committees-coverage",
                label: "نسبة التغطية",
                value: formatPercent(volunteerCoverage),
                trend:
                  volunteerCoverage !== undefined
                    ? volunteerCoverage >= 60
                      ? "up"
                      : "down"
                    : undefined,
              },
              {
                id: "committees-average",
                label: "متوسط حجم الفريق",
                value: formatDecimal(avgTeamSize),
              },
            ],
            actions: [
              {
                id: "manage-committees",
                label: "إدارة اللجان",
                description:
                  "استعراض قوائم اللجان وتوزيع المسؤوليات التشغيلية.",
                type: "view",
                roles: ["domain-owner", "data-steward"],
                emphasis: "primary",
              },
              {
                id: "assign-leads",
                label: "تعيين منسق",
                description:
                  "تحديث المنسقين لكل لجنة وفق مستويات الجاهزية.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "export-committees",
                label: "تصدير سجل",
                description:
                  "تحميل سجل اللجان والمشرفين للمراجعة والتوثيق.",
                type: "report",
                roles: ["data-steward"],
              },
            ],
            reports: ["خريطة اللجان", "سجل التغطية", "تقرير الموارد"],
          },
        ],
      },
      {
        id: "candidates",
        label: "المرشحون",
        description: "قراءة متكاملة لأداء المرشحين وتوجهات الدعم الشعبي.",
        panels: [
          {
            id: "candidates-support",
            label: "مؤشرات المرشحين",
            summary:
              "مقاييس الدعم والتفاعل المرتبطة بحملات المرشحين عبر المناطق.",
            icon: iconRegistry.barChart,
            analytics: [
              {
                id: "support-index",
                label: "مؤشر الدعم",
                value: formatPercent(supportPercentage),
                trend: supportChange.trend,
                change: formatChange(supportChange.change, { isPercent: true }),
              },
              {
                id: "turnout-estimate",
                label: "تقدير المشاركة",
                value: formatPercent(turnoutEstimate),
              },
              {
                id: "top-support-region",
                label: "أبرز منطقة داعمة",
                value: regionSummary.busiestRegion ?? "—",
              },
            ],
            actions: [
              {
                id: "view-candidate-profiles",
                label: "عرض ملفات المرشحين",
                description:
                  "الاطلاع على الملفات المحدثة والمواد التعريفية لكل مرشح.",
                type: "view",
                roles: ["domain-owner", "operator"],
                emphasis: "primary",
              },
              {
                id: "update-candidate-message",
                label: "تحديث الرسائل الإعلامية",
                description:
                  "مواءمة الرسائل والمحتوى مع نتائج الأداء في المناطق.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "share-support-brief",
                label: "مشاركة ملخص الدعم",
                description:
                  "إرسال موجز بالتوجهات للفرق العاملة على الحملات الميدانية.",
                type: "sync",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["تقرير الأداء الإعلامي", "تحليل الدعم", "خطط التفاعل"],
          },
        ],
      },
      {
        id: "voters",
        label: "الناخبون",
        description: "متابعة دائمة لبيانات الناخبين ومعدلات المشاركة.",
        panels: [
          {
            id: "voters-overview",
            label: "ملخص الناخبين",
            summary:
              "قياسات التسجيل والمشاركة لتوجيه الجهود نحو الشرائح الأكثر أهمية.",
            icon: iconRegistry.gauge,
            analytics: [
              {
                id: "voters-total",
                label: "إجمالي الناخبين",
                value: formatNumber(totalVoters),
                trend: registrationStats.trend,
                change: formatChange(registrationStats.percentChange, {
                  isPercent: true,
                }),
              },
              {
                id: "voters-registered",
                label: "المقيدون رسمياً",
                value: formatNumber(registeredVoters),
              },
              {
                id: "voters-turnout",
                label: "نسبة المشاركة",
                value: formatPercent(turnoutPercentage),
                trend: supportChange.trend,
                change: formatChange(supportChange.change, { isPercent: true }),
              },
            ],
            actions: [
              {
                id: "view-voter-segments",
                label: "عرض الشرائح",
                description:
                  "استكشاف الشرائح الرئيسية للناخبين وتحديد أولويات الاستهداف.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "update-voter-records",
                label: "تحديث البيانات",
                description:
                  "مراجعة بيانات الناخبين وتصحيح السجلات الحساسة.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "export-voter-lists",
                label: "تصدير القوائم",
                description:
                  "تحميل قوائم الناخبين للاستخدام في الحملات الميدانية.",
                type: "report",
                roles: ["data-steward"],
              },
            ],
            reports: ["تقرير الناخبين", "سجل التسجيل", "قوائم الاتصال"],
          },
        ],
      },
      {
        id: "volunteers",
        label: "المتطوعون",
        description: "متابعة انتشار المتطوعين وجاهزيتهم لدعم الحملة.",
        panels: [
          {
            id: "volunteers-distribution",
            label: "توزيع المتطوعين",
            summary:
              "مؤشرات حول حجم المتطوعين وتوازن انتشارهم على المناطق واللجان.",
            icon: iconRegistry.users,
            analytics: [
              {
                id: "volunteers-total",
                label: "إجمالي المتطوعين",
                value: formatNumber(totalVolunteers),
              },
              {
                id: "volunteers-coverage",
                label: "نسبة التغطية",
                value: formatPercent(volunteerCoverage),
              },
              {
                id: "volunteers-average",
                label: "متوسط حجم الفريق",
                value: formatDecimal(avgTeamSize),
              },
            ],
            actions: [
              {
                id: "manage-volunteers",
                label: "إدارة المتطوعين",
                description:
                  "إدارة قوائم المتطوعين وتوزيعهم على المهام الميدانية.",
                type: "view",
                roles: ["domain-owner", "operator"],
                emphasis: "primary",
              },
              {
                id: "sync-trainings",
                label: "مزامنة التدريبات",
                description:
                  "تحديث جداول التدريب وإشعارات الحضور للمتطوعين.",
                type: "sync",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "download-roster",
                label: "تحميل القوائم",
                description:
                  "تصدير قوائم المتطوعين مع بيانات الاتصال والتوزيع.",
                type: "report",
                roles: ["data-steward"],
              },
            ],
            reports: ["كشف المتطوعين", "خطة التدريب", "ملخص الجاهزية"],
          },
        ],
      },
      {
        id: "agents",
        label: "الوكلاء",
        description: "متابعة نشاط الوكلاء والتغطية الميدانية المرتبطة بهم.",
        panels: [
          {
            id: "agents-activity",
            label: "نشاط الوكلاء",
            summary:
              "قياس حجم البلاغات وتوزيعها لتحديد الحاجة للدعم أو إعادة الانتشار.",
            icon: iconRegistry.shield,
            analytics: [
              {
                id: "agents-reports-total",
                label: "إجمالي البلاغات",
                value: formatNumber(reportDistribution.total),
                trend:
                  reportDistribution.total > 0 ? "up" : undefined,
              },
              {
                id: "agents-top-report",
                label: "أكثر البلاغات تكراراً",
                value: reportDistribution.topType ?? "—",
                change:
                  reportDistribution.topCount
                    ? `${formatNumber(reportDistribution.topCount)} حالة`
                    : undefined,
              },
              {
                id: "agents-prepared-sites",
                label: "نسبة المواقع المجهزة",
                value: formatPercent(precinctProgress),
              },
            ],
            actions: [
              {
                id: "view-agent-assignments",
                label: "متابعة التكليفات",
                description:
                  "مراجعة تكليفات الوكلاء وتغطيتهم للمواقع الحرجة.",
                type: "view",
                roles: ["domain-owner", "operator"],
                emphasis: "primary",
              },
              {
                id: "sync-agent-observers",
                label: "مزامنة الفرق",
                description:
                  "مزامنة الوكلاء والمراقبين مع التغيرات اليومية في الميدان.",
                type: "sync",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "archive-agent-logs",
                label: "أرشفة السجلات",
                description:
                  "أرشفة سجلات البلاغات لعمليات المتابعة والتدقيق.",
                type: "report",
                roles: ["data-steward"],
              },
            ],
            reports: ["تقرير الوكلاء", "قائمة البلاغات", "سجل المتابعة"],
          },
        ],
      },
      {
        id: "settings",
        label: "الإعدادات",
        description: "ملخص سريع لحالة الحوكمة وضبط الصلاحيات داخل المنصة.",
        panels: [
          {
            id: "settings-governance",
            label: "ضوابط المنصة",
            summary:
              "مراقبة شاملة للتغيرات الإدارية وإجراءات الامتثال والرقابة.",
            icon: iconRegistry.settings,
            analytics: [
              {
                id: "settings-active-roles",
                label: "أدوار فعّالة",
                value: formatNumber(3),
                trend: "up",
              },
              {
                id: "settings-policy-updates",
                label: "تحديثات السياسات",
                value: formatNumber(1),
                trend: "up",
              },
              {
                id: "settings-audit",
                label: "جاهزية التدقيق",
                value: formatPercent(100),
                trend: "up",
              },
            ],
            actions: [
              {
                id: "review-permissions",
                label: "مراجعة الصلاحيات",
                description:
                  "التأكد من توافق الأدوار مع سياسات الوصول المعتمدة.",
                type: "view",
                roles: ["domain-owner", "operator"],
                emphasis: "primary",
              },
              {
                id: "update-workflows",
                label: "تحديث مسارات العمل",
                description:
                  "مواءمة المسارات التشغيلية مع التحديثات الجديدة في الإعدادات.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "export-audit-log",
                label: "تصدير سجلات",
                description:
                  "إرسال سجلات الأنشطة الحساسة إلى أنظمة الحوكمة والتدقيق.",
                type: "report",
                roles: ["data-steward"],
              },
            ],
            reports: ["سجل الضوابط", "مراجعة الامتثال", "خريطة المسؤوليات"],
          },
        ],
      },
      {
        id: "geo-insights",
        label: "المنطقة الجغرافية",
        description:
          "عرض جغرافي لتوزيع الأنشطة مع إبراز المناطق التي تتطلب دعماً إضافياً.",
        panels: [
          {
            id: "geo-summary",
            label: "ملخص جغرافي",
            summary:
              "مؤشرات تغطي إجمالي المناطق وأعلى نقاط التركيز الميداني.",
            icon: iconRegistry.target,
            analytics: [
              {
                id: "geo-total-areas",
                label: "إجمالي المناطق",
                value: formatNumber(totalAreas),
              },
              {
                id: "geo-total-reports",
                label: "إجمالي البلاغات",
                value: formatNumber(regionSummary.totalReports),
                trend:
                  regionSummary.totalReports > 0 ? "up" : undefined,
              },
              {
                id: "geo-focus",
                label: "منطقة التركيز",
                value: regionSummary.busiestRegion ?? "—",
                change:
                  regionSummary.busiestReports > 0
                    ? `${formatNumber(regionSummary.busiestReports)} بلاغ`
                    : undefined,
              },
            ],
            actions: [
              {
                id: "view-heatmap",
                label: "عرض الخريطة الحرارية",
                description:
                  "تحليل الكثافات الميدانية وتحديد النقاط التي تتطلب الاستجابة.",
                type: "view",
                roles: ["domain-owner", "operator"],
                emphasis: "primary",
              },
              {
                id: "adjust-geo-layers",
                label: "تعديل الطبقات",
                description:
                  "تخصيص الطبقات الجغرافية وفق مصادر البيانات المتاحة.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "download-geo-report",
                label: "تحميل تقرير جغرافي",
                description:
                  "استخراج تقرير الخرائط لدعمه في غرف العمليات.",
                type: "report",
                roles: ["data-steward"],
              },
            ],
            reports: ["خريطة التوزيع", "تحليل الكثافة", "مؤشر المناطق"],
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
