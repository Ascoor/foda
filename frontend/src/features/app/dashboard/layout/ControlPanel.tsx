import {
  DashboardPanel,
  DashboardAction,
  GovernanceRole,
  governanceRoles,
} from "../data/hierarchy";
import { cn } from "@/infrastructure/shared/lib/utils";

const actionTypeLabels: Record<DashboardAction["type"], string> = {
  view: "عرض",
  create: "إضافة",
  update: "تعديل",
  report: "تقارير",
  sync: "مزامنة",
};

const actionTypeStyles: Record<DashboardAction["type"], string> = {
  view: "bg-sky-500/10 text-sky-400",
  create: "bg-emerald-500/10 text-emerald-400",
  update: "bg-amber-500/10 text-amber-400",
  report: "bg-purple-500/10 text-purple-400",
  sync: "bg-rose-500/10 text-rose-400",
};

const emphasisStyles: Record<NonNullable<DashboardAction["emphasis"]>, string> = {
  primary: "border border-primary/50 bg-primary/10 text-primary",
  secondary: "border border-foreground/30",
  destructive: "border border-destructive/60 text-destructive",
};

interface ControlPanelProps {
  panel: DashboardPanel;
  activeRole: GovernanceRole;
}

export const ControlPanel = ({ panel, activeRole }: ControlPanelProps) => {
  const Icon = panel.icon;
  const availableActions = panel.actions.filter((action) =>
    action.roles.includes(activeRole)
  );

  return (
    <section className="glass-card relative flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-background/70 p-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{panel.label}</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {panel.summary}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">المسؤول الحالي:</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
            {governanceRoles[activeRole]}
          </span>
        </div>
      </header>

      {panel.analytics && panel.analytics.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {panel.analytics.map((metric) => (
            <div
              key={metric.id}
              className="glass-card rounded-2xl border border-white/10 bg-gradient-to-br from-background to-foreground/5 p-5"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {metric.value}
              </p>
              {(metric.trend || metric.change) && (
                <p
                  className={cn(
                    "mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                    metric.trend === "down"
                      ? "bg-rose-500/10 text-rose-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  )}
                >
                  {metric.change}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">لوحة العمليات</h3>
          <span className="text-xs text-muted-foreground">
            {availableActions.length} عملية مخصصة لدور {governanceRoles[activeRole]}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {availableActions.length > 0 ? (
            availableActions.map((action) => (
              <div
                key={action.id}
                className={cn(
                  "glass-card flex h-full flex-col gap-3 rounded-2xl border border-white/10 p-5",
                  action.emphasis ? emphasisStyles[action.emphasis] : undefined
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">
                    {action.label}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      actionTypeStyles[action.type]
                    )}
                  >
                    {actionTypeLabels[action.type]}
                  </span>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {action.description}
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  {action.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-background/80 px-2 py-1"
                    >
                      {governanceRoles[role]}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-white/20 bg-background/80 p-6 text-center text-sm text-muted-foreground">
              لا توجد عمليات متاحة لهذا الدور في الوقت الحالي.
            </div>
          )}
        </div>
      </div>

      {panel.reports && panel.reports.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">التقارير المرتبطة</h3>
          <div className="flex flex-wrap gap-2">
            {panel.reports.map((report) => (
              <span
                key={report}
                className="rounded-full bg-foreground/5 px-4 py-2 text-xs text-foreground/70"
              >
                {report}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
