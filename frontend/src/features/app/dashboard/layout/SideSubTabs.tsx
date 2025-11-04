import { DashboardPanel, DashboardSubmodule } from "../data/hierarchy";
import { cn } from "@/infrastructure/shared/lib/utils";

interface SideSubTabsProps {
  submodules: DashboardSubmodule[];
  activeSubmoduleId: string;
  activePanelId: string;
  onSelectSubmodule: (submoduleId: string) => void;
  onSelectPanel: (panel: DashboardPanel, submoduleId: string) => void;
}

export const SideSubTabs = ({
  submodules,
  activeSubmoduleId,
  activePanelId,
  onSelectSubmodule,
  onSelectPanel,
}: SideSubTabsProps) => {
  return (
    <aside className="space-y-4" aria-label="الفروع الداخلية">
      {submodules.map((submodule) => {
        const isActiveSubmodule = submodule.id === activeSubmoduleId;
        return (
          <div
            key={submodule.id}
            className="glass-card rounded-2xl border border-white/10 bg-background/60"
          >
            <button
              type="button"
              onClick={() => onSelectSubmodule(submodule.id)}
              className={cn(
                "flex w-full items-start gap-3 px-5 py-4 text-start transition",
                isActiveSubmodule
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="text-base font-semibold">
                  {submodule.label.slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <span className="block text-base font-semibold">
                  {submodule.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {submodule.description}
                </span>
              </div>
            </button>

            <div className="border-t border-white/5" role="tablist">
              {submodule.panels.map((panel) => {
                const Icon = panel.icon;
                const isActivePanel =
                  isActiveSubmodule && panel.id === activePanelId;
                return (
                  <button
                    key={panel.id}
                    type="button"
                    onClick={() => onSelectPanel(panel, submodule.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-5 py-3 text-start text-sm transition",
                      isActivePanel
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                    )}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-background">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 font-medium">{panel.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </aside>
  );
};
