import { type RouteObject } from "react-router-dom";

import { Dashboard } from "@/app/dashboard/Dashboard";
import { PostLoginGate } from "@/app/post-login/PostLoginGate";

export const appRoutes: RouteObject[] = [
  {
    path: "/app",
    element: <PostLoginGate />,
  },
  {
    path: "/dashboard/:campaignId",
    element: <Dashboard />,
  },
];
