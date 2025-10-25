import { useMemo, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Settings, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils";
import { useAuth } from "@shared/hooks";

const menuMotion = {
  initial: { opacity: 0, scale: 0.95, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: -4 },
};

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);

  const initials = useMemo(() => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return "CC";
  }, [user?.name]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button
          type="button"
          variant="glass"
          size="sm"
          className="h-10 gap-3 rounded-full px-3 text-sm font-semibold text-[color:var(--header-widget-foreground)]"
          style={{
            background: "var(--header-widget-background)",
            border: "1px solid var(--header-widget-border)",
            boxShadow: "var(--header-widget-shadow)",
            backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
          }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white shadow-[var(--header-avatar-shadow)]"
            style={{ background: "var(--header-avatar-gradient)" }}
          >
            {initials}
          </span>
          <span className="hidden sm:inline-flex max-w-[140px] truncate text-left text-sm font-semibold text-foreground">
            {user?.name ?? t("guest")}
          </span>
        </Button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content sideOffset={12} align="end" className="z-50" asChild>
              <motion.div
                {...menuMotion}
                transition={{ duration: 0.2 }}
                className="min-w-[220px] rounded-[var(--radius-xl)] border border-border/60 bg-surface/90 p-3 text-sm shadow-[var(--shadow-md)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturation)]"
              >
                <div className="rounded-[var(--radius-md)] bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    {t("account")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {user?.name ?? t("guest")}
                  </p>
                </div>

                <DropdownMenu.Item
                  className={cn(
                    "mt-2 flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition hover:bg-muted/50 focus:bg-muted/50",
                  )}
                >
                  <User className="h-4 w-4" />
                  {t("account")}
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  className={cn(
                    "mt-1 flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition hover:bg-muted/50 focus:bg-muted/50",
                  )}
                >
                  <Settings className="h-4 w-4" />
                  {t("settings")}
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onSelect={(event) => {
                    event.preventDefault();
                    void logout();
                  }}
                  className="mt-1 flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-semibold text-red-500 outline-none transition hover:bg-red-500/10 focus:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
};
