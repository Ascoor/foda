import type {
  DashboardModule,
  DashboardPanel,
  DashboardSubmodule,
  GovernanceRole,
} from "../data/hierarchy";
import { governanceRoles } from "../data/hierarchy";
import type { DashboardBreadcrumb } from "../layout/types";

export interface DashboardSelection {
  moduleId: string;
  submoduleId: string;
  panelId: string;
  role: GovernanceRole;
}

export type PartialDashboardSelection = Partial<DashboardSelection>;

export const DEFAULT_GOVERNANCE_ROLE: GovernanceRole = "domain-owner";

const validRoles = new Set<GovernanceRole>(
  Object.keys(governanceRoles) as GovernanceRole[],
);

export const isGovernanceRole = (value: unknown): value is GovernanceRole =>
  typeof value === "string" && validRoles.has(value as GovernanceRole);

const getFirstPanel = (
  submodule: DashboardSubmodule | undefined,
): DashboardPanel | undefined => submodule?.panels?.[0];

export const createDefaultSelection = (
  modules: DashboardModule[],
): DashboardSelection => {
  const firstModule = modules[0];
  const firstSubmodule = firstModule?.submodules?.[0];
  const firstPanel = getFirstPanel(firstSubmodule);

  return {
    moduleId: firstModule?.id ?? "",
    submoduleId: firstSubmodule?.id ?? "",
    panelId: firstPanel?.id ?? "",
    role: DEFAULT_GOVERNANCE_ROLE,
  };
};

export const ensureSelection = (
  selection: DashboardSelection,
  modules: DashboardModule[],
): DashboardSelection => {
  if (modules.length === 0) {
    return selection;
  }

  const module =
    modules.find((item) => item.id === selection.moduleId) ?? modules[0];
  const submodule =
    module.submodules.find((item) => item.id === selection.submoduleId) ??
    module.submodules[0];
  const panel =
    submodule?.panels.find((item) => item.id === selection.panelId) ??
    getFirstPanel(submodule);

  const role = isGovernanceRole(selection.role)
    ? selection.role
    : DEFAULT_GOVERNANCE_ROLE;

  return {
    moduleId: module?.id ?? "",
    submoduleId: submodule?.id ?? "",
    panelId: panel?.id ?? "",
    role,
  };
};

export const mergeSelection = (
  base: DashboardSelection,
  partial: PartialDashboardSelection,
): DashboardSelection => {
  const candidateRole =
    partial.role && isGovernanceRole(partial.role)
      ? partial.role
      : base.role;

  return {
    ...base,
    ...partial,
    role: candidateRole,
  };
};

export const selectionsEqual = (
  current: DashboardSelection | null,
  next: DashboardSelection | null,
): boolean => {
  if (!current && !next) {
    return true;
  }

  if (!current || !next) {
    return false;
  }

  return (
    current.moduleId === next.moduleId &&
    current.submoduleId === next.submoduleId &&
    current.panelId === next.panelId &&
    current.role === next.role
  );
};

export const parseSelectionFromParams = (
  params: URLSearchParams,
): PartialDashboardSelection | null => {
  const moduleId = params.get("module")?.trim();
  const submoduleId = params.get("submodule")?.trim();
  const panelId = params.get("panel")?.trim();
  const roleParam = params.get("role")?.trim();

  const result: PartialDashboardSelection = {};

  if (moduleId) {
    result.moduleId = moduleId;
  }

  if (submoduleId) {
    result.submoduleId = submoduleId;
  }

  if (panelId) {
    result.panelId = panelId;
  }

  if (roleParam && isGovernanceRole(roleParam)) {
    result.role = roleParam;
  }

  return Object.keys(result).length > 0 ? result : null;
};

export const applySelectionToSearchParams = (
  params: URLSearchParams,
  selection: DashboardSelection,
): URLSearchParams => {
  const next = new URLSearchParams(params.toString());
  next.set("module", selection.moduleId);
  next.set("submodule", selection.submoduleId);
  next.set("panel", selection.panelId);
  next.set("role", selection.role);
  return next;
};

export const searchParamsEqual = (
  a: URLSearchParams,
  b: URLSearchParams,
): boolean => a.toString() === b.toString();

export const buildBreadcrumbs = (
  modules: DashboardModule[],
  selection: DashboardSelection | null,
): DashboardBreadcrumb[] => {
  if (!selection) {
    return [];
  }

  const module = modules.find((item) => item.id === selection.moduleId);
  const submodule = module?.submodules.find(
    (item) => item.id === selection.submoduleId,
  );
  const panel = submodule?.panels.find((item) => item.id === selection.panelId);

  const items: DashboardBreadcrumb[] = [];

  if (module) {
    items.push({ id: module.id, label: module.label, level: "module" });
  }

  if (submodule) {
    items.push({
      id: submodule.id,
      label: submodule.label,
      level: "submodule",
    });
  }

  if (panel) {
    items.push({ id: panel.id, label: panel.label, level: "panel" });
  }

  return items;
};
