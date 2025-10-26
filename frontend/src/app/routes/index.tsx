import { Suspense, type ReactElement } from "react";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { DashboardLayout } from "@app/layouts/dashboard-layout";
import { DashboardPage } from "@features/dashboard/dashboard-page";
import { LandingPage } from "@features/landing/landing-page";
import { LoginPage } from "@features/login/login-page";
import { AnalyticsPage } from "@features/analytics/analytics-page";
import { VolunteersPage } from "@features/volunteers/volunteers-page";
import { VotersPage } from "@features/voters/voters-page";
import { MessagesPage } from "@features/messages/messages-page";
import { FieldToursPage } from "@features/field-tours/field-tours-page";
import { DonationsPage } from "@features/donations/donations-page";
import { GOTVPage } from "@features/gotv/gotv-page";
import { SettingsPage } from "@features/settings/settings-page";
import { VolunteerApp } from "@features/volunteer/volunteer-app";
import { useAuth } from "@shared/hooks";
import type { Role } from "@shared/contexts/role-context";

interface ProtectedRouteProps {
  children: ReactElement;
  role?: Role;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        جارٍ التحقق من صلاحيات الدخول…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const DashboardShell = () => (
  <ProtectedRoute>
    <DashboardLayout />
  </ProtectedRoute>
);

const router = createBrowserRouter([
  {
    element: <Outlet />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "volunteer",
        element: (
          <ProtectedRoute role="volunteer">
            <VolunteerApp />
          </ProtectedRoute>
        ),
      },
      {
        element: <DashboardShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "voters", element: <VotersPage /> },
          { path: "volunteers", element: <VolunteersPage /> },
          { path: "field-tours", element: <FieldToursPage /> },
          { path: "messages", element: <MessagesPage /> },
          { path: "donations", element: <DonationsPage /> },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "gotv", element: <GOTVPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "*", element: <Navigate to="/dashboard" replace /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export const AppRoutes = () => (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        جارٍ تحميل الواجهة…
      </div>
    }
  >
    <RouterProvider router={router} />
  </Suspense>
);

export { router };
