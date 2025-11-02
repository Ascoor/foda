import { useEffect, useMemo, useState } from "react";

import {
  DashboardModule,
  DashboardPanel,
  DashboardSubmodule,
  GovernanceRole,
  governanceRoles,
  useDashboardHierarchy,
} from "./data/hierarchy";
import { MainTabs } from "./layout/MainTabs";
import { SideSubTabs } from "./layout/SideSubTabs";
import { ControlPanel } from "./layout/ControlPanel";
import {
  DashboardBreadcrumb,
  DashboardBreadcrumbs,
} from "./layout/DashboardBreadcrumbs";
import { cn } from "../../shared/lib/utils";

const LOCAL_STORAGE_KEY = "architect-dashboard-context";

interface SelectionState {
  moduleId: string;
  submoduleId: string;
  panelId: string;
  role: GovernanceRole;
}

const getDefaultSelection = (modules: DashboardModule[]): SelectionState => {
  const firstModule = modules[0];
  const firstSubmodule = firstModule?.submodules?.[0];
  const firstPanel = firstSubmodule?.panels?.[0];

  return {
    moduleId: firstModule?.id ?? "",
    submoduleId: firstSubmodule?.id ?? "",
    panelId: firstPanel?.id ?? "",
    role: "domain-owner",
  };
};

const ensureSelection = (
  selection: SelectionState,
  modules: DashboardModule[],
): SelectionState => {
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
    submodule?.panels?.[0];

  return {
    moduleId: module?.id ?? "",
    submoduleId: submodule?.id ?? "",
    panelId: panel?.id ?? "",
    role: selection.role ?? "domain-owner",
  };
};

const restoreSelection = (): SelectionState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as SelectionState;

    if (
      parsed &&
      typeof parsed.moduleId === "string" &&
      typeof parsed.submoduleId === "string" &&
      typeof parsed.panelId === "string" &&
      typeof parsed.role === "string"
    ) {
      return parsed;
    }
  } catch (error) {
    console.warn("Failed to restore dashboard selection", error);
  }

  return null;
};

const persistSelection = (selection: SelectionState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selection));
};

