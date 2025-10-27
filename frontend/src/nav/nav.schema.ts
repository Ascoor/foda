export type Role =
  | "admin"
  | "manager"
  | "staff"
  | "guest"
  | (string & {});

export type FeatureFlag = "betaReports" | "newBilling" | "labs" | (string & {});

export type NavVisibilityRule = {
  roles?: Role[];
  flagsAny?: FeatureFlag[];
  flagsAll?: FeatureFlag[];
  hideWhen?: Array<"unauthenticated" | "readonly" | "mobile" | "desktop">;
};

export type NavBadge = {
  type: "count" | "dot";
  source?: "inbox" | "alerts" | string;
};

export type NavSurface = "sidebar" | "top" | "breadcrumb" | "footer";

export type NavItem = {
  id: string;
  i18nKey: string;
  path?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ComponentType<any>;
  children?: NavItem[];
  badge?: NavBadge;
  exact?: boolean;
  order?: number;
  visibility?: NavVisibilityRule;
  breadcrumb?: { i18nKey?: string; hide?: boolean };
  meta?: Record<string, unknown>;
  surfaces?: NavSurface[];
};

export type NavConfig = {
  version: number;
  items: NavItem[];
};

export type NavNode = NavItem & {
  parent?: NavNode | null;
  depth: number;
  surfaces: NavSurface[];
};

export type NavigationContext = {
  role: Role | null;
  flags: Set<FeatureFlag>;
  device: "mobile" | "desktop";
  auth: "authenticated" | "unauthenticated";
  readonly?: boolean;
};

export type NavTrail = {
  id: string;
  i18nKey: string;
  path?: string;
  breadcrumbKey?: string;
};

export type NavTelemetryEvent =
  | {
      type: "nav:click";
      id: string;
      path?: string;
      role: Role | null;
      flags: FeatureFlag[];
      context: "sidebar" | "top" | string;
    }
  | {
      type: "nav:guard";
      id: string;
      path?: string;
      allowed: boolean;
      role: Role | null;
      flags: FeatureFlag[];
    };

export type NavTelemetryHandler = (event: NavTelemetryEvent) => void;

export type NavMapperOptions = {
  surface?: NavSurface;
};

export type NavMatch = {
  id: string;
  path: string;
  exact?: boolean;
  node: NavNode;
};

export type BreadcrumbMatch = {
  id: string;
  i18nKey: string;
  breadcrumbKey?: string;
  path?: string;
};
