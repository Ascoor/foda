import { useMemo } from "react";

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
import { DashboardBreadcrumbs } from "./layout/DashboardBreadcrumbs";
import type { DashboardBreadcrumb } from "./layout/types";
import { cn } from "@/infrastructure/shared/lib/utils";
import { useDashboardSelectionStore } from "./state/dashboardSelectionStore";
import { useDashboardSelectionSync } from "./state/useDashboardSelectionSync";
import {
  DEFAULT_GOVERNANCE_ROLE,
  buildBreadcrumbs,
} from "./state/selection";

export const HierarchicalDashboard = () => {
  const {
    data: modules = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardHierarchy();

  useDashboardSelectionSync(modules);

  const selection = useDashboardSelectionStore((state) => state.selection);
  const setSelection = useDashboardSelectionStore((state) => state.setSelection);
  const updateSelection = useDashboardSelectionStore(
    (state) => state.updateSelection,
  );

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

    setSelection(
      (previous) => ({
        moduleId: nextModule.id,
        submoduleId: nextSubmodule?.id ?? "",
        panelId: nextPanel?.id ?? "",
        role: previous?.role ?? DEFAULT_GOVERNANCE_ROLE,
      }),
      { origin: "user" },
    );
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

    setSelection(
      (previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          moduleId: activeModule.id,
          submoduleId: nextSubmodule.id,
          panelId: nextPanel?.id ?? previous.panelId,
        };
      },
      { origin: "user" },
    );
  };

  const handlePanelChange = (panel: DashboardPanel, submoduleId: string) => {
    setSelection(
      (previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          panelId: panel.id,
          submoduleId,
        };
      },
      { origin: "user" },
    );
  };

  const handleRoleChange = (role: GovernanceRole) => {
    updateSelection({ role }, { origin: "user" });
  };

  const breadcrumbs = useMemo<DashboardBreadcrumb[]>(
    () => buildBreadcrumbs(modules, selection),
    [modules, selection],
  );

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
            {error instanceof Error
              ? error.message
              : "حدث خطأ غير متوقع عند جلب البيانات."}
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
          <DashboardBreadcrumbs
            items={breadcrumbs}
            onNavigate={handleBreadcrumbNavigate}
          />
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
