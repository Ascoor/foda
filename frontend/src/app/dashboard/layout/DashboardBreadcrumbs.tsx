interface DashboardBreadcrumb {
  id: string;
  label: string;
  level: "module" | "submodule" | "panel";
}

interface DashboardBreadcrumbsProps {
  items: DashboardBreadcrumb[];
  onNavigate?: (item: DashboardBreadcrumb) => void;
}

export const DashboardBreadcrumbs = ({
  items,
  onNavigate,
}: DashboardBreadcrumbsProps) => {
  return (
    <nav
      className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      aria-label="التنقل الهرمي"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast) {
          return (
            <span
              key={item.id}
              className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary"
            >
              {item.label}
            </span>
          );
        }

        return (
          <span key={item.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate?.(item)}
              className="rounded-full bg-background/80 px-3 py-1 text-foreground transition hover:bg-primary/10 hover:text-primary"
            >
              {item.label}
            </button>
            <span className="text-foreground/40">›</span>
          </span>
        );
      })}
    </nav>
  );
};

export type { DashboardBreadcrumb };
