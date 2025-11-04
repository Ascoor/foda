import type { ReactNode } from "react";

import { cn } from "@/infrastructure/shared/lib/utils";

interface DashboardToolbarProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const DashboardToolbar = ({
  title,
  description,
  actions,
  children,
  className,
}: DashboardToolbarProps) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/20 bg-white/60 px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60",
      className,
    )}
  >
    <div className="min-w-0">
      {title && (
        <h2 className="text-lg font-semibold tracking-tight text-foreground dark:text-white">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-3 flex flex-wrap gap-2">{children}</div>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export default DashboardToolbar;
