import React from "react";
import FloatingLandingPage from "@/nextgen/pages/LandingPage";
import { EnhancedDashboard } from "@/modules/dashboard/EnhancedDashboard";

export default function FloatingDashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <FloatingLandingPage />
      </div>
      <div className="relative z-20">
        <EnhancedDashboard />
      </div>
    </div>
  );
}
