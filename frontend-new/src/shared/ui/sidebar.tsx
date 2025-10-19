import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Activity,
  Gauge,
  Group,
  HandCoins,
  MapPinned,
  Settings,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

type SidebarProps = {
  className?: string;
};

const NAV_ITEMS = [
  { to: "/dashboard", icon: Gauge, labelKey: "dashboard" },
  { to: "/dashboard/voters", icon: Users, labelKey: "voters" },
  { to: "/volunteers", icon: Group, labelKey: "volunteers" },
  { to: "/dashboard/donations", icon: HandCoins, labelKey: "donations" },
  { to: "/dashboard/reports", icon: Activity, labelKey: "reports" },
  { to: "/dashboard/map", icon: MapPinned, labelKey: "map" },
  { to: "/dashboard/settings", icon: Settings, labelKey: "settings" },
];

export const Sidebar = ({ className }: SidebarProps) => {
  const { t } = useTranslation("common");

  return (
    <aside
      className={cn(
        "hidden w-64 flex-col gap-2 border-r border-slate-200 bg-white/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 lg:flex",
        className
      )}
    >
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, icon: Icon, labelKey }) => (
          <Button
            key={to}
            asChild
            variant="ghost"
            className="justify-start gap-3 text-slate-600 hover:bg-primary/10 hover:text-primary dark:text-slate-300"
          >
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center",
                  isActive && "rounded-lg bg-primary/10 text-primary"
                )
              }
            >
              <Icon className="mr-3 h-4 w-4" />
              <span className="text-sm font-medium">{t(labelKey)}</span>
            </NavLink>
          </Button>
        ))}
      </nav>
    </aside>
  );
};
