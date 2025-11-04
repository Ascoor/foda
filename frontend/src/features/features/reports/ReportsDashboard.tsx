import { useMemo } from "react";
import { Activity, Compass, Flag, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardMeta,
  DashboardCardSubtitle,
  DashboardCardTitle,
  DashboardTable,
  DashboardToolbar,
  FilterBar,
  StatMetric,
} from "@/ui/components/dashboard";

import {
StackedBarChart,
TrendLineChart,
} from "@/ui/components/dashboard/charts";
const turnoutTrend = [
  { name: "Mon", value: 58 },
  { name: "Tue", value: 61 },
  { name: "Wed", value: 63 },
  { name: "Thu", value: 66 },
  { name: "Fri", value: 68 },
  { name: "Sat", value: 71 },
  { name: "Sun", value: 73 },
];

const outreachData = [
  { name: "North", valueA: 320, valueB: 210 },
  { name: "Central", valueA: 280, valueB: 190 },
  { name: "South", valueA: 260, valueB: 180 },
  { name: "East", valueA: 240, valueB: 170 },
];

const topDistricts = [
  {
    district: "Mansoura North",
    turnout: "78%",
    volunteers: 124,
    alerts: 3,
  },
  {
    district: "Mansoura West",
    turnout: "74%",
    volunteers: 98,
    alerts: 1,
  },
  {
    district: "Dekernes",
    turnout: "71%",
    volunteers: 86,
    alerts: 0,
  },
  {
    district: "Aga",
    turnout: "69%",
    volunteers: 72,
    alerts: 2,
  },
];

export const ReportsDashboard = () => {
  const { t } = useTranslation();

  const metrics = useMemo(
    () => [
      {
        id: "turnout",
        label: t("reports.metrics.turnout"),
        value: "72.4%",
        change: "+4.1%",
        trend: "up" as const,
        tone: "primary" as const,
        icon: Activity,
        footer: t("reports.metrics.turnoutFooter"),
      },
      {
        id: "volunteers",
        label: t("reports.metrics.volunteers"),
        value: 1864,
        change: "+128",
        trend: "up" as const,
        tone: "success" as const,
        icon: Users,
        footer: t("reports.metrics.volunteersFooter"),
      },
      {
        id: "coverage",
        label: t("reports.metrics.coverage"),
        value: "87%",
        change: "+6%",
        trend: "up" as const,
        tone: "secondary" as const,
        icon: Flag,
        footer: t("reports.metrics.coverageFooter"),
      },
      {
        id: "alerts",
        label: t("reports.metrics.alerts"),
        value: 14,
        change: "-5",
        trend: "down" as const,
        tone: "warning" as const,
        icon: Compass,
        footer: t("reports.metrics.alertsFooter"),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <DashboardToolbar
        title={t("reports.toolbar.title")}
        description={t("reports.toolbar.subtitle")}
        actions={
          <div className="flex gap-2">
            <button className="rounded-full bg-[hsla(var(--primary)/0.15)] px-4 py-2 text-sm font-semibold text-[hsl(var(--primary))] shadow-sm transition hover:bg-[hsla(var(--primary)/0.25)]">
              {t("reports.actions.export")}
            </button>
            <button className="rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white/40">
              {t("reports.actions.schedule")}
            </button>
          </div>
        }
      >
        <FilterBar
          options={[
            { id: "all", label: t("reports.filters.all"), active: true },
            { id: "urban", label: t("reports.filters.urban"), count: 12 },
            { id: "rural", label: t("reports.filters.rural"), count: 9 },
            { id: "priority", label: t("reports.filters.priority"), count: 4 },
          ]}
        />
      </DashboardToolbar>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatMetric key={metric.id} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <DashboardCard className="lg:col-span-7">
          <DashboardCardHeader>
            <DashboardCardTitle>
              {t("reports.sections.turnoutTrend")}
            </DashboardCardTitle>
            <DashboardCardSubtitle>
              {t("reports.sections.turnoutTrendSubtitle")}
            </DashboardCardSubtitle>
            <DashboardCardMeta>
              <span>{t("reports.sections.updated", { time: "2h" })}</span>
            </DashboardCardMeta>
          </DashboardCardHeader>
          <DashboardCardBody className="pt-0">
            <TrendLineChart data={turnoutTrend} />
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard className="lg:col-span-5">
          <DashboardCardHeader>
            <DashboardCardTitle>{t("reports.sections.outreach")}</DashboardCardTitle>
            <DashboardCardSubtitle>
              {t("reports.sections.outreachSubtitle")}
            </DashboardCardSubtitle>
          </DashboardCardHeader>
          <DashboardCardBody className="pt-0">
            <StackedBarChart
              data={outreachData}
              series={[
                {
                  key: "valueA",
                  label: t("reports.series.field"),
                  color: "hsl(var(--primary))",
                },
                {
                  key: "valueB",
                  label: t("reports.series.digital"),
                  color: "hsl(var(--accent))",
                },
              ]}
            />
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>{t("reports.sections.districts")}</DashboardCardTitle>
          <DashboardCardSubtitle>
            {t("reports.sections.districtsSubtitle")}
          </DashboardCardSubtitle>
        </DashboardCardHeader>
        <DashboardCardBody className="pt-0">
          <DashboardTable
            columns={[
              { key: "district", label: t("reports.table.district") },
              { key: "turnout", label: t("reports.table.turnout"), align: "right" },
              { key: "volunteers", label: t("reports.table.volunteers"), align: "right" },
              { key: "alerts", label: t("reports.table.alerts"), align: "right" },
            ]}
            rows={topDistricts}
          />
        </DashboardCardBody>
      </DashboardCard>
    </div>
  );
};

export default ReportsDashboard;
