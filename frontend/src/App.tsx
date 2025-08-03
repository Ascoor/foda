import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/modules/dashboard/Dashboard";
import { ElectionsList } from "@/modules/elections/ElectionsList";
import { GeoAreasList } from "@/modules/geo-areas/GeoAreasList";
import { VotersList } from "@/modules/voters/VotersList";
import { CommitteesList } from "@/modules/committees/List";
import { CommitteeDetails } from "@/modules/committees/Details";
import "@/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/elections" element={<ElectionsList />} />
                <Route path="/geo-areas" element={<GeoAreasList />} />
                <Route path="/committees" element={<CommitteesList />} />
                <Route path="/committees/:id" element={<CommitteeDetails />} />
                <Route path="/voters" element={<VotersList />} />
                <Route path="/candidates" element={<ComingSoon module="Candidates" />} />
                <Route path="/agents" element={<ComingSoon module="Agents" />} />
                <Route path="/volunteers" element={<ComingSoon module="Volunteers" />} />
                <Route path="/observations" element={<ComingSoon module="Observations" />} />
                <Route path="/campaigns" element={<ComingSoon module="Campaigns" />} />
                <Route path="/analytics" element={<ComingSoon module="Analytics" />} />
                <Route path="/settings" element={<ComingSoon module="Settings" />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

// Temporary component for modules under development
const ComingSoon = ({ module }: { module: string }) => (
  <div className="glass-card text-center py-12">
    <h1 className="text-3xl font-bold text-gradient-primary mb-4">{module}</h1>
    <p className="text-muted-foreground">This module is under development</p>
  </div>
);

export default App;
