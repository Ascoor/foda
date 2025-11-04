import { navConfig } from "./nav.config";
import type {
  BreadcrumbMatch,
  NavItem,
  NavMapperOptions,
  NavMatch,
  NavNode,
  NavSurface,
  NavTelemetryEvent,
  NavTelemetryHandler,
  NavigationContext,
} from "./nav.schema";

const DEFAULT_ORDER = 9999;
const DEFAULT_SURFACES: NavSurface[] = ["sidebar", "breadcrumb"];

const telemetryHandlers = new Set<NavTelemetryHandler>();

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalisePath = (path?: string) => {
  if (!path) return undefined;
  if (path === "/") return "/";
  const trimmed = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
  return trimmed || "/";
};

const deriveSurfaces = (item: NavItem): NavSurface[] => {
  if (item.surfaces && item.surfaces.length > 0) {
    return Array.from(new Set(item.surfaces));
  }

  if (item.path) {
    return DEFAULT_SURFACES;
  }

  if (item.children && item.children.length > 0) {
    return ["sidebar"];
  }

  return ["sidebar"];
};

const compareOrder = (a: NavItem, b: NavItem) => (a.order ?? DEFAULT_ORDER) - (b.order ?? DEFAULT_ORDER);

const matchesVisibility = (item: NavItem, ctx: NavigationContext): boolean => {
  const rules = item.visibility;
  if (!rules) return true;

  if (rules.roles && rules.roles.length > 0) {
    if (!ctx.role || !rules.roles.includes(ctx.role)) {
      return false;
    }
  }

  if (rules.flagsAny && rules.flagsAny.length > 0) {
    const hasAny = rules.flagsAny.some((flag) => ctx.flags.has(flag));
    if (!hasAny) return false;
  }

  if (rules.flagsAll && rules.flagsAll.length > 0) {
    const hasAll = rules.flagsAll.every((flag) => ctx.flags.has(flag));
    if (!hasAll) return false;
  }

  if (rules.hideWhen && rules.hideWhen.length > 0) {
    if (rules.hideWhen.includes("unauthenticated") && ctx.auth === "unauthenticated") {
      return false;
    }
    if (rules.hideWhen.includes("readonly") && ctx.readonly) {
      return false;
    }
    if (rules.hideWhen.includes(ctx.device)) {
      return false;
    }
  }

  return true;
};

const shouldIncludeSurface = (node: NavNode, surface?: NavSurface, children?: NavNode[]): boolean => {
  if (!surface) return true;
  if (node.surfaces.includes(surface)) {
    return true;
  }
  return Boolean(children?.some((child) => shouldIncludeSurface(child, surface, child.children)));
};

const buildNavTree = (
  items: NavItem[],
  ctx: NavigationContext,
  options: NavMapperOptions,
  parent: NavNode | null,
  depth: number,
): NavNode[] => {
  return items
    .slice()
    .sort(compareOrder)
    .map<NavNode | null>((item) => {
      if (!matchesVisibility(item, ctx)) {
        return null;
      }

      const surfaces = deriveSurfaces(item);
      const node: NavNode = {
        ...item,
        parent: parent ?? undefined,
        depth,
        surfaces,
      };

      if (item.children && item.children.length > 0) {
        const children = buildNavTree(item.children, ctx, options, node, depth + 1);
        if (children.length > 0) {
          node.children = children;
        } else {
          delete node.children;
        }
      }

      if (!shouldIncludeSurface(node, options.surface, node.children)) {
        return null;
      }

      return node;
    })
    .filter((node): node is NavNode => Boolean(node));
};

