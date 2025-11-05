import { RefreshCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/infrastructure/shared/ui/card";
import { Button } from "@/infrastructure/shared/ui/button";
import { Skeleton } from "@/infrastructure/shared/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/infrastructure/shared/ui/alert";
import { ProgressChart } from "../components/ProgressChart";

interface ProgressDatum {
  label: string;
  value: number;
  color: "primary" | "secondary" | "accent" | "success";
}

interface ProgressOverviewProps {
  data: ProgressDatum[];
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  overall: number;
  remaining: number;
  heading: string;
  description: string;
  overallLabel: string;
  remainingLabel: string;
}

export const ProgressOverview = ({
  data,
  loading,
  error,
  onRetry,
  overall,
  remaining,
  heading,
  description,
  overallLabel,
  remainingLabel,
}: ProgressOverviewProps) => (
  <Card className="h-full overflow-hidden">
    <CardHeader className="flex flex-row items-start justify-between gap-4">
      <div>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {heading}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-xl border border-[hsla(var(--primary)/0.25)] bg-[hsla(var(--surface)/0.85)] text-[hsl(var(--primary))] shadow-sm transition-colors hover:bg-[hsla(var(--primary)/0.08)] hover:text-[hsl(var(--primary))] dark:border-[hsla(var(--border)/0.3)] dark:bg-[hsla(var(--background)/0.55)] dark:text-[hsl(var(--primary-foreground))]"
        onClick={onRetry}
        disabled={loading}
        aria-label={heading}
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent className="space-y-6">
      {loading ? (
        <Skeleton className="h-72 w-full rounded-3xl" />
      ) : error ? (
        <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTitle>{heading}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : (
        <ProgressChart data={data} overall={overall} remaining={remaining} />
      )}
    </CardContent>
    <CardFooter className="flex flex-col gap-4 rounded-b-[var(--radius-xl)] border-t border-[hsla(var(--border)/0.25)] bg-[hsla(var(--surface)/0.5)] py-6 text-sm text-muted-foreground backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center rounded-lg bg-[hsla(var(--primary)/0.15)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--primary))]">
          {overallLabel}
        </span>
        <span className="text-lg font-semibold text-foreground">
          {Math.round(overall)}%
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center rounded-lg bg-[hsla(var(--accent)/0.15)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
          {remainingLabel}
        </span>
        <span className="text-lg font-semibold text-foreground">
          {Math.round(remaining)}
        </span>
      </div>
    </CardFooter>
  </Card>
);
