import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MainLayout } from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Dashboard } from "./pages/Dashboard";
import { Campaigns } from "./pages/Campaigns";
import { CampaignReports } from "./pages/CampaignReports";
import { Teams } from "./pages/Teams";
import TeamMembers from "./pages/TeamMembers";
import { Event } from "./pages/Event";
import { Analytics } from "./pages/Analytics";
import Settings  from "./pages/Settings"; 
import NotFound from "./pages/NotFound";
import { Finance } from "./pages/Finance";
import Profile from "./pages/Profile";
 
 
import Area from "./pages/Area"; 
import Swot from "./pages/Swot";
 
import Volunteers from "./pages/Volunteers";

import Voters from "./pages/Voters"; 
import SmsPage from "./pages/Sms";
import SmsSettings from "./pages/SmsSettings";
import ExpenseCategories from "./pages/ExpenseCategories";
import FinancialReport from "./pages/FinancialReport";
import Permission from "./pages/Permission";
import FooterPage from "./pages/Footer";
 
 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Outlet />
                    </MainLayout>
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaigns/reports" element={<CampaignReports />} />
                <Route path="/campaigns/*" element={<Campaigns />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/teams/members" element={<TeamMembers />} />
                <Route path="/teams/*" element={<Teams />} />

                <Route path="/areas" element={<Area />} />
  
                <Route path="/events" element={<Event />} />

                <Route path="/sms" element={<SmsPage />} />
                <Route path="/sms/settings" element={<SmsSettings />} />
 
 
                <Route path="/swots" element={<Swot />} />
 
                <Route path="/volunteers" element={<Volunteers />} />


                <Route path="/voters" element={<Voters />} />
  
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/analytics/*" element={<Analytics />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/finance/categories" element={<ExpenseCategories />} />
                <Route path="/finance/report" element={<FinancialReport />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/permissions" element={<Permission />} />
                <Route path="/footer" element={<FooterPage />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