const flattenNodes = (nodes: NavNode[]): NavNode[] => {
  const acc: NavNode[] = [];
  const walk = (list: NavNode[]) => {
    list.forEach((node) => {
      acc.push(node);
      if (node.children) {
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return acc;
};

const pathToRegex = (path: string, exact?: boolean) => {
  const normalised = normalisePath(path) ?? "/";
  if (normalised === "/") {
    return exact ? /^\/$/ : /^\/(?:.*)?$/;
  }

  const segments = normalised
    .split("/")
    .filter(Boolean)
    .map((segment) => (segment.startsWith(":") ? "[^/]+" : escapeRegex(segment)))
    .join("/");

  if (exact) {
    return new RegExp(`^/${segments}(?:/)?$`);
  }

  return new RegExp(`^/${segments}(?:/.*)?$`);
};

const pathScore = (path: string) => path.split("/").filter(Boolean).length;

const findBestMatch = (pathname: string, nodes: NavNode[]): NavNode | undefined => {
  const normalisedPath = normalisePath(pathname) ?? "/";
  let best: { node: NavNode; score: number } | undefined;

  nodes
    .filter((node) => Boolean(node.path))
    .forEach((node) => {
      const regex = pathToRegex(node.path!, node.exact);
      if (regex.test(normalisedPath)) {
        const score = pathScore(node.path!);
        if (!best || score > best.score) {
          best = { node, score };
        }
      }
    });

  return best?.node;
};

export const createNavigationContext = (
  ctx: Partial<NavigationContext> = {},
): NavigationContext => ({
  role: ctx.role ?? null,
  flags: ctx.flags ?? new Set(),
  device: ctx.device ?? "desktop",
  auth: ctx.auth ?? "unauthenticated",
  readonly: ctx.readonly ?? false,
});

export const getNavTree = (
  ctx: NavigationContext,
  options: NavMapperOptions = {},
): NavNode[] => buildNavTree(navConfig.items, ctx, options, null, 0);

export const getSurfaceNav = (
  ctx: NavigationContext,
  surface: NavSurface,
): NavNode[] => getNavTree(ctx, { surface });

export const flattenRoutes = (
  items: NavItem[] = navConfig.items,
): Array<{ id: string; path: string; exact?: boolean }> => {
  const routes: Array<{ id: string; path: string; exact?: boolean }> = [];
  const walk = (list: NavItem[]) => {
    list.forEach((item) => {
      if (item.path) {
        routes.push({ id: item.id, path: normalisePath(item.path) ?? "/", exact: item.exact });
      }
      if (item.children) {
        walk(item.children);
      }
    });
  };
  walk(items);
  return routes;
};

export const getBreadcrumbTrail = (
  pathname: string,
  ctx: NavigationContext,
): BreadcrumbMatch[] => {
  const tree = getNavTree(ctx, {});
  const nodes = flattenNodes(tree);
  const match = findBestMatch(pathname, nodes);

  if (!match) {
    return [];
  }

  const trail: BreadcrumbMatch[] = [];
  let current: NavNode | undefined = match;
  while (current) {
    if (!current.breadcrumb?.hide) {
      trail.unshift({
        id: current.id,
        i18nKey: current.i18nKey,
        breadcrumbKey: current.breadcrumb?.i18nKey ?? current.i18nKey,
        path: current.path ? normalisePath(current.path) : undefined,
      });
    }
    current = current.parent ?? undefined;
  }

  return trail;
};

export const findRouteMatch = (
  pathname: string,
  ctx: NavigationContext,
): NavMatch | null => {
  const tree = getNavTree(ctx, {});
  const nodes = flattenNodes(tree).filter((node) => Boolean(node.path));
  const match = findBestMatch(pathname, nodes);
  if (!match || !match.path) {
    return null;
  }

  return {
    id: match.id,
    path: match.path,
    exact: match.exact,
    node: match,
  };
};

export const canAccessPath = (pathname: string, ctx: NavigationContext): boolean => {
  const match = findRouteMatch(pathname, ctx);
  const allowed = Boolean(match);
  emitTelemetry({
    type: "nav:guard",
    id: match?.id ?? "unknown",
    path: pathname,
    allowed,
    role: ctx.role ?? null,
    flags: Array.from(ctx.flags),
  });
  return allowed;
};

export const emitTelemetry = (event: NavTelemetryEvent) => {
  telemetryHandlers.forEach((handler) => handler(event));
};

export const notifyNavClick = (
  id: string,
  path: string | undefined,
  ctx: NavigationContext,
  source: string,
) => {
  emitTelemetry({
    type: "nav:click",
    id,
    path,
    role: ctx.role ?? null,
    flags: Array.from(ctx.flags),
    context: source,
  });
};

export const subscribeToNavTelemetry = (handler: NavTelemetryHandler) => {
  telemetryHandlers.add(handler);
  return () => telemetryHandlers.delete(handler);
};

export const clearNavTelemetryHandlers = () => {
  telemetryHandlers.clear();
};

export type { NavNode };
