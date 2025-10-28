import { navConfig } from './nav.config';
import type {
  NavBreadcrumb,
  NavGuardReason,
  NavItem,
  NavMatch,
  NavNode,
  NavSurface,
  NavTelemetryEvent,
  NavTelemetryHandler,
  NavigationContext,
} from './nav.schema';

const DEFAULT_ORDER = 999;
const DEFAULT_SURFACES: NavSurface[] = ['sidebar', 'breadcrumb'];

const telemetryHandlers = new Set<NavTelemetryHandler>();

const normalisePath = (path?: string) => {
  if (!path) return undefined;
  if (path === '/') return '/';
  const trimmed = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return trimmed || '/';
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getSurfaces = (item: NavItem): NavSurface[] => {
  const candidate = item.meta?.surfaces;
  if (Array.isArray(candidate) && candidate.length > 0) {
    const deduped = candidate.filter((surface): surface is NavSurface =>
      surface === 'sidebar' || surface === 'top' || surface === 'breadcrumb',
    );
    if (deduped.length > 0) {
      return Array.from(new Set(deduped));
    }
  }

  if (item.path) {
    return DEFAULT_SURFACES.slice();
  }

  return ['sidebar'];
};

export const visible = (item: NavItem, ctx: NavigationContext): boolean => {
  const v = item.visibility;
  if (!v) return true;
  if (v.roles && v.roles.length > 0) {
    if (!ctx.role || !v.roles.includes(ctx.role)) return false;
  }
  if (v.flagsAny && v.flagsAny.length > 0) {
    if (!v.flagsAny.some((flag) => ctx.flags.has(flag))) return false;
  }
  if (v.flagsAll && v.flagsAll.length > 0) {
    if (!v.flagsAll.every((flag) => ctx.flags.has(flag))) return false;
  }
  if (v.hideWhen && v.hideWhen.length > 0) {
    if (v.hideWhen.includes('unauthenticated') && ctx.auth === 'unauthenticated') {
      return false;
    }
    if (v.hideWhen.includes('readonly') && ctx.readonly) {
      return false;
    }
    if (v.hideWhen.includes(ctx.device)) {
      return false;
    }
  }
  return true;
};

const compareOrder = (a: NavItem, b: NavItem) => (a.order ?? DEFAULT_ORDER) - (b.order ?? DEFAULT_ORDER);

const buildTree = (
  items: NavItem[],
  ctx: NavigationContext,
  parent: NavNode | null,
  depth: number,
  surface?: NavSurface,
): NavNode[] => {
  return items
    .slice()
    .sort(compareOrder)
    .map<NavNode | null>((item) => {
      if (!visible(item, ctx)) {
        return null;
      }

      const node: NavNode = {
        ...item,
        parent: parent ?? undefined,
        depth,
      };

      if (item.children && item.children.length > 0) {
        const children = buildTree(item.children, ctx, node, depth + 1, surface);
        if (children.length > 0) {
          node.children = children;
        } else {
          delete node.children;
        }
      }

      if (surface) {
        const surfaces = getSurfaces(item);
        const includeSelf = surfaces.includes(surface);
        const includeViaChildren = Boolean(node.children && node.children.length > 0);
        if (!includeSelf && !includeViaChildren) {
          return null;
        }
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
        walk(node.children as NavNode[]);
      }
    });
  };
  walk(nodes);
  return acc;
};

const pathToRegex = (path: string, exact?: boolean) => {
  const normalised = normalisePath(path) ?? '/';
  if (normalised === '/') {
    return exact ? /^\/$/ : /^\/(?:.*)?$/;
  }

  const segments = normalised
    .split('/')
    .filter(Boolean)
    .map((segment) => (segment.startsWith(':') ? '[^/]+' : escapeRegex(segment)))
    .join('/');

  if (exact) {
    return new RegExp(`^/${segments}(?:/)?$`);
  }

  return new RegExp(`^/${segments}(?:/.*)?$`);
};

const pathScore = (path: string) => path.split('/').filter(Boolean).length;

const collectAncestors = (node: NavNode | null | undefined): string[] => {
  const ids: string[] = [];
  let current = node?.parent;
  while (current) {
    ids.push(current.id);
    current = current.parent ?? undefined;
  }
  return ids;
};

export const createNavigationContext = (
  ctx: Partial<NavigationContext> = {},
): NavigationContext => ({
  role: ctx.role ?? null,
  flags: ctx.flags ?? new Set(),
  device: ctx.device ?? 'desktop',
  auth: ctx.auth ?? 'unauthenticated',
  readonly: ctx.readonly ?? false,
});

export const getNavTree = (ctx: NavigationContext, surface?: NavSurface): NavNode[] =>
  buildTree(navConfig.items, ctx, null, 0, surface);

export const getNavVersion = () => navConfig.version;

