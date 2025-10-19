import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

export type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
};

export const StatCard = ({ icon: Icon, label, value, change }: StatCardProps) => (
  <Card className="relative overflow-hidden">
    <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[radial-gradient(circle_at_center,_hsla(var(--primary)/0.18),_transparent_70%)] blur-xl" />
    <CardHeader className="relative">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <CardContent className="mt-4 flex flex-col gap-1 p-0">
        <span className="text-3xl font-semibold text-foreground">{value}</span>
        {change ? (
          <span
            className={cn(
              "text-xs font-semibold",
              change.startsWith("-") ? "text-rose-500" : "text-emerald-500",
            )}
          >
            {change}
          </span>
        ) : null}
      </CardContent>
    </CardHeader>
  </Card>
);
