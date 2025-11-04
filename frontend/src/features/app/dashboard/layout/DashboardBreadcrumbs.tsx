import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useNavBreadcrumbs } from "@/routing/nav/useNavigationContext";
import type { BreadcrumbMatch } from "@/routing/nav/nav.schema";

import {
  DASHBOARD_BREADCRUMBS_EVENT,
  type DashboardBreadcrumbsEventDetail,
} from "../state/events";
import type { DashboardBreadcrumb } from "./types";

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
  const [eventItems, setEventItems] = useState<DashboardBreadcrumb[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleEvent = (event: Event) => {
      const customEvent = event as CustomEvent<DashboardBreadcrumbsEventDetail>;
      if (customEvent.detail?.items) {
        setEventItems(customEvent.detail.items);
      }
    };

    window.addEventListener(DASHBOARD_BREADCRUMBS_EVENT, handleEvent);

    return () => {
      window.removeEventListener(DASHBOARD_BREADCRUMBS_EVENT, handleEvent);
    };
  }, []);

  const resolvedItems = useMemo(
    () => {
      if (items !== undefined) {
        return items;
      }

      if (eventItems.length > 0) {
        return eventItems;
      }

      return transformTrail(navTrail, t);
    },
    [eventItems, items, navTrail, t],
  );

  if (!resolvedItems.length) {
    return null;
  }

  return (
    <nav
      className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      aria-label={t("navigation.main")}
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
