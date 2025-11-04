import type { DashboardBreadcrumb } from "../layout/types";
import type { DashboardSelection } from "./selection";

export type DashboardSelectionEventOrigin = "store" | "url" | "user" | "external";

export interface DashboardSelectionEventDetail {
  selection: DashboardSelection;
  origin: DashboardSelectionEventOrigin;
}

export interface DashboardBreadcrumbsEventDetail {
  items: DashboardBreadcrumb[];
  origin?: DashboardSelectionEventOrigin;
}

export const DASHBOARD_SELECTION_EVENT = "dashboard:selection-change";
export const DASHBOARD_BREADCRUMBS_EVENT = "dashboard:breadcrumbs-change";

export const emitDashboardSelectionChange = (
  detail: DashboardSelectionEventDetail,
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(DASHBOARD_SELECTION_EVENT, { detail }));
};

export const emitDashboardBreadcrumbsChange = (
  detail: DashboardBreadcrumbsEventDetail,
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(DASHBOARD_BREADCRUMBS_EVENT, { detail }));
};
