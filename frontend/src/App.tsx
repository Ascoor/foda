import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import DashboardOverview from "@/pages/Dashboard";
import UsersPage from "@/pages/Dashboard/Users";
import ReportsPage from "@/pages/Dashboard/Reports";
import CampaignsPage from "@/pages/Dashboard/Campaigns";
import SettingsPage from "@/pages/Dashboard/Settings";

import "@/i18n";

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
                <Route path="/" element={<Landing />} />
                <Route path="/auth">
                  <Route index element={<Navigate to="login" replace />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                </Route>
                <Route path="/dashboard" element={<DashboardShell />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="campaigns" element={<CampaignsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const DashboardShell = () => (
  <ProtectedRoute>
    <NotificationProvider>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </NotificationProvider>
  </ProtectedRoute>
);

export default App;
