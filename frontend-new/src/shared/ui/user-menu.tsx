import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/shared/hooks";
import { useTranslation } from "react-i18next";

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation("common");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden text-sm font-medium sm:inline">
            {user?.name ?? t("guest")}
          </span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[180px] rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <DropdownMenu.Label className="px-2 py-1 text-xs uppercase text-slate-500 dark:text-slate-400">
            {t("account")}
          </DropdownMenu.Label>
          <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-slate-700 outline-none hover:bg-slate-100 focus:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
            <Settings className="h-4 w-4" />
            {t("settings")}
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-red-600 outline-none hover:bg-red-50 focus:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            onSelect={logout}
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
