import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import type { DashboardModule } from "../data/hierarchy";
import { emitDashboardBreadcrumbsChange } from "./events";
import { useDashboardSelectionStore } from "./dashboardSelectionStore";
import {
  applySelectionToSearchParams,
  buildBreadcrumbs,
  createDefaultSelection,
  ensureSelection,
  mergeSelection,
  parseSelectionFromParams,
  searchParamsEqual,
  selectionsEqual,
} from "./selection";

export const useDashboardSelectionSync = (modules: DashboardModule[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selection = useDashboardSelectionStore((state) => state.selection);
  const setSelection = useDashboardSelectionStore((state) => state.setSelection);
  const lastOrigin = useDashboardSelectionStore((state) => state.lastOrigin);
  const skipNextUrlSyncRef = useRef(false);
  const lastBreadcrumbSignatureRef = useRef<string>("");

  useEffect(() => {
    if (!modules.length) {
      return;
    }

    setSelection((previous) => {
      const base = previous ?? createDefaultSelection(modules);
      const ensured = ensureSelection(base, modules);
      if (selectionsEqual(previous, ensured)) {
        return previous ?? ensured;
      }

      return ensured;
    });
  }, [modules, setSelection]);

  useEffect(() => {
    if (!modules.length) {
      return;
    }

    const parsed = parseSelectionFromParams(searchParams);
    if (!parsed) {
      return;
    }

    setSelection(
      (previous) => {
        const base = previous ?? createDefaultSelection(modules);
        const merged = mergeSelection(base, parsed);
        const ensured = ensureSelection(merged, modules);
        if (selectionsEqual(previous, ensured)) {
          return previous ?? ensured;
        }

        skipNextUrlSyncRef.current = true;
        return ensured;
      },
      { origin: "url" },
    );
  }, [modules, searchParams, setSelection]);

  useEffect(() => {
    if (!modules.length || !selection) {
      return;
    }

    const ensured = ensureSelection(selection, modules);
    if (!selectionsEqual(selection, ensured)) {
      setSelection(ensured);
      return;
    }

    if (skipNextUrlSyncRef.current) {
      skipNextUrlSyncRef.current = false;
    } else {
      const nextParams = applySelectionToSearchParams(searchParams, ensured);
      if (!searchParamsEqual(searchParams, nextParams)) {
        setSearchParams(nextParams, { replace: true });
      }
    }
  }, [modules, searchParams, selection, setSearchParams, setSelection]);

  const breadcrumbs = useMemo(
    () => buildBreadcrumbs(modules, selection),
    [modules, selection],
  );

  useEffect(() => {
    if (breadcrumbs.length === 0) {
      return;
    }

    const signature = JSON.stringify(breadcrumbs);
    if (signature === lastBreadcrumbSignatureRef.current) {
      return;
    }

    lastBreadcrumbSignatureRef.current = signature;
    emitDashboardBreadcrumbsChange({ items: breadcrumbs, origin: lastOrigin });
  }, [breadcrumbs, lastOrigin]);
};
