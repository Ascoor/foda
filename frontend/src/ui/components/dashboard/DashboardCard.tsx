import * as React from "react";

import { cn } from "@/infrastructure/shared/lib/utils";

export interface DashboardCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "surface";
  bleed?: boolean;
}

export const DashboardCard = React.forwardRef<HTMLDivElement, DashboardCardProps>(
  ({ className, variant = "glass", bleed, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group/dashboard-card relative overflow-hidden rounded-[28px] border backdrop-blur-xl transition-shadow",
        variant === "glass"
          ? "border-white/20 bg-white/65 shadow-[0_20px_60px_rgba(20,20,60,0.25)] dark:border-white/10 dark:bg-slate-900/65"
          : "border-white/25 bg-[hsla(var(--surface)/0.85)] shadow-[0_12px_40px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-900/80",
        bleed && "-m-2",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/10 via-cyan-100/10 to-purple-200/10 opacity-70 mix-blend-soft-light" />
      <div className="relative h-full w-full">{props.children}</div>
    </div>
  ),
);
DashboardCard.displayName = "DashboardCard";

export interface DashboardCardSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export const DashboardCardHeader = React.forwardRef<
  HTMLDivElement,
  DashboardCardSectionProps
>(({ className, padded = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-2",
      padded && "px-6 pb-4 pt-6",
      className,
    )}
    {...props}
  />
));
DashboardCardHeader.displayName = "DashboardCardHeader";

export const DashboardCardBody = React.forwardRef<
  HTMLDivElement,
  DashboardCardSectionProps
>(({ className, padded = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(padded && "px-6 pb-6", className)}
    {...props}
  />
));
DashboardCardBody.displayName = "DashboardCardBody";

export const DashboardCardFooter = React.forwardRef<
  HTMLDivElement,
  DashboardCardSectionProps
>(({ className, padded = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-4",
      padded && "px-6 pb-6",
      className,
    )}
    {...props}
  />
));
DashboardCardFooter.displayName = "DashboardCardFooter";

export const DashboardCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold tracking-tight text-foreground/90 dark:text-white",
      className,
    )}
    {...props}
  />
));
DashboardCardTitle.displayName = "DashboardCardTitle";

export const DashboardCardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DashboardCardSubtitle.displayName = "DashboardCardSubtitle";

export const DashboardCardMeta = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-wrap items-center gap-3 text-xs text-muted-foreground", className)}
    {...props}
  />
));
DashboardCardMeta.displayName = "DashboardCardMeta";
