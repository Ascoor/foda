import { Flag } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2 text-primary", className)}>
    <Flag className="h-6 w-6" />
    <span className="text-lg font-bold">Campaign HQ</span>
  </div>
);
