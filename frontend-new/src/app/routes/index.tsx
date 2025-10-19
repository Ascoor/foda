import { Suspense } from "react";
import type { ReactElement } from "react";
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { DashboardLayout } from "@app/layouts/dashboard-layout";
import { DashboardPage } from "@features/dashboard/dashboard-page";
import { VotersPage } from "@features/voters/voters-page";
import { VolunteersPage } from "@features/volunteers/volunteers-page";
import { DonationsPage } from "@features/donations/donations-page";
import { AnalyticsPage } from "@features/analytics/analytics-page";
import { GOTVPage } from "@features/gotv/gotv-page";
import { SettingsPage } from "@features/settings/settings-page";
import { MessagesPage } from "@features/messages/messages-page";
import { FieldToursPage } from "@features/field-tours/field-tours-page";
import { LandingPage } from "@features/landing/landing-page";
import { LoginPage } from "@features/login/login-page";
import { VolunteerApp } from "@features/volunteer/volunteer-app";
import { useAuth } from "@/shared/hooks";
import type { Role } from "@/shared/contexts/role-context";

type ProtectedRouteProps = {
  role?: Role;
  children: ReactElement;
};

const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
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
        path: "",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
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
        ],
      },
    ],
  },
]);

export const AppRoutes = () => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading…</div>}>
    <RouterProvider
      router={router}
      fallbackElement={<div className="flex h-screen items-center justify-center">Loading…</div>}
    />
  </Suspense>
);
