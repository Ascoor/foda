import { useMemo } from "react";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/shared/ui/card";
import { Skeleton } from "@/infrastructure/shared/ui/skeleton";
import {
  useThemePalette,
  type ColorToken,
  type ThemePalette,
} from "@/infrastructure/shared/hooks/useThemePalette";
import { ActivityFeed } from "../components/ActivityFeed";

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: ComponentType<{ className?: string }>;
}

interface ActivityPanelProps {
  activities: ActivityItem[];
  loading: boolean;
  heading: string;
  description: string;
}

const COLOR_SEQUENCE: ColorToken[] = [
  "primary",
  "accent",
  "secondary",
  "success",
];

const formatActivityType = (type: string) =>
  type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

interface ActivityTooltipProps extends TooltipProps<ValueType, NameType> {
  palette: ThemePalette;
  pluralLabel: string;
  singularLabel: string;
}

const ActivityTooltip = ({
  active,
  payload,
  label,
  palette,
  pluralLabel,
  singularLabel,
}: ActivityTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const [entry] = payload;
  const token = (entry.payload as { color: ColorToken }).color;
  const colors = palette.tokens[token];
  const value =
    typeof entry.value === "number" ? entry.value : Number(entry.value);

  return (
    <div
      className="rounded-xl border px-3 py-2 text-xs shadow-lg"
      style={{
        backgroundColor: palette.surface,
        borderColor: palette.border,
        color: palette.foreground,
      }}
    >
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-sm font-semibold" style={{ color: colors.base }}>
        {value} {value === 1 ? singularLabel : pluralLabel}
      </p>
    </div>
  );
};

export const ActivityPanel = ({
  activities,
  loading,
  heading,
  description,
}: ActivityPanelProps) => {
  const { t } = useTranslation();
  const palette = useThemePalette();

  const summary = useMemo(() => {
    const counter = new Map<string, number>();

    activities.forEach((activity) => {
      const key = activity.type ?? "other";
      counter.set(key, (counter.get(key) ?? 0) + 1);
    });

    return Array.from(counter.entries()).map(([type, count]) => ({
      type,
      count,
      label: t(`dashboard.activity_types.${type}`, {
        defaultValue: formatActivityType(type),
      }),
    }));
  }, [activities, t]);

  const chartData = useMemo(
    () =>
      summary.map((item, index) => ({
        label: item.label,
        count: item.count,
        color: COLOR_SEQUENCE[index % COLOR_SEQUENCE.length],
      })),
    [summary],
  );

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {heading}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <Skeleton className="h-72 w-full rounded-3xl" />
        ) : (
          <>
            <div className="rounded-3xl border border-[hsla(var(--border)/0.25)] bg-[hsl(var(--surface))] p-5 shadow-sm transition-colors dark:border-[hsla(var(--border)/0.2)] dark:bg-[hsla(var(--surface)/0.6)]">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>
                  {t("dashboard.activity_summary", {
                    defaultValue: "Activity summary",
                  })}
                </span>
                <span className="rounded-full bg-[hsla(var(--muted)/0.4)] px-3 py-1 text-[hsl(var(--foreground))]">
                  {t("dashboard.last_7_days", { defaultValue: "Last 7 days" })}
                </span>
              </div>
              <div className="relative mt-4 h-48">
                {chartData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid horizontal={false} stroke={palette.grid} />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: palette.mutedForeground, fontSize: 11 }}
                        allowDecimals={false}
                      />
                      <YAxis
                        dataKey="label"
                        type="category"
                        width={120}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: palette.foreground,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      />
                      <Tooltip
                        cursor={{ fill: palette.mutedSoft }}
                        content={
                          <ActivityTooltip
                            palette={palette}
                            pluralLabel={t("dashboard.activity_unit", {
                              defaultValue: "updates",
                            })}
                            singularLabel={t("dashboard.activity_unit_single", {
                              defaultValue: "update",
                            })}
                          />
                        }
                      />
                      <Bar dataKey="count" radius={[0, 16, 16, 0]} barSize={24}>
                        {chartData.map((entry) => {
                          const colors = palette.tokens[entry.color];
                          return (
                            <Cell
                              key={entry.label}
                              fill={colors.soft}
                              stroke={colors.base}
                              strokeWidth={2}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    {t("common.no_data", { defaultValue: "No data available" })}
                  </div>
                )}
              </div>
            </div>
            <ActivityFeed activities={activities} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
