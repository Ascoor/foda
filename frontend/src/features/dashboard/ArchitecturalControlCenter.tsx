import { memo } from "react";

import { HierarchicalDashboard } from "@/app/dashboard/HierarchicalDashboard";

const ArchitecturalControlCenterComponent = () => {
  return <HierarchicalDashboard />;
};

export const ArchitecturalControlCenter = memo(ArchitecturalControlCenterComponent);
