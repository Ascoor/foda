import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { Login } from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { Dashboard } from "@/modules/dashboard/Dashboard";
import { ElectionsList } from "@/modules/elections/List";
import { ElectionDetails } from "@/modules/elections/Details";
import { GeoAreasDashboard } from "@/modules/geo-areas/Dashboard";
import { GeoAreaDetails } from "@/modules/geo-areas/Details";
import { VotersList } from "@/modules/voters/List";
import { VoterDetails } from "@/modules/voters/Details";
import { CandidatesList } from "@/modules/candidates/List";
import { CandidateDetails } from "@/modules/candidates/Details";
import { AgentsList } from "@/modules/agents/AgentsList";
import { VolunteersList } from "@/modules/volunteers/VolunteersList";
import { ZoneDashboard } from "@/modules/zones/ZoneDashboard";

import { CommitteesList } from "@/modules/committees/List";
import { CommitteeDetails } from "@/modules/committees/Details";
import { Settings } from "@/modules/settings/Settings";

import { ObservationsList } from "@/modules/observations/ObservationsList";
import { CampaignsList } from "@/modules/campaigns/CampaignsList";
import { AutomationDashboard } from "@/modules/automation/AutomationDashboard";
import { NotificationProvider } from "@/contexts/NotificationContext";
 

 
import "@/i18n";
import { AuthRedirect } from "./pages/AuthRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
  path="/"
  element={
    <AuthRedirect />
  }
/>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayoutWrapper />}>
     <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/elections" element={<ElectionsList />} />
                    <Route path="/elections/:id" element={<ElectionDetails />} />
                    <Route path="/geo-areas" element={<GeoAreasDashboard />} />
                    <Route path="/geo-areas/:id" element={<GeoAreaDetails />} />
                    <Route path="/committees" element={<CommitteesList />} />
                    <Route path="/committees/:id" element={<CommitteeDetails />} />
                    <Route path="/voters" element={<VotersList />} />
                    <Route path="/voters/:id" element={<VoterDetails />} />
                    <Route path="/candidates" element={<CandidatesList />} />
                    <Route path="/candidates/:id" element={<CandidateDetails />} />
                    <Route path="/agents" element={<AgentsList />} />
                    <Route path="/volunteers" element={<VolunteersList />} />

                    <Route path="/observations" element={<ObservationsList />} />
                    <Route path="/campaigns" element={<CampaignsList />} />
                    <Route path="/automation" element={<AutomationDashboard />} />
                    <Route path="/analytics" element={<ComingSoon module="Analytics" />} />
                    <Route path="/zones/mansoura" element={<ZoneDashboard />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const MainLayoutWrapper = () => (
  <NotificationProvider>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </NotificationProvider>
);

// Temporary component for modules under development
const ComingSoon = ({ module }: { module: string }) => (
  <div className="glass-card text-center py-12">
    <h1 className="text-3xl font-bold text-gradient-primary mb-4">{module}</h1>
    <p className="text-muted-foreground">This module is under development</p>
  </div>
);

export default App;
