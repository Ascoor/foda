import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { DashboardShell } from "@/ui/layouts/DashboardShell";

type MainLayoutProps = {
  children?: ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => (
  <DashboardShell>{children ?? <Outlet />}</DashboardShell>
);
