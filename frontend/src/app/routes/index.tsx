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
import { createPlaceholderPage } from "@features/placeholders";
import { useAuth } from "@legacy/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, loading } = useAuth();

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

  return children;
};

const DashboardShell = () => (
  <ProtectedRoute>
    <DashboardLayout />
  </ProtectedRoute>
);

const AnalyticsPage = createPlaceholderPage({
  titleKey: "placeholders.analytics.title",
  descriptionKey: "placeholders.analytics.description",
});

const VolunteersPage = createPlaceholderPage({
  titleKey: "placeholders.volunteers.title",
  descriptionKey: "placeholders.volunteers.description",
});

const VotersPage = createPlaceholderPage({
  titleKey: "placeholders.voters.title",
  descriptionKey: "placeholders.voters.description",
});

const MessagesPage = createPlaceholderPage({
  titleKey: "placeholders.messages.title",
  descriptionKey: "placeholders.messages.description",
});

const FieldToursPage = createPlaceholderPage({
  titleKey: "placeholders.fieldTours.title",
  descriptionKey: "placeholders.fieldTours.description",
});

const DonationsPage = createPlaceholderPage({
  titleKey: "placeholders.donations.title",
  descriptionKey: "placeholders.donations.description",
});

const GOTVPage = createPlaceholderPage({
  titleKey: "placeholders.gotv.title",
  descriptionKey: "placeholders.gotv.description",
});

const SettingsPage = createPlaceholderPage({
  titleKey: "placeholders.settings.title",
  descriptionKey: "placeholders.settings.description",
});

const router = createBrowserRouter([
  {
    element: <Outlet />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
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
