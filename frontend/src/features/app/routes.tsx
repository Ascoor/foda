import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";

import { ProtectedRoute } from "@/features/legacy/components/ProtectedRoute";
import { MainLayout } from "@/features/legacy/components/layout/MainLayout";
import { BarbaTransitionProvider } from "@/features/legacy/components/transition/BarbaTransitionProvider";

import { Login } from "@/features/legacy/pages/Login";
import NotFound from "@/features/legacy/pages/NotFound";

import { ReportsDashboard } from "@/features/features/reports/ReportsDashboard";
import { ElectionsList } from "@/features/features/elections/List";
import { ElectionDetails } from "@/features/features/elections/Details";
import { GeoAreasDashboard } from "@/features/features/geo-areas/Dashboard";
import { GeoAreaDetails } from "@/features/features/geo-areas/Details";
import { VotersList } from "@/features/features/voters/List";
import { VoterDetails } from "@/features/features/voters/Details";
import { AgentsList } from "@/features/features/agents/AgentsList";
import { CandidatesList } from "@/features/features/candidates/List";
import { CandidateDetails } from "@/features/features/candidates/Details";
import { VolunteersList } from "@/features/features/volunteers/VolunteersList";
import { ZoneDashboard } from "@/features/features/zones/ZoneDashboard";
import { CommitteesList } from "@/features/features/committees/List";
import { CommitteeDetails } from "@/features/features/committees/Details";
import { AutomationDashboard } from "@/features/features/automation/AutomationDashboard";
import { CampaignsList } from "@/features/features/campaigns/CampaignsList";  
import { Settings } from "@/features/features/settings/Settings";
import { ObservationsList } from "@/features/features/observations/ObservationsList";
import FloatingLandingPage from "@/features/features/marketing/pages/LandingPage";
import FloatingDashboard from "@/features/features/marketing/pages/Dashboard";
import PostAuthRedirect from "@/routing/routes/post-auth";
import { NavGuard } from "@/routing/nav/NavGuard"; 
import { EnhancedDashboard } from "@/features/features/dashboard/EnhancedDashboard"; 
import { ArchitecturalControlCenter } from "@/features/features/dashboard/ArchitecturalControlCenter";

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
      { path: "/login", element: <Login /> },
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
                element: (
                  <NavGuard>
                    <EnhancedDashboard />
                  </NavGuard>
                ),
              },
              {
                path: "/control-center",
                element: (
                  <NavGuard>
                    <ArchitecturalControlCenter />
                  </NavGuard>
                ),
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
