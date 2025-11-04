import * as React from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { cn } from "@/infrastructure/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/infrastructure/shared/ui/tooltip";

import type { NavigationItem } from "./navigation.config";

export interface SmartItemProps {
  item: NavigationItem;
  label: string;
  isCollapsed: boolean;
  isExpanded?: boolean;
  isActive: boolean;
  direction: "ltr" | "rtl";
  onToggle?: () => void;
  onNavigate?: () => void;
  badge?: number;
  depth?: number;
  children?: React.ReactNode;
}

export const SmartItem: React.FC<SmartItemProps> = ({
  item,
  label,
  isCollapsed,
  isExpanded,
  isActive,
  direction,
  onToggle,
  onNavigate,
  badge,
  depth = 0,
  children,
}) => {
  const Icon = item.icon;
  const hasChildren = Boolean(item.children?.length);
  const isRTL = direction === "rtl";
  const collapsedIconOnly = isCollapsed && depth === 0;

  const contentClasses = cn(
    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
    isActive
      ? "bg-primary text-white shadow-glow"
      : "text-muted-foreground hover:bg-muted/10 hover:text-foreground",
    collapsedIconOnly ? "justify-center" : "",
    isRTL && !collapsedIconOnly ? "flex-row-reverse text-right" : "",
  );

  const iconClasses = cn(
    "h-5 w-5 transition-transform",
    isActive && "animate-glow-pulse text-white",
  );

  const badgeClasses = cn(
    "inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-secondary px-2 text-xs font-semibold text-secondary-foreground",
    collapsedIconOnly &&
      (isRTL ? "absolute -top-1 -left-1" : "absolute -top-1 -right-1"),
  );

  const labelContent = !collapsedIconOnly && (
    <span className="flex-1 truncate">{label}</span>
  );

  const badgeContent = badge ? <span className={badgeClasses}>{badge}</span> : null;

  const handleToggle = () => {
    if (hasChildren && !isCollapsed) {
      onToggle?.();
    }
  };

  const iconWrapperClasses = cn(
    "relative flex items-center gap-3",
    isRTL && !collapsedIconOnly ? "flex-row-reverse" : "",
  );

  const interactiveContent = hasChildren && !collapsedIconOnly ? (
    <button type="button" className={contentClasses} onClick={handleToggle}>
      <span className={iconWrapperClasses}>
        <Icon className={iconClasses} />
        {badgeContent}
      </span>
      {labelContent}
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform",
          isRTL && "rotate-180",
          isExpanded && "rotate-180",
        )}
      />
    </button>
  ) : (
    <NavLink
      to={item.path}
      className={contentClasses}
      onClick={() => {
        onNavigate?.();
      }}
    >
      <span className={iconWrapperClasses}>
        <Icon className={iconClasses} />
        {badgeContent}
      </span>
      {labelContent}
    </NavLink>
  );

  const wrappedInteractive = collapsedIconOnly ? (
    <Tooltip>
      <TooltipTrigger asChild>{interactiveContent}</TooltipTrigger>
      <TooltipContent
        side={isRTL ? "left" : "right"}
        align="center"
        className="bg-popover text-popover-foreground"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  ) : (
    interactiveContent
  );

  return (
    <li className="space-y-2">
      {wrappedInteractive}
      {children}
    </li>
  );
};
