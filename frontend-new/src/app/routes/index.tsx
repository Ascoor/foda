import { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
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

export const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/voters", element: <VotersPage /> },
      { path: "/volunteers", element: <VolunteersPage /> },
      { path: "/field-tours", element: <FieldToursPage /> },
      { path: "/messages", element: <MessagesPage /> },
      { path: "/donations", element: <DonationsPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
      { path: "/gotv", element: <GOTVPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);

export const AppRoutes = () => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading…</div>}>
    <RouterProvider router={router} fallbackElement={<div className="flex h-screen items-center justify-center">Loading…</div>} />
  </Suspense>
);