export const flattenRoutes = (items: NavItem[] = navConfig.items) => {
  const out: Array<{ id: string; path: string; exact?: boolean }> = [];
  const walk = (list: NavItem[]) => {
    list.forEach((item) => {
      if (item.path) {
        out.push({ id: item.id, path: normalisePath(item.path) ?? '/', exact: item.exact });
      }
      if (item.children) {
        walk(item.children);
      }
    });
  };
  walk(items);
  return out;
};

const flattenVisibleRoutes = (ctx: NavigationContext) => {
  const tree = getNavTree(ctx);
  return flattenNodes(tree)
    .filter((node) => Boolean(node.path))
    .map((node) => ({ id: node.id, path: node.path!, exact: node.exact }));
};

const findBestMatch = (pathname: string, nodes: Array<{ id: string; path: string; exact?: boolean }>) => {
  const normalisedPath = normalisePath(pathname) ?? '/';
  let best: { id: string; score: number; exact?: boolean } | null = null;
  nodes.forEach((node) => {
    const regex = pathToRegex(node.path, node.exact);
    if (regex.test(normalisedPath)) {
      const score = pathScore(node.path);
      if (!best || score > best.score) {
        best = { id: node.id, score, exact: node.exact };
      }
    }
  });
  return best?.id ?? null;
};

export const matchBreadcrumbs = (pathname: string): string[] => {
  const routes = flattenRoutes();
  const normalisedPath = normalisePath(pathname) ?? '/';
  return routes
    .filter((route) => pathToRegex(route.path, route.exact).test(normalisedPath))
    .sort((a, b) => pathScore(a.path) - pathScore(b.path))
    .map((route) => route.id);
};

export const findRouteMatch = (pathname: string, ctx: NavigationContext): NavMatch | null => {
  const tree = getNavTree(ctx);
  const nodes = flattenNodes(tree).filter((node) => Boolean(node.path));
  const normalisedPath = normalisePath(pathname) ?? '/';
  let best: NavNode | null = null;
  nodes.forEach((node) => {
    const regex = pathToRegex(node.path!, node.exact);
    if (regex.test(normalisedPath)) {
      if (!best || pathScore(node.path!) > pathScore(best.path!)) {
        best = node;
      }
    }
  });
  if (!best || !best.path) return null;
  return { id: best.id, path: best.path, exact: best.exact, node: best };
};

export const getBreadcrumbTrail = (pathname: string, ctx: NavigationContext): NavBreadcrumb[] => {
  const ids = matchBreadcrumbs(pathname);
  if (ids.length === 0) return [];
  const nodes = new Map<string, NavNode>();
  flattenNodes(getNavTree(ctx)).forEach((node) => {
    nodes.set(node.id, node);
  });
  return ids
    .map((id) => nodes.get(id))
    .filter((node): node is NavNode => Boolean(node) && !node.breadcrumb?.hide)
    .map((node) => ({
      id: node.id,
      i18nKey: node.breadcrumb?.i18nKey ?? node.i18nKey,
      path: node.path ? normalisePath(node.path) : undefined,
      breadcrumbKey: node.breadcrumb?.i18nKey,
    }));
};

export const canAccessPath = (pathname: string, ctx: NavigationContext): boolean => {
  const visibleRoutes = flattenVisibleRoutes(ctx);
  const allRoutes = flattenRoutes();
  const normalisedPath = normalisePath(pathname) ?? '/';
  const allowed = visibleRoutes.some((route) => pathToRegex(route.path, route.exact).test(normalisedPath));
  const bestAnyMatch = findBestMatch(normalisedPath, allRoutes);
  let reason: NavGuardReason = 'allowed';
  if (!allowed) {
    reason = bestAnyMatch ? 'forbidden' : 'not-found';
  }
  emitTelemetry({
    type: 'nav:guard',
    id: bestAnyMatch ?? 'unknown',
    path: pathname,
    allowed,
    reason,
    role: ctx.role ?? null,
    flags: Array.from(ctx.flags),
  });
  return allowed;
};

export const notifyNavClick = (id: string, path: string | undefined, ctx: NavigationContext, source: string) => {
  emitTelemetry({
    type: 'nav:click',
    id,
    path,
    role: ctx.role ?? null,
    flags: Array.from(ctx.flags),
    context: source,
  });
};

export const emitTelemetry = (event: NavTelemetryEvent) => {
  telemetryHandlers.forEach((handler) => handler(event));
};

export const subscribeToNavTelemetry = (handler: NavTelemetryHandler) => {
  telemetryHandlers.add(handler);
  return () => telemetryHandlers.delete(handler);
};

export const clearNavTelemetryHandlers = () => {
  telemetryHandlers.clear();
};

export const getActiveItemIds = (pathname: string, ctx: NavigationContext): Set<string> => {
  const match = findRouteMatch(pathname, ctx);
  if (!match) return new Set();
  return new Set([match.id, ...collectAncestors(match.node)]);
};

export type { NavNode };
