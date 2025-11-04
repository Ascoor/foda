import { DashboardModule } from "../data/hierarchy";
import { cn } from "@/infrastructure/shared/lib/utils";

interface MainTabsProps {
  modules: DashboardModule[];
  activeModuleId: string;
  onSelect: (moduleId: string) => void;
}

export const MainTabs = ({
  modules,
  activeModuleId,
  onSelect,
}: MainTabsProps) => {
  return (
    <nav
      className="flex gap-3 overflow-x-auto pb-3"
      aria-label="الأقسام الرئيسية"
    >
      {modules.map((module) => {
        const Icon = module.icon;
        const active = module.id === activeModuleId;
        return (
          <button
            key={module.id}
            type="button"
            onClick={() => onSelect(module.id)}
            className={cn(
              "glass-card min-w-[220px] px-5 py-4 text-start transition-all duration-300",
              "flex items-center gap-3 rounded-2xl border border-white/10",
              active
                ? "ring-2 ring-primary/60 shadow-xl shadow-primary/10"
                : "hover:shadow-lg hover:-translate-y-0.5"
            )}
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </span>
            <span className="flex-1">
              <span className="block text-lg font-semibold text-foreground">
                {module.label}
              </span>
              <span className="block text-xs text-muted-foreground">
                {module.description}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
};
