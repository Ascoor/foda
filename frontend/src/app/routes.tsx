import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { BarbaTransitionProvider } from "@/components/transition/BarbaTransitionProvider";
import { NotificationProvider } from "@/shared/contexts/NotificationContext";
import { Login } from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { AuthRedirect } from "@/pages/AuthRedirect";

import { EnhancedDashboard } from "@features/dashboard/EnhancedDashboard";
import { ElectionsList } from "@features/elections/List";
import { ElectionDetails } from "@features/elections/Details";
import { GeoAreasDashboard } from "@features/geo-areas/Dashboard";
import { GeoAreaDetails } from "@features/geo-areas/Details";
import { VotersList } from "@features/voters/List";
import { VoterDetails } from "@features/voters/Details";
import { CandidatesList } from "@features/candidates/List";
import { CandidateDetails } from "@features/candidates/Details";
import { AgentsList } from "@features/agents/AgentsList";
import { VolunteersList } from "@features/volunteers/VolunteersList";
import { ZoneDashboard } from "@features/zones/ZoneDashboard";
import { CommitteesList } from "@features/committees/List";
import { CommitteeDetails } from "@features/committees/Details";
import { Settings } from "@features/settings/Settings";
import { ObservationsList } from "@features/observations/ObservationsList";
import { CampaignsList } from "@features/campaigns/CampaignsList";
import { AutomationDashboard } from "@features/automation/AutomationDashboard";
import FloatingLandingPage from "@features/marketing/pages/LandingPage";
import FloatingDashboard from "@features/marketing/pages/Dashboard";

const RouterShell = () => (
  <BarbaTransitionProvider>
    <Outlet />
  </BarbaTransitionProvider>
);

const MainLayoutWrapper = () => {
  const location = useLocation();
  const namespace = location.pathname.replace(/\//g, "-") || "app";

  return (
    <NotificationProvider>
      <div
        data-barba="container"
        data-barba-namespace={namespace}
        className="min-h-screen"
      >
        <MainLayout />
      </div>
    </NotificationProvider>
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
              { path: "/analytics", element: <ComingSoon module="Analytics" /> },
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
