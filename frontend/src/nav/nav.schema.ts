export type Role = 'admin' | 'manager' | 'staff' | 'guest';
export type FeatureFlag = 'betaReports' | 'newBilling' | 'labs';

export type NavVisibilityRule = {
  roles?: Role[];
  flagsAny?: FeatureFlag[];
  flagsAll?: FeatureFlag[];
  hideWhen?: Array<'unauthenticated' | 'readonly' | 'mobile' | 'desktop'>;
};

export type NavSurface = 'sidebar' | 'top' | 'breadcrumb';

export type NavMeta = {
  surfaces?: NavSurface[];
  quickAction?: boolean;
  [key: string]: unknown;
};

export type NavItem = {
  id: string;
  i18nKey: string;
  path?: string;
  icon?: React.ComponentType<any>;
  children?: NavItem[];
  badge?: { type: 'count' | 'dot'; source?: 'inbox' | 'alerts' | string };
  exact?: boolean;
  order?: number;
  visibility?: NavVisibilityRule;
  breadcrumb?: { i18nKey?: string; hide?: boolean };
  meta?: NavMeta;
};

export type NavConfig = { version: number; items: NavItem[] };

export type NavNode = NavItem & {
  parent?: NavNode | null;
  depth: number;
};

export type NavigationContext = {
  role: Role | null;
  flags: Set<FeatureFlag>;
  device: 'mobile' | 'desktop';
  auth: 'authenticated' | 'unauthenticated';
  readonly?: boolean;
};

export type NavMatch = {
  id: string;
  path: string;
  exact?: boolean;
  node: NavNode;
};

export type NavBreadcrumb = {
  id: string;
  i18nKey: string;
  path?: string;
  breadcrumbKey?: string;
};

export type NavGuardReason = 'allowed' | 'not-found' | 'forbidden';

export type NavTelemetryEvent =
  | {
      type: 'nav:click';
      id: string;
      path?: string;
      role: Role | null;
      flags: FeatureFlag[];
      context: 'sidebar' | 'top' | string;
    }
  | {
      type: 'nav:guard';
      id: string;
      path?: string;
      allowed: boolean;
      reason: NavGuardReason;
      role: Role | null;
      flags: FeatureFlag[];
    };

export type NavTelemetryHandler = (event: NavTelemetryEvent) => void;
