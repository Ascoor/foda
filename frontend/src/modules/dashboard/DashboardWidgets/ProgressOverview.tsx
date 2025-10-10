import { RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProgressChart } from '../components/ProgressChart';

interface ProgressDatum {
  label: string;
  value: number;
  color: 'primary' | 'secondary' | 'accent' | 'success';
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
        <CardTitle className="text-2xl font-semibold tracking-tight">{heading}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-xl border border-[#1C3F60]/20 bg-white/70 text-[#1C3F60] shadow-sm hover:bg-[#E7B10A]/20 hover:text-[#1C3F60] dark:border-white/20 dark:bg-white/10 dark:text-white"
        onClick={onRetry}
        disabled={loading}
        aria-label={heading}
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent>
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
    <CardFooter className="flex flex-col gap-4 border-t border-[#1C3F60]/10 py-4 text-sm text-muted-foreground dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="font-semibold text-foreground">{overallLabel}: </span>
        <span>{Math.round(overall)}%</span>
      </div>
      <div>
        <span className="font-semibold text-foreground">{remainingLabel}: </span>
        <span>{Math.round(remaining)}%</span>
      </div>
    </CardFooter>
  </Card>
);
