import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3 } from "lucide-react";
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
  useThemePalette,
  type ColorToken,
  type ThemePalette,
} from "@/infrastructure/shared/hooks/useThemePalette";

interface ProgressItem {
  label: string;
  value: number;
  color: ColorToken;
}

interface ProgressChartProps {
  data: ProgressItem[];
  overall: number;
  remaining: number;
}

interface ProgressTooltipProps extends TooltipProps<ValueType, NameType> {
  palette: ThemePalette;
}

const ProgressTooltip = ({
  active,
  payload,
  label,
  palette,
}: ProgressTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const [entry] = payload;
  const stage = (entry.payload as { color: ColorToken }).color;
  const color = palette.tokens[stage];
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
      <p className="mt-1 text-sm font-semibold" style={{ color: color.base }}>
        {`${Math.round(value)}%`}
      </p>
    </div>
  );
};

export const ProgressChart = ({
  data,
  overall,
  remaining,
}: ProgressChartProps) => {
  const { t } = useTranslation();
  const palette = useThemePalette();

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        label: item.label,
        value: item.value,
        color: item.color,
      })),
    [data],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[hsla(var(--border)/0.35)] bg-[hsl(var(--surface))] p-5 shadow-sm transition-colors dark:border-[hsla(var(--border)/0.25)] dark:bg-[hsla(var(--surface)/0.65)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BarChart3
              className="h-5 w-5 text-[hsl(var(--primary))]"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold text-foreground">
              {t("dashboard.election_progress", {
                defaultValue: "Election progress",
              })}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-[hsla(var(--primary)/0.12)] px-3 py-1 font-medium text-[hsl(var(--primary))]">
              {t("dashboard.overall_progress", {
                defaultValue: "Overall progress",
              })}
              : {Math.round(overall)}%
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[hsla(var(--secondary)/0.12)] px-3 py-1 font-medium text-[hsl(var(--secondary))]">
              {t("dashboard.remaining_label", { defaultValue: "Remaining" })}:{" "}
              {Math.round(remaining)}
            </span>
          </div>
        </div>

        <div className="relative mt-6 h-64 w-full">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 8, left: -12, bottom: 4 }}
                barSize={48}
              >
                <CartesianGrid
                  stroke={palette.grid}
                  vertical={false}
                  strokeDasharray="3 6"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: palette.mutedForeground, fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: palette.mutedForeground, fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: palette.mutedSoft }}
                  content={<ProgressTooltip palette={palette} />}
                />
                <Bar dataKey="value" radius={[18, 18, 18, 18]}>
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
    </div>
  );
};
