import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";

import { ProtectedRoute } from "@legacy/components/ProtectedRoute";
import { MainLayout } from "@legacy/components/layout/MainLayout";
import { BarbaTransitionProvider } from "@legacy/components/transition/BarbaTransitionProvider";
import FloatingLandingPage from "@features/marketing/pages/LandingPage";
import FloatingDashboard from "@features/marketing/pages/Dashboard";

const lazyImport = <T extends Record<string, unknown>, K extends keyof T>(
  loader: () => Promise<T>,
  name: K,
) =>
  lazy(() => loader().then((module) => ({ default: module[name] as T[K] })));

const Login = lazyImport(() => import("@legacy/pages/Login"), "Login");
const NotFound = lazyImport(() => import("@legacy/pages/NotFound"), "default");
const AuthRedirect = lazyImport(() => import("@legacy/pages/AuthRedirect"), "AuthRedirect");
const EnhancedDashboard = lazyImport(
  () => import("@features/dashboard/EnhancedDashboard"),
  "EnhancedDashboard",
);
const ElectionsList = lazyImport(() => import("@features/elections/List"), "ElectionsList");
const ElectionDetails = lazyImport(
  () => import("@features/elections/Details"),
  "ElectionDetails",
);
const GeoAreasDashboard = lazyImport(
  () => import("@features/geo-areas/Dashboard"),
  "GeoAreasDashboard",
);
const GeoAreaDetails = lazyImport(
  () => import("@features/geo-areas/Details"),
  "GeoAreaDetails",
);
const VotersList = lazyImport(() => import("@features/voters/List"), "VotersList");
const VoterDetails = lazyImport(() => import("@features/voters/Details"), "VoterDetails");
const CandidatesList = lazyImport(
  () => import("@features/candidates/List"),
  "CandidatesList",
);
const CandidateDetails = lazyImport(
  () => import("@features/candidates/Details"),
  "CandidateDetails",
);
const AgentsList = lazyImport(() => import("@features/agents/AgentsList"), "AgentsList");
const VolunteersList = lazyImport(
  () => import("@features/volunteers/VolunteersList"),
  "VolunteersList",
);
const ZoneDashboard = lazyImport(
  () => import("@features/zones/ZoneDashboard"),
  "ZoneDashboard",
);
const CommitteesList = lazyImport(
  () => import("@features/committees/List"),
  "CommitteesList",
);
const CommitteeDetails = lazyImport(
  () => import("@features/committees/Details"),
  "CommitteeDetails",
);
const Settings = lazyImport(() => import("@features/settings/Settings"), "Settings");
const ObservationsList = lazyImport(
  () => import("@features/observations/ObservationsList"),
  "ObservationsList",
);
const CampaignsList = lazyImport(
  () => import("@features/campaigns/CampaignsList"),
  "CampaignsList",
);
const AutomationDashboard = lazyImport(
  () => import("@features/automation/AutomationDashboard"),
  "AutomationDashboard",
);
const VolunteerApp = lazyImport(
  () => import("@features/volunteer-mobile/volunteer-app"),
  "VolunteerApp",
);
const MonitoringDashboard = lazyImport(
  () => import("@/ops/monitoring-dashboard"),
  "MonitoringDashboard",
);

const RouterShell = () => (
  <BarbaTransitionProvider>
    <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground">جارٍ تحميل الواجهة...</div>}>
      <Outlet />
    </Suspense>
  </BarbaTransitionProvider>
);

const MainLayoutWrapper = () => {
  const location = useLocation();
  const namespace = location.pathname.replace(/\//g, "-") || "app";

  return (
    <div
      data-barba="container"
      data-barba-namespace={namespace}
      className="min-h-screen"
    >
      <MainLayout />
    </div>
  );
};

const ComingSoon = ({ module }: { module: string }) => (
  <div className="glass-card text-center py-12">
    <h1 className="text-3xl font-bold text-gradient-primary mb-4">{module}</h1>
    <p className="text-muted-foreground">This module is under development</p>
  </div>
);

export const router = createBrowserRouter([
  {
    element: <RouterShell />,
    children: [
      { path: "/", element: <FloatingLandingPage /> },
      { path: "/experience", element: <FloatingDashboard /> },
      { path: "/app", element: <AuthRedirect /> },
      { path: "/volunteer/mobile", element: <VolunteerApp /> },
      { path: "/login", element: <Login /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayoutWrapper />,
            children: [
              { path: "/dashboard", element: <EnhancedDashboard /> },
              { path: "/elections", element: <ElectionsList /> },
              { path: "/elections/:id", element: <ElectionDetails /> },
              { path: "/geo-areas", element: <GeoAreasDashboard /> },
              { path: "/geo-areas/:id", element: <GeoAreaDetails /> },
              { path: "/committees", element: <CommitteesList /> },
              { path: "/committees/:id", element: <CommitteeDetails /> },
              { path: "/voters", element: <VotersList /> },
              { path: "/voters/:id", element: <VoterDetails /> },
              { path: "/candidates", element: <CandidatesList /> },
              { path: "/candidates/:id", element: <CandidateDetails /> },
              { path: "/agents", element: <AgentsList /> },
              { path: "/volunteers", element: <VolunteersList /> },
              { path: "/observations", element: <ObservationsList /> },
              { path: "/campaigns", element: <CampaignsList /> },
              { path: "/automation", element: <AutomationDashboard /> },
              { path: "/ops/monitoring", element: <MonitoringDashboard /> },
              {
                path: "/analytics",
                element: <ComingSoon module="Analytics" />,
              },
              { path: "/zones/mansoura", element: <ZoneDashboard /> },
              { path: "/settings", element: <Settings /> },
              { path: "*", element: <NotFound /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
