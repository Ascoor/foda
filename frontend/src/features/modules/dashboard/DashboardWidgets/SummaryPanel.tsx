import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/shared/ui/card";

interface SummaryPanelProps {
  headline: string;
  description: string;
  overallLabel: string;
  overallValue: number;
  turnoutLabel: string;
  turnoutValue: number;
  remainingLabel: string;
  remainingValue: number;
}

export const SummaryPanel = ({
  headline,
  description,
  overallLabel,
  overallValue,
  turnoutLabel,
  turnoutValue,
  remainingLabel,
  remainingValue,
}: SummaryPanelProps) => (
  <Card className="h-full bg-gradient-to-br from-[#1C3F60]/92 via-[#1C3F60]/88 to-[#16324d] text-white shadow-xl">
    <CardHeader>
      <CardTitle className="text-2xl font-semibold tracking-tight text-white">
        {headline}
      </CardTitle>
      <CardDescription className="text-white/80">{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7B10A]/90 text-[#1C3F60] shadow-lg">
          <TrendingUp className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm text-white/70">{overallLabel}</p>
          <p className="text-3xl font-semibold">{overallValue.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-sm text-white/70">{turnoutLabel}</p>
          <p className="text-2xl font-semibold">{Math.round(turnoutValue)}%</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-sm text-white/70">{remainingLabel}</p>
          <p className="text-2xl font-semibold">
            {Math.max(remainingValue, 0).toFixed(1)}%
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
