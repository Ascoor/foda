import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  canAccessPath,
  clearNavTelemetryHandlers,
  createNavigationContext,
  getBreadcrumbTrail,
  getNavTree,
  matchBreadcrumbs,
  notifyNavClick,
  subscribeToNavTelemetry,
  visible,
} from '../nav.map';

const adminContext = createNavigationContext({
  role: 'admin',
  auth: 'authenticated',
  flags: new Set(),
});

const staffContext = createNavigationContext({
  role: 'staff',
  auth: 'authenticated',
  flags: new Set(),
});

const guestContext = createNavigationContext({
  role: null,
  auth: 'unauthenticated',
  flags: new Set(),
});

describe('navigation mapping', () => {
  beforeEach(() => {
    clearNavTelemetryHandlers();
  });

  it('computes visibility rules correctly', () => {
    const hiddenForGuest = visible(
      { id: 'settings', i18nKey: 'nav.settings', path: '/settings', visibility: { roles: ['admin'] } },
      guestContext,
    );
    const visibleForAdmin = visible(
      { id: 'settings', i18nKey: 'nav.settings', path: '/settings', visibility: { roles: ['admin'] } },
      adminContext,
    );
    expect(hiddenForGuest).toBe(false);
    expect(visibleForAdmin).toBe(true);
  });

  it('returns ordered sidebar tree for admin', () => {
    const sidebar = getNavTree(adminContext, 'sidebar');
    expect(sidebar.map((node) => node.id)).toEqual([
      'dashboard',
      'elections',
      'geoAreas',
      'committees',
      'voters',
      'candidates',
      'fieldOps',
      'campaigns',
      'settings',
    ]);
  });

  it('hides protected entries for unauthenticated users', () => {
    const sidebar = getNavTree(guestContext, 'sidebar');
    expect(sidebar.map((node) => node.id)).toEqual([]);
  });

  it('only shows flag-gated analytics when flag is enabled', () => {
    const topWithoutFlag = getNavTree(adminContext, 'top');
    expect(topWithoutFlag.some((node) => node.id === 'reports')).toBe(false);

    const flaggedContext = createNavigationContext({
      role: 'admin',
      auth: 'authenticated',
      flags: new Set(['betaReports']),
    });

    const topWithFlag = getNavTree(flaggedContext, 'top');
    expect(topWithFlag.some((node) => node.id === 'reports')).toBe(true);
  });

  it('emits telemetry for guard checks and navigation', () => {
    const handler = vi.fn();
    subscribeToNavTelemetry(handler);

    const allowed = canAccessPath('/reports', adminContext);
    const denied = canAccessPath('/reports', guestContext);

    notifyNavClick('dashboard', '/reports', adminContext, 'sidebar');

    expect(allowed).toBe(true);
    expect(denied).toBe(false);
    expect(handler).toHaveBeenCalledTimes(3);

    const [guardAllowed, guardDenied, navEvent] = handler.mock.calls.map((call) => call[0]);
    expect(guardAllowed.type).toBe('nav:guard');
    expect(guardAllowed.allowed).toBe(true);
    expect(guardDenied.allowed).toBe(false);
    expect(navEvent.type).toBe('nav:click');
    expect(navEvent.context).toBe('sidebar');
  });

  it('produces breadcrumbs for deep routes', () => {
    const breadcrumbs = getBreadcrumbTrail('/elections/123', staffContext);
    expect(breadcrumbs.map((crumb) => crumb.id)).toEqual(['elections', 'elections.detail']);
  });

  it('matches breadcrumb ids from pathname', () => {
    expect(matchBreadcrumbs('/voters/12')).toEqual(['voters', 'voters.detail']);
  });

  it('matches snapshot for sidebar contexts', () => {
    expect(getNavTree(adminContext, 'sidebar')).toMatchSnapshot();
    expect(getNavTree(staffContext, 'sidebar')).toMatchSnapshot();
    const mobileContext = createNavigationContext({
      role: 'staff',
      device: 'mobile',
      auth: 'authenticated',
      flags: new Set(),
    });
    expect(getNavTree(mobileContext, 'sidebar')).toMatchSnapshot();
  });
});
