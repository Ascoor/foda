import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";

import { ProtectedRoute } from "@legacy/components/ProtectedRoute";
import { MainLayout } from "@legacy/components/layout/MainLayout";
import { BarbaTransitionProvider } from "@legacy/components/transition/BarbaTransitionProvider";

import { Login as LegacyLogin } from "@legacy/pages/Login";
import { Login } from "@/pages/Login";
import { CampaignDashboard } from "@/pages/CampaignDashboard";
import { CampaignsIndex } from "@/pages/CampaignsIndex";
import NotFound from "@legacy/pages/NotFound";

import { ReportsDashboard } from "@features/reports/ReportsDashboard";
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
import PostAuthRedirect from "@/routes/post-auth";
import { NavGuard } from "@/nav/NavGuard";
import { ElectionDashboard } from "@/pages/ElectionDashboard";

const RouterShell = () => (
  <BarbaTransitionProvider>
    <Outlet />
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
      { path: "/app", element: <PostAuthRedirect /> },
      { path: "/legacy-login", element: <LegacyLogin /> },
      { path: "/login", element: <Login /> },
      {
        path: "/campaigns",
        element: (
          <ProtectedRoute>
            <CampaignsIndex />
          </ProtectedRoute>
        ),
      },
      {
        path: "/c/:campaignId/dashboard",
        element: (
          <ProtectedRoute>
            <CampaignDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/c/:campaignId/e/:electionId/dashboard",
        element: (
          <ProtectedRoute>
            <ElectionDashboard />
          </ProtectedRoute>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayoutWrapper />,
            children: [
              {
                path: "/reports",
                element: (
                  <NavGuard>
                    <ReportsDashboard />
                  </NavGuard>
                ),
              },
              {
                path: "/dashboard",
                element: <Navigate to="/reports" replace />,
              },
              {
                path: "/elections",
                element: (
                  <NavGuard>
                    <ElectionsList />
                  </NavGuard>
                ),
              },
              {
                path: "/elections/:id",
                element: (
                  <NavGuard>
                    <ElectionDetails />
                  </NavGuard>
                ),
              },
              {
                path: "/geo-areas",
                element: (
                  <NavGuard>
                    <GeoAreasDashboard />
                  </NavGuard>
                ),
              },
              {
                path: "/geo-areas/:id",
                element: (
                  <NavGuard>
                    <GeoAreaDetails />
                  </NavGuard>
                ),
              },
              {
                path: "/committees",
                element: (
                  <NavGuard>
                    <CommitteesList />
                  </NavGuard>
                ),
              },
              {
                path: "/committees/:id",
                element: (
                  <NavGuard>
                    <CommitteeDetails />
                  </NavGuard>
                ),
              },
              {
                path: "/voters",
                element: (
                  <NavGuard>
                    <VotersList />
                  </NavGuard>
                ),
              },
              {
                path: "/voters/:id",
                element: (
                  <NavGuard>
                    <VoterDetails />
                  </NavGuard>
                ),
              },
              {
                path: "/candidates",
                element: (
                  <NavGuard>
                    <CandidatesList />
                  </NavGuard>
                ),
              },
              {
                path: "/candidates/:id",
                element: (
                  <NavGuard>
                    <CandidateDetails />
                  </NavGuard>
                ),
              },
              {
                path: "/agents",
                element: (
                  <NavGuard>
                    <AgentsList />
                  </NavGuard>
                ),
              },
              {
                path: "/volunteers",
                element: (
                  <NavGuard>
                    <VolunteersList />
                  </NavGuard>
                ),
              },
              {
                path: "/observations",
                element: (
                  <NavGuard>
                    <ObservationsList />
                  </NavGuard>
                ),
              },
              {
                path: "/campaigns",
                element: (
                  <NavGuard>
                    <CampaignsList />
                  </NavGuard>
                ),
              },
              {
                path: "/automation",
                element: (
                  <NavGuard>
                    <AutomationDashboard />
                  </NavGuard>
                ),
              },
              {
                path: "/analytics",
                element: (
                  <NavGuard>
                    <ComingSoon module="Analytics" />
                  </NavGuard>
                ),
              },
              {
                path: "/zones/mansoura",
                element: (
                  <NavGuard>
                    <ZoneDashboard />
                  </NavGuard>
                ),
              },
              {
                path: "/settings",
                element: (
                  <NavGuard>
                    <Settings />
                  </NavGuard>
                ),
              },
              { path: "*", element: <NotFound /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
