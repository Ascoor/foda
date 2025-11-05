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
      id: "electoral-operations",
      label: "العمليات الانتخابية",
      description:
        "إشراف مركزي على المعطيات الانتخابية مع ارتباط مباشر بمصادر البيانات الحية.",
      icon: iconRegistry.compass,
      submodules: [
        {
          id: "elections",
          label: "إدارة الانتخابات",
          description:
            "ملخص شامل للتسجيل والمشاركة ونقاط الإبلاغ التي يتم تحديثها تلقائياً.",
          panels: [
            {
              id: "election-overview",
              label: "وضع الانتخابات الحالي",
              summary:
                "مؤشرات التسجيل والإبلاغ الميداني المجمّعة من التكاملات الانتخابية الرسمية.",
              icon: iconRegistry.fileStack,
              analytics: [
                {
                  id: "registered",
                  label: "الإجمالي المسجل",
                  value: formatNumber(registeredVoters),
                  trend: registrationStats.trend,
                  change: formatChange(registrationStats.percentChange, {
                    isPercent: true,
                  }),
                },
                {
                  id: "turnout",
                  label: "نسبة المشاركة",
                  value: formatPercent(turnoutPercentage),
                  trend: supportChange.trend,
                  change: formatChange(supportChange.change, { isPercent: true }),
                },
                {
                  id: "reporting",
                  label: "مراكز الإبلاغ النشطة",
                  value: formatNumber(reportingPrecincts),
                  trend:
                    precinctProgress !== undefined
                      ? precinctProgress >= 50
                        ? "up"
                        : "down"
                      : undefined,
                  change: formatChange(precinctProgress, { isPercent: true }),
                },
              ],
              actions: [
                {
                  id: "view-overview",
                  label: "عرض نظرة عامة",
                  description:
                    "استعراض ملخص الحالة الراهنة لكل انتخابات مع المؤشرات الحرجة.",
                  type: "view",
                  roles: ["domain-owner", "data-steward", "operator"],
                  emphasis: "primary",
                },
                {
                  id: "update-status",
                  label: "تحديث الحالة",
                  description:
                    "تعديل الحالة التشغيلية ومواءمتها مع الجدول الزمني العام.",
                  type: "update",
                  roles: ["domain-owner", "data-steward"],
                },
                {
                  id: "sync-observers",
                  label: "مزامنة المراقبين",
                  description:
                    "توزيع فرق المراقبة على اللجان بناءً على أحدث بيانات المشاركة.",
                  type: "sync",
                  roles: ["domain-owner", "operator"],
                },
              ],
              reports: [
                "تقرير الحالة اليومية",
                "مؤشر المخاطر",
                "توزيع اللجان",
              ],
            },
            {
              id: "participation-insights",
              label: "تحليلات المشاركة",
              summary:
                "تحليل اتجاهات الدعم والتقارير اليومية مع إبراز المناطق الأكثر نشاطاً.",
              icon: iconRegistry.barChart,
              analytics: [
                {
                  id: "support-score",
                  label: "مؤشر الدعم",
                  value: formatPercent(supportPercentage),
                  trend: supportChange.trend,
                  change: formatChange(supportChange.change, { isPercent: true }),
                },
                {
                  id: "reports-today",
                  label: "تقارير اليوم",
                  value: formatNumber(regionSummary.totalReports),
                  trend:
                    regionSummary.totalReports > 0 ? "up" : undefined,
                  change:
                    regionSummary.totalReports > 0
                      ? `${formatNumber(regionSummary.totalReports)} تقارير`
                      : undefined,
                },
                {
                  id: "top-region",
                  label: "أكثر المناطق نشاطاً",
                  value: regionSummary.busiestRegion ?? "—",
                  trend:
                    regionSummary.busiestReports > 0 ? "up" : undefined,
                  change:
                    regionSummary.busiestReports > 0
                      ? `${formatNumber(regionSummary.busiestReports)} بلاغ`
                      : undefined,
                },
              ],
              actions: [
                {
                  id: "view-timeseries",
                  label: "استعراض الاتجاهات",
                  description:
                    "عرض الرسوم البيانية التفاعلية لمعدلات المشاركة عبر الوقت.",
                  type: "view",
                  roles: ["domain-owner", "data-steward", "operator"],
                  emphasis: "primary",
                },
                {
                  id: "flag-anomaly",
                  label: "إبلاغ عن شذوذ",
                  description:
                    "إرسال تنبيه فوري عن أي تراجع مفاجئ في المؤشرات الحيوية.",
                  type: "update",
                  roles: ["domain-owner", "operator"],
                },
                {
                  id: "download-report",
                  label: "تحميل تقرير",
                  description:
                    "استخراج تقرير المشاركة التفصيلي لمشاركته مع اللجان العليا.",
                  type: "report",
                  roles: ["data-steward", "operator"],
                },
              ],
              reports: [
                "ملخص المشاركة اليومي",
                "تحليل المناطق",
                "إنذار مبكر",
              ],
            },
          ],
        },
        {
          id: "scheduling",
          label: "جدولة العمليات",
          description:
            "متابعة الموارد والمهام الميدانية لضمان الالتزام بالخطط الزمنية.",
          panels: [
            {
              id: "ballot-schedules",
              label: "جداول الموارد",
              summary:
                "متابعة الطاقة التشغيلية وعدد الفعاليات المعتمدة خلال فترة التقارير الأخيرة.",
              icon: iconRegistry.clipboard,
              analytics: [
                {
                  id: "events",
                  label: "الفعاليات المجدولة",
                  value: formatNumber(totalEvents),
                  trend: totalEvents && totalEvents > 0 ? "up" : undefined,
                },
                {
                  id: "coverage",
                  label: "نسبة تغطية الفرق",
                  value: formatPercent(volunteerCoverage),
                  trend:
                    volunteerCoverage !== undefined
                      ? volunteerCoverage >= 75
                        ? "up"
                        : "down"
                      : undefined,
                },
                {
                  id: "teams",
                  label: "الفرق الجاهزة",
                  value: formatNumber(totalTeams),
                  trend: totalTeams && totalTeams > 0 ? "up" : undefined,
                },
              ],
              actions: [
                {
                  id: "generate-schedule",
                  label: "إنشاء جدول",
                  description:
                    "إطلاق معالج لإنشاء جدول محسّن بناءً على الطاقة الميدانية.",
                  type: "create",
                  roles: ["domain-owner", "data-steward"],
                },
                {
                  id: "publish-updates",
                  label: "نشر التحديثات",
                  description:
                    "إعلام جميع الأطراف بالتعديلات الجديدة عبر قنوات الاتصال الرسمية.",
                  type: "sync",
                  roles: ["domain-owner", "operator"],
                },
                {
                  id: "export-schedule",
                  label: "تصدير الجدول",
                  description:
                    "تصدير الجداول إلى تنسيقات متعددة وإرسالها إلى غرفة العمليات.",
                  type: "report",
                  roles: ["data-steward", "operator"],
                },
              ],
              reports: ["تحليل الجاهزية", "قائمة التغطية", "مخطط الموارد"],
            },
          ],
        },
      ],
    },
    {
      id: "field-operations",
      label: "العمليات الميدانية",
      description:
        "متابعة مباشرة للفرق والمتطوعين مع مراقبة مستويات الجاهزية والانتشار.",
      icon: iconRegistry.workflow,
      submodules: [
        {
          id: "teams-overview",
          label: "إدارة الفرق",
          description:
            "تحليلات حول هيكل الفرق الميدانية وتوزيع المتطوعين على المناطق.",
          panels: [
            {
              id: "team-readiness",
              label: "جاهزية الفرق",
              summary:
                "مؤشرات تعكس أعداد الفرق والمتطوعين ونسبة التوزيع على الوحدات المختلفة.",
              icon: iconRegistry.users,
              analytics: [
                {
                  id: "active-teams",
                  label: "الفرق النشطة",
                  value: formatNumber(totalTeams),
                  trend: totalTeams && totalTeams > 0 ? "up" : undefined,
                },
                {
                  id: "volunteer-count",
                  label: "عدد المتطوعين",
                  value: formatNumber(totalVolunteers),
                  trend:
                    totalVolunteers && totalVolunteers > 0 ? "up" : undefined,
                },
                {
                  id: "avg-team-size",
                  label: "متوسط حجم الفريق",
                  value: formatDecimal(avgTeamSize),
                  trend: avgTeamSize && avgTeamSize > 0 ? "up" : undefined,
                },
              ],
              actions: [
                {
                  id: "plan-training",
                  label: "خطة تدريب",
                  description:
                    "بناء خطة تدريبية تستهدف الفرق ذات الأداء الأقل في المؤشرات.",
                  type: "create",
                  roles: ["domain-owner", "operator"],
                },
                {
                  id: "assign-volunteers",
                  label: "توزيع المتطوعين",
                  description:
                    "إعادة توزيع المتطوعين بشكل ديناميكي بناءً على كثافة البلاغات.",
                  type: "update",
                  roles: ["data-steward", "operator"],
                },
                {
                  id: "export-teams",
                  label: "تصدير كشوف",
                  description:
                    "إصدار كشوف الفرق والمتطوعين لتنسيقها مع غرف العمليات المحلية.",
                  type: "report",
                  roles: ["domain-owner", "data-steward"],
                },
              ],
              reports: ["تقرير الجاهزية", "توزيع الفرق", "سجلات المتطوعين"],
            },
            {
              id: "resource-dispatch",
              label: "توجيه الموارد",
              summary:
                "لوحة لتتبع الانتشار الميداني ونسبة تغطية الموارد مقارنة بالحاجة الفعلية.",
              icon: iconRegistry.target,
              analytics: [
                {
                  id: "coverage-index",
                  label: "مؤشر التغطية",
                  value: formatPercent(volunteerCoverage),
                  trend:
                    volunteerCoverage !== undefined
                      ? volunteerCoverage >= 60
                        ? "up"
                        : "down"
                      : undefined,
                },
                {
                  id: "reports-total",
                  label: "إجمالي البلاغات",
                  value: formatNumber(reportDistribution.total),
                  trend:
                    reportDistribution.total > 0 ? "up" : undefined,
                },
                {
                  id: "top-report-type",
                  label: "أكثر أنواع البلاغات",
                  value: reportDistribution.topType ?? "—",
                  change: reportDistribution.topCount
                    ? `${formatNumber(reportDistribution.topCount)} بلاغ`
                    : undefined,
                },
              ],
              actions: [
                {
                  id: "optimize-dispatch",
                  label: "تحسين الانتشار",
                  description:
                    "اقتراح تغييرات فورية على توزيع الفرق بناءً على ضغط البلاغات.",
                  type: "update",
                  roles: ["domain-owner", "operator"],
                },
                {
                  id: "share-brief",
                  label: "مشاركة ملخص",
                  description:
                    "مشاركة ملخص ميداني مع المشرفين في الخطوط الأمامية.",
                  type: "sync",
                  roles: ["domain-owner", "data-steward", "operator"],
                },
                {
                  id: "archive-logs",
                  label: "أرشفة السجلات",
                  description:
                    "أرشفة البلاغات ومعايير القرار للمراجعة اللاحقة.",
                  type: "report",
                  roles: ["data-steward"],
                },
              ],
              reports: ["ملخص الانتشار", "خريطة الضغط", "قائمة الأولويات"],
            },
          ],
        },
      ],
    },
    {
      id: "data-intelligence",
      label: "الاستخبارات الرقمية",
      description:
        "تحليلات متقدمة حول التغطية والدعم لاتخاذ قرارات استراتيجية بسرعة.",
      icon: iconRegistry.gauge,
      submodules: [
        {
          id: "insights",
          label: "ملخصات تنبؤية",
          description:
            "عرض موجز للاتجاهات الرئيسية وتحذيرات المخاطر المستندة إلى البيانات المجمعة.",
          panels: [
            {
              id: "analytics-summary",
              label: "مؤشرات الدعم",
              summary:
                "ملخص سريع لمؤشرات الدعم والتغطية والفجوات التي تحتاج إلى تدخل عاجل.",
              icon: iconRegistry.pieChart,
              analytics: [
                {
                  id: "support-percentage",
                  label: "نسبة الدعم",
                  value: formatPercent(supportPercentage),
                  trend: supportChange.trend,
                  change: formatChange(supportChange.change, { isPercent: true }),
                },
                {
                  id: "turnout-estimate",
                  label: "تقدير المشاركة",
                  value: formatPercent(turnoutEstimate),
                  trend:
                    turnoutEstimate !== undefined
                      ? turnoutEstimate >= 50
                        ? "up"
                        : "down"
                      : undefined,
                },
                {
                  id: "coverage-gap",
                  label: "فجوة التغطية",
                  value: formatPercent(coverageGap),
                  trend:
                    coverageGap !== undefined
                      ? coverageGap <= 20
                        ? "up"
                        : "down"
                      : undefined,
                },
              ],
              actions: [
                {
                  id: "share-dashboard",
                  label: "مشاركة لوحة",
                  description:
                    "نشر لوحة المؤشرات مع أصحاب المصلحة لاتخاذ قرارات مشتركة.",
                  type: "sync",
                  roles: ["domain-owner", "data-steward", "operator"],
                },
                {
                  id: "configure-alerts",
                  label: "ضبط التنبيهات",
                  description:
                    "تخصيص تنبيهات ذكية عند انخفاض المؤشرات الحيوية عن الحدود المحددة.",
                  type: "update",
                  roles: ["domain-owner", "data-steward"],
                },
                {
                  id: "export-analytics",
                  label: "تصدير التحليلات",
                  description:
                    "إرسال ملخص التحليلات إلى الأنظمة المتكاملة أو مستودعات البيانات.",
                  type: "report",
                  roles: ["data-steward"],
                },
              ],
              reports: ["ملخص الاتجاهات", "خطة معالجة المخاطر", "ملف المؤشرات"],
            },
            {
              id: "governance-controls",
              label: "ضوابط الحوكمة",
              summary:
                "لوحة لمراقبة إجراءات الوصول والمهام الحرجة وتوزيع الأدوار التشغيلية.",
              icon: iconRegistry.shield,
              analytics: [
                {
                  id: "active-roles",
                  label: "أدوار فعّالة",
                  value: formatNumber(3),
                  trend: "up",
                },
                {
                  id: "policy-updates",
                  label: "تحديثات السياسات",
                  value: formatNumber(1),
                  trend: "up",
                },
                {
                  id: "audit-readiness",
                  label: "جاهزية التدقيق",
                  value: formatPercent(100),
                  trend: "up",
                },
              ],
              actions: [
                {
                  id: "review-integrations",
                  label: "مراجعة الصلاحيات",
                  description:
                    "مراجعة تكامل الأدوار والمهام للتأكد من الالتزام بالسياسات الموحدة.",
                  type: "view",
                  roles: ["domain-owner", "operator"],
                },
                {
                  id: "update-workflows",
                  label: "تحديث مسارات العمل",
                  description:
                    "مواءمة المسارات التشغيلية مع متطلبات الضبط الجديدة.",
                  type: "update",
                  roles: ["domain-owner", "data-steward"],
                },
                {
                  id: "audit-export",
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
    queryKey: ["dashboard", "hierarchy", campaignId],
    queryFn: () => fetchDashboardHierarchy(campaignId),
    staleTime: 60_000,
  });
};