export const HierarchicalDashboard = () => {
  const {
    data: modules = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardHierarchy();

  const [selection, setSelection] = useState<SelectionState | null>(null);

  useEffect(() => {
    if (modules.length === 0) {
      return;
    }

    setSelection((previous) => {
      const restored = previous ?? restoreSelection();
      const ensured = restored
        ? ensureSelection(restored, modules)
        : getDefaultSelection(modules);

      persistSelection(ensured);
      return ensured;
    });
  }, [modules]);

  const activeModule = useMemo<DashboardModule | undefined>(() => {
    if (!selection) {
      return undefined;
    }

    return modules.find((module) => module.id === selection.moduleId);
  }, [modules, selection?.moduleId]);

  const activeSubmodule = useMemo<DashboardSubmodule | undefined>(() => {
    if (!selection || !activeModule) {
      return undefined;
    }

    return activeModule.submodules.find(
      (submodule) => submodule.id === selection.submoduleId,
    );
  }, [activeModule, selection?.submoduleId]);

  const activePanel = useMemo<DashboardPanel | undefined>(() => {
    if (!selection || !activeSubmodule) {
      return undefined;
    }

    return activeSubmodule.panels.find((panel) => panel.id === selection.panelId);
  }, [activeSubmodule, selection?.panelId]);

  const handleModuleChange = (moduleId: string) => {
    if (modules.length === 0) {
      return;
    }

    const nextModule = modules.find((module) => module.id === moduleId);
    if (!nextModule) {
      return;
    }

    const nextSubmodule = nextModule.submodules[0];
    const nextPanel = nextSubmodule?.panels?.[0];

    setSelection((prev) => {
      const role = prev?.role ?? "domain-owner";
      const updated: SelectionState = {
        moduleId: nextModule.id,
        submoduleId: nextSubmodule?.id ?? "",
        panelId: nextPanel?.id ?? "",
        role,
      };
      persistSelection(updated);
      return updated;
    });
  };

  const handleSubmoduleChange = (submoduleId: string) => {
    if (!selection || !activeModule) {
      return;
    }

    const nextSubmodule = activeModule.submodules.find(
      (submodule) => submodule.id === submoduleId,
    );

    if (!nextSubmodule) {
      return;
    }

    const nextPanel = nextSubmodule.panels[0];

    setSelection((prev) => {
      if (!prev) {
        return prev;
      }

      const updated: SelectionState = {
        ...prev,
        moduleId: activeModule.id,
        submoduleId: nextSubmodule.id,
        panelId: nextPanel?.id ?? prev.panelId,
      };
      persistSelection(updated);
      return updated;
    });
  };

  const handlePanelChange = (panel: DashboardPanel, submoduleId: string) => {
    setSelection((prev) => {
      if (!prev) {
        return prev;
      }

      const updated: SelectionState = {
        ...prev,
        panelId: panel.id,
        submoduleId,
      };
      persistSelection(updated);
      return updated;
    });
  };

  const handleRoleChange = (role: GovernanceRole) => {
    setSelection((prev) => {
      if (!prev) {
        return prev;
      }

      const updated: SelectionState = { ...prev, role };
      persistSelection(updated);
      return updated;
    });
  };

  const breadcrumbs = useMemo<DashboardBreadcrumb[]>(() => {
    if (!selection) {
      return [];
    }

    const items: DashboardBreadcrumb[] = [];
    if (activeModule) {
      items.push({ id: activeModule.id, label: activeModule.label, level: "module" });
    }

    if (activeSubmodule) {
      items.push({
        id: activeSubmodule.id,
        label: activeSubmodule.label,
        level: "submodule",
      });
    }

    if (activePanel) {
      items.push({ id: activePanel.id, label: activePanel.label, level: "panel" });
    }

    return items;
  }, [selection, activeModule, activeSubmodule, activePanel]);

  const handleBreadcrumbNavigate = (item: DashboardBreadcrumb) => {
    if (item.level === "module") {
      handleModuleChange(item.id);
      return;
    }

    if (item.level === "submodule") {
      handleSubmoduleChange(item.id);
    }
  };

  const roleEntries = useMemo(
    () => Object.entries(governanceRoles) as Array<[GovernanceRole, string]>,
    [],
  );

  if (isError) {
    return (
      <div className="space-y-4 rounded-3xl border border-destructive/40 bg-destructive/10 p-8 text-destructive">
        <div>
          <h2 className="text-lg font-semibold">تعذر تحميل بيانات لوحة التحكم</h2>
          <p className="mt-2 text-sm text-destructive/80">
            {error instanceof Error ? error.message : "حدث خطأ غير متوقع عند جلب البيانات."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void refetch();
          }}
          className="inline-flex items-center justify-center rounded-full border border-destructive/40 bg-background px-4 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (isLoading || !selection) {
    return (
      <div className="glass-card rounded-3xl border border-white/10 bg-background/70 p-10 text-center text-sm text-muted-foreground">
        جارٍ تحميل بيانات لوحة التحكم الهرمية...
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="glass-card rounded-3xl border border-dashed border-white/20 bg-background/70 p-10 text-center text-sm text-muted-foreground">
        لا توجد بيانات متاحة لعرض لوحة التحكم في الوقت الحالي.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            معمل المعمارية – لوحة التحكم الشاملة
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            لوحة تحكم هرمية متعددة المستويات لتنظيم العمليات والموارد، مع ذاكرة سياقية
            تحفظ آخر موقع وزمن استجابة سريع للتنقل بين المسارات.
          </p>
        </div>

        {breadcrumbs.length > 0 && (
          <DashboardBreadcrumbs items={breadcrumbs} onNavigate={handleBreadcrumbNavigate} />
        )}
        <MainTabs
          modules={modules}
          activeModuleId={selection.moduleId}
          onSelect={handleModuleChange}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <div className="space-y-4">
          <div className="glass-card rounded-2xl border border-white/10 bg-background/70 p-4">
            <p className="text-xs font-semibold text-foreground/70">دور الحوكمة</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {roleEntries.map(([role, label]) => {
                const isActive = selection.role === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-semibold transition",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-foreground/5 text-muted-foreground hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">
              يتم حفظ آخر اختيار تلقائياً لضمان استمرار العمل من نفس النقطة الزمنية.
            </p>
          </div>

          {activeModule && (
            <SideSubTabs
              submodules={activeModule.submodules}
              activeSubmoduleId={selection.submoduleId}
              activePanelId={selection.panelId}
              onSelectSubmodule={handleSubmoduleChange}
              onSelectPanel={handlePanelChange}
            />
          )}
        </div>

        <div className="space-y-4">
          {activePanel ? (
            <ControlPanel panel={activePanel} activeRole={selection.role} />
          ) : (
            <div className="glass-card rounded-3xl border border-dashed border-white/20 p-10 text-center text-sm text-muted-foreground">
              لم يتم العثور على لوحة فرعية لهذا الاختيار.
            </div>
          )}

          {activeModule && activeSubmodule && (
            <div className="glass-card rounded-3xl border border-white/10 bg-background/70 p-6">
              <h3 className="text-base font-semibold text-foreground">المخطط الهرمي السريع</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                مخطط شجري يوضح تبويبات القسم الحالي لسهولة المتابعة.
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    القسم الرئيسي
                  </p>
                  <p className="font-semibold text-foreground">{activeModule.label}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    الفرع النشط
                  </p>
                  <p className="font-semibold text-foreground">{activeSubmodule.label}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    اللوحات الفرعية
                  </p>
                  <ul className="space-y-1 text-foreground/80">
                    {activeSubmodule.panels.map((panel) => (
                      <li
                        key={panel.id}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-2",
                          panel.id === activePanel?.id
                            ? "bg-primary/10 text-primary"
                            : "bg-foreground/5",
                        )}
                      >
                        <span>{panel.label}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {panel.actions.length} عمليات
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
