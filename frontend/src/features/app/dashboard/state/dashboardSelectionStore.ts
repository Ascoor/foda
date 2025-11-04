import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  emitDashboardSelectionChange,
  type DashboardSelectionEventOrigin,
} from "./events";
import {
  DEFAULT_GOVERNANCE_ROLE,
  type DashboardSelection,
  isGovernanceRole,
  selectionsEqual,
} from "./selection";

export const DASHBOARD_SELECTION_STORAGE_KEY = "architect-dashboard-context";

type SelectionUpdater =
  | DashboardSelection
  | null
  | ((previous: DashboardSelection | null) => DashboardSelection | null);

interface SetSelectionOptions {
  emitEvent?: boolean;
  origin?: DashboardSelectionEventOrigin;
}

interface DashboardSelectionStore {
  selection: DashboardSelection | null;
  lastOrigin: DashboardSelectionEventOrigin;
  setSelection: (updater: SelectionUpdater, options?: SetSelectionOptions) => void;
  updateSelection: (
    patch: Partial<DashboardSelection>,
    options?: SetSelectionOptions,
  ) => void;
  clearSelection: () => void;
}

const storage =
  typeof window !== "undefined"
    ? createJSONStorage(() => window.localStorage)
    : undefined;

export const useDashboardSelectionStore = create<DashboardSelectionStore>()(
  persist(
    (set, get) => ({
      selection: null,
      lastOrigin: "store",
      setSelection: (updater, options) => {
        set((state) => {
          const next =
            typeof updater === "function"
              ? (updater as (prev: DashboardSelection | null) => DashboardSelection | null)(
                  state.selection,
                )
              : updater;

          const origin = options?.origin ?? state.lastOrigin ?? "store";

          if (selectionsEqual(state.selection, next)) {
            return {};
          }

          if (next && (options?.emitEvent ?? true)) {
            emitDashboardSelectionChange({ selection: next, origin });
          }

          return {
            selection: next ?? null,
            lastOrigin: origin,
          };
        });
      },
      updateSelection: (patch, options) => {
        const current = get().selection;
        if (!current) {
          return;
        }

        const nextRole = patch.role ?? current.role;
        const role = isGovernanceRole(nextRole)
          ? nextRole
          : DEFAULT_GOVERNANCE_ROLE;

        get().setSelection(
          {
            ...current,
            ...patch,
            role,
          },
          options,
        );
      },
      clearSelection: () => {
        set({ selection: null, lastOrigin: "store" });
      },
    }),
    {
      name: DASHBOARD_SELECTION_STORAGE_KEY,
      partialize: (state) => ({ selection: state.selection }),
      storage,
    },
  ),
);
