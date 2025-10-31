import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../shared/navigation/ProtectedRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import CampaignsIndex from "../features/campaigns/pages/CampaignsIndex";
import CampaignDashboard from "../features/dashboard/pages/CampaignDashboard";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/campaigns", element: <CampaignsIndex /> },
      { path: "/c/:campaignId/dashboard", element: <CampaignDashboard /> },
      { path: "/c/:campaignId/e/:electionId/dashboard", element: <CampaignDashboard /> },
    ],
  },
  { path: "*", element: <LoginPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
