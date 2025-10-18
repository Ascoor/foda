import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import FloatingDashboard from "@/nextgen/pages/Dashboard";

export const MainLayout = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname === "/dashboard";

  if (isDashboard) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <FloatingDashboard />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
