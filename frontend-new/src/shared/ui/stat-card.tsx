import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
};

export const StatCard = ({ icon: Icon, label, value, change }: StatCardProps) => (
  <Card className="relative overflow-hidden">
    <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10" />
    <CardHeader className="relative">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm text-slate-500 dark:text-slate-300">
          {label}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <CardContent className="mt-4 flex flex-col gap-1 p-0">
        <span className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {change ? (
          <span className="text-xs font-medium text-emerald-500 dark:text-emerald-300">
            {change}
          </span>
        ) : null}
      </CardContent>
    </CardHeader>
  </Card>
);
