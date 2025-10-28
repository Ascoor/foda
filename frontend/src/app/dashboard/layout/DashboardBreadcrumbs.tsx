import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useNavBreadcrumbs } from "@/nav/useNavigationContext";
import type { BreadcrumbMatch } from "@/nav/nav.schema";

interface DashboardBreadcrumb {
  id: string;
  label: string;
  level?: "module" | "submodule" | "panel";
  path?: string;
}

interface DashboardBreadcrumbsProps {
  items?: DashboardBreadcrumb[];
  onNavigate?: (item: DashboardBreadcrumb) => void;
}

const transformTrail = (
  trail: BreadcrumbMatch[],
  translate: ReturnType<typeof useTranslation>["t"],
): DashboardBreadcrumb[] =>
  trail.map((crumb) => ({
    id: crumb.id,
    label: translate(crumb.breadcrumbKey ?? crumb.i18nKey),
    level: "module",
    path: crumb.path,
  }));

export const DashboardBreadcrumbs = ({
  items,
  onNavigate,
}: DashboardBreadcrumbsProps) => {
  const { t } = useTranslation();
  const navTrail = useNavBreadcrumbs();
  const resolvedItems = useMemo(
    () => items ?? transformTrail(navTrail, t),
    [items, navTrail, t],
  );

  if (!resolvedItems.length) {
    return null;
  }

  return (
    <nav
      className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      aria-label={t('nav.main')}
    >
      {resolvedItems.map((item, index) => {
        const isLast = index === resolvedItems.length - 1;
        if (isLast) {
          return (
            <span
              key={item.id}
              className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary"
            >
              {item.label}
            </span>
          );
        }

        const target = (
          <span className="flex items-center gap-2" key={item.id}>
            {item.path ? (
              <NavLink
                to={item.path}
                className="rounded-full bg-background/80 px-3 py-1 text-foreground transition hover:bg-primary/10 hover:text-primary"
                onClick={() => onNavigate?.(item)}
              >
                {item.label}
              </NavLink>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate?.(item)}
                className="rounded-full bg-background/80 px-3 py-1 text-foreground transition hover:bg-primary/10 hover:text-primary"
              >
                {item.label}
              </button>
            )}
            <span className="text-foreground/40">›</span>
          </span>
        );

        return target;
      })}
    </nav>
  );
};

export type { DashboardBreadcrumb };
